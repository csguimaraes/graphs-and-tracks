import {
	Component, ElementRef,
	OnInit, AfterViewInit,
	Input, Output, EventEmitter, HostListener,
	ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, ViewChild, SimpleChanges, OnChanges
} from '@angular/core'

import * as Hammer from 'hammerjs'
import { Tween } from 'tween.js'

import { MotionData, ChallengeMode, DataType, UI_CONTROL, TrialError } from '../types'
import { Motion } from '../motion.model'

declare let d3

@Component({
	selector: 'gt-graphs-panel',
	templateUrl: './graphs-panel.component.html',
	styleUrls: ['./graphs-panel.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphsPanelComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
	@Input() mode: ChallengeMode
	@Input() goal: Motion
	@ViewChild('goalLine') goalLine: ElementRef

	goalData: MotionData[]
	goalLinePath: string

	trialsData: MotionData[][]
	trialLinePaths: string[]

	margin = {top: 20, right: 20, bottom: 30, left: 50}
	height: number = 0
	width: number = 0

	activeGraph: DataType
	axisTitle: string
	svg: any
	mainGroup: any
	scaleX: any
	scaleY: any

	lineToClip: number
	trialClip: SVGRectElement

	@Output()
	change = new EventEmitter<UI_CONTROL>()

	activeUrl
	initialized = false
	zoomActive = false
	velocityDomain: number[]
	doubleTapRecognizer: HammerManager
	requestingSelectionOf: DataType
	autoClearTrials = true

	constructor(private elementRef: ElementRef, private changeDetector: ChangeDetectorRef) {
		this.trialsData = []
	}

	ngOnInit() {
		// Store references of the HTML
		this.svg = this.elementRef.nativeElement.querySelector('svg#chart')
		this.mainGroup = d3.select(this.svg.querySelector('g#main-group'))
		this.trialClip = this.svg.querySelector('#trial-line-clip rect')
		this.activeGraph = 's'
	}

	ngAfterViewInit() {
		this.initialized = true

		let recognizer = this.doubleTapRecognizer = new Hammer.Manager(<any> this.svg)
		recognizer.add(new Hammer.Tap({event: 'doubletap', taps: 2}))
		recognizer.on('doubletap', ev => {
			this.toggleZoom()
		})

		this.goalData = this.goal.data
		this.safeRefresh()
	}

	ngOnDestroy() {
		if (this.doubleTapRecognizer) {
			this.doubleTapRecognizer.destroy()
			this.doubleTapRecognizer = null
		}
	}


	animateGoalUpdate(goalMotionData: MotionData[]) {
		if (this.initialized !== true) {
			return
		}

		// First just clear the graph still using the previous goal
		this.velocityDomain = undefined

		// Plot goal line
		let newGoalLine = this.generateLinePath(goalMotionData, this.activeGraph)
		let goalLine = d3.select(this.goalLine.nativeElement)
		goalLine
			.transition()
			.duration(600)
			.attr('d', newGoalLine)
			.on('end', () => {
				// Queue a change detection
				this.goalData = goalMotionData
				this.goalLinePath = newGoalLine
				this.changeDetector.markForCheck()
			})
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['goal']) {
			this.velocityDomain = undefined
			this.goalData = this.goal.data
			this.safeRefresh(true, true)
		}
	}


	clearHighlights() {
		this.requestingSelectionOf = undefined
	}

	highlightError(error: TrialError) {
		if (error.type !== this.activeGraph) {
			switch (error.type) {
				case 's':
					this.highlightControl(UI_CONTROL.POSITION_GRAPH)
					break
				case 'v':
					this.highlightControl(UI_CONTROL.VELOCITY_GRAPH)
					break
				case 'a':
					this.highlightControl(UI_CONTROL.ACCELERATION_GRAPH)
					break
			}
		}
	}

	highlightControl(control: UI_CONTROL) {
		switch (control) {
			case UI_CONTROL.POSITION_GRAPH:
				this.requestingSelectionOf = 's'
				break

			case UI_CONTROL.VELOCITY_GRAPH:
				this.requestingSelectionOf = 'v'
				break

			case UI_CONTROL.ACCELERATION_GRAPH:
				this.requestingSelectionOf = 'a'
				break
		}

		this.changeDetector.markForCheck()
	}

	selectGraph(type: DataType, refresh = true) {
		if (type !== this.activeGraph) {
			this.activeGraph = type

			if (refresh) {
				this.refresh(true, this.autoClearTrials)
			}

			switch (type) {
				case 's':
					this.change.emit(UI_CONTROL.POSITION_GRAPH)
					break
				case 'v':
					this.change.emit(UI_CONTROL.VELOCITY_GRAPH)
					break
				case 'a':
					this.change.emit(UI_CONTROL.ACCELERATION_GRAPH)
					break
			}
		}

		if (type === this.requestingSelectionOf) {
			this.requestingSelectionOf = undefined
		}
	}

	addTrialData(data: MotionData[]) {
		this.trialsData.push(data)

		// Clear cached data domain for velocity
		this.velocityDomain = undefined

		this.refresh(true)
	}

	safeRefresh(animated = false, clearTrials = false) {
		// Queue a change detection
		this.changeDetector.markForCheck()
		// Queue a refresh
		setTimeout(() => this.refresh(animated, clearTrials), 1)
	}

	refresh(animated = false, clearTrials = false) {
		if (this.initialized === false) {
			return
		}

		if (clearTrials) {
			this.trialsData = []
		}

		if (animated) {
			if (this.trialsData.length) {
				this.lineToClip = this.trialsData.length - 1
			} else {
				this.lineToClip = -1
			}
		} else {
			this.lineToClip = undefined
		}

		this.activeUrl = document.location.pathname

		let svgRect = this.svg.getBoundingClientRect()
		this.width = svgRect.width - this.margin.left - this.margin.right
		this.height = svgRect.height - this.margin.top - this.margin.bottom

		let data = this.goalData
		let type = this.activeGraph

		let scaleX = this.scaleX = d3.scaleLinear()
			.range([0, this.width])
			.domain([0, this.mode.simulation.duration])

		let scaleY = this.scaleY = d3.scaleLinear()
			.range([this.height, 0])

		let ticks: any

		// Specific configurations for each graph type
		switch (type) {
			case 's':
				// Position graph uses the track size as data domain
				let pos = this.mode.domain.position
				scaleY.domain([pos.min, pos.max])

				ticks = 6
				this.axisTitle = 'Position (cm)'
				break

			case 'v':
				scaleY.domain(this.getVelocityDomain())
				ticks = this.height > 200 ? 10 : 5
				this.axisTitle = 'Velocity (cm/s)'
				break

			case 'a':
				// Here we use the maximum acceleration possible to achieve
				let postsDomain = this.mode.domain.posts
				let maxAcceleration = (postsDomain.max - postsDomain.min) * 10
				scaleY.domain([maxAcceleration * -1, maxAcceleration])

				ticks = 5
				this.axisTitle = 'Acceleration (cm/s²)'
				break

			default:
				throw 'Unknown graph type'
		}

		// Add the X Axis
		let axisX = d3
			.axisBottom(scaleX)
			.tickValues([5, 10, 15, 20, 25]) // FIXME: should be based on duration

		if (this.mainGroup) {
			this.mainGroup.selectAll('.axis').remove()
		}

		this.mainGroup.append('g')
			.attr('class', 'axis axis-x')
			.attr('transform', 'translate(0,' + scaleY(0) + ')')
			.call(axisX)

		// Add X Axis title based on last tick position
		let lastTick = <SVGGElement> this.mainGroup.select('.axis-x .tick:last-child').node(0)
		let axisXTitle =  <SVGTextElement> lastTick.querySelector('text').cloneNode()
		let axisXTitleY = parseFloat(axisXTitle.getAttribute('y')) * -1.3

		axisXTitle.innerHTML = 'Time (s)'
		axisXTitle.setAttribute('y', axisXTitleY.toString())
		axisXTitle.setAttribute('text-anchor', 'end')
		lastTick.appendChild(axisXTitle)

		// Add the Y Axis
		let axisY = d3
			.axisLeft(scaleY)
			.tickArguments([ticks])
		this.mainGroup.append('g')
			.attr('class', 'axis')
			.call(axisY)

		// Plot goal line
		this.goalLinePath = this.generateLinePath(data, type)

		// Plot available trial lines
		let trialLinePaths = []
		for (let trialData of this.trialsData) {
			let trialLinePath = this.generateLinePath(trialData, type)
			trialLinePaths.push(trialLinePath)
		}

		this.trialLinePaths = trialLinePaths

		if (this.lineToClip === -1) {
			// If clip animation is set to goal
			let animating = true

			let tween = new Tween(0).to(1, 600)
				.onUpdate(clipRatio => this.setTrialLineClip(clipRatio))
				.onComplete(() => {
					animating = false
					this.lineToClip = undefined
					this.changeDetector.markForCheck()
					setTimeout(() => this.setTrialLineClip(0), 1)
				})
				.start()

			let animate = (time) => {
				if (animating) {
					requestAnimationFrame(animate)
					tween.update(time)
				}
			}

			animate(0)
		}

		this.changeDetector.markForCheck()
	}

	private generateLinePath(data: MotionData[], type: DataType) {
		let lineGenerator = d3.line()
			.x((d: MotionData) => this.scaleX(d.t))
			.y((d: MotionData) => this.scaleY(d[type]))

		if (type === 'a') {
			// Change the shape of the acceleration line
			// https://github.com/d3/d3-shape#curveStepBefore
			lineGenerator.curve(d3.curveStepBefore)
		}

		return lineGenerator(data)
	}

	getVelocityDomain() {
		return [-150, 150]
		/*let tickMultiple = 10
		if (this.velocityDomain === undefined) {
			// Velocity graph domain is min and max values from all datasets (challenge and trials)
			let datasets = [this.goalData, ...this.trialsData]
			let min = Infinity, max = -Infinity
			for (let dataset of datasets) {
				min = Math.min(min, d3.min(dataset, (d: MotionData) => d.v))
				max = Math.max(max, d3.max(dataset, (d: MotionData) => d.v))
			}

			let maxAbs = Math.max(Math.abs(min), Math.abs(max))
			let maxMultiple = Math.ceil(maxAbs / tickMultiple) * tickMultiple

			this.velocityDomain = [maxMultiple * -1, maxMultiple]
		}

		return this.velocityDomain*/
	}

	toggleZoom() {
		this.zoomActive = !(this.zoomActive)
		this.changeDetector.detectChanges()
		this.safeRefresh()
	}

	@HostListener('document:keyup', ['$event'])
	cancelZoom(event: KeyboardEvent) {
		// Cancel graph zoom if user press ESC
		if (event.keyCode === 27 && this.zoomActive) {
			this.toggleZoom()
		}
	}

	@HostListener('window:resize')
	onResize(ev: any) {
		this.refresh()
	}

	setTrialLineClip(clipSizeRatio: number) {
		let width = Math.floor(this.width * clipSizeRatio).toString()
		this.trialClip.setAttribute('width', width)
	}
}
