import {
	Component, ElementRef,
	OnInit, AfterViewInit, OnChanges, SimpleChanges,
	Input, Output, EventEmitter, HostListener,
	ChangeDetectionStrategy, ChangeDetectorRef, RenderComponentType
} from '@angular/core'

import * as Hammer from 'hammerjs'

import { MotionData, ChallengeMode, DataType, AttemptError } from '../types'
import { Motion } from '../motion.model'

declare let d3

@Component({
	selector: 'gt-graphs',
	templateUrl: './graphs.component.html',
	styleUrls: ['./graphs.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphsComponent implements OnInit, AfterViewInit, OnChanges {
	@Input() mode: ChallengeMode
	@Input() goal: Motion
	goalData: MotionData[]
	goalLinePath: string

	trialsData: MotionData[][]
	trialLinePaths: string[]

	margin = { top: 20, right: 20, bottom: 30, left: 50 }
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
	change: EventEmitter<DataType> = new EventEmitter<DataType>()

	activeUrl
	initialized = false
	zoomActive = false
	velocityDomain: number[]
	doubleTapRecognizer: HammerManager
	requestingSelectionOf: DataType

	constructor(
		private elementRef: ElementRef,
		private changeDetector: ChangeDetectorRef
	) {
		this.trialsData = []
	}

	ngOnInit() {
		// Store references of the HTML
		this.svg = this.elementRef.nativeElement.querySelector('svg#chart')
		this.mainGroup = d3.select(this.svg.querySelector('g#main-group'))
		this.trialClip = this.svg.querySelector('#trial-line-clip rect')
		this.activeGraph = 's'
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['goal']) {
			this.goalData = this.goal.data
			this.refresh(false, true)
		}
	}

	ngAfterViewInit() {
		this.initialized = true

		let recognizer = this.doubleTapRecognizer = new Hammer.Manager(<any> this.svg)
		recognizer.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }))
		recognizer.on('doubletap', ev => { this.toggleZoom() })

		this.refresh()
	}

	highlightError(error?: AttemptError) {
		if (error) {
			if (error.type !== this.activeGraph) {
				this.requestingSelectionOf = error.type
			}
		} else {
			this.requestingSelectionOf = undefined
		}
	}

	selectGraph(type: DataType) {
		if (type !== this.activeGraph) {
			this.activeGraph = type
			this.refresh(false, true)
			this.change.emit(type)
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

	refresh(animated = false, clearTrials = false) {
		if (this.initialized === false) {
			return
		}

		this.clearDisposable()
		if (clearTrials) {
			this.trialsData = []
		} else {
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
				// Velocity graph domain is min and max values from all datasets (challenge and trials)
				let domainY = this.getVelocityDomain()
				let domainYMax = Math.max(Math.abs(domainY[0]), Math.abs(domainY[1]))
				scaleY.domain([domainYMax * -1, domainYMax])

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
			.tickValues([5, 10, 15, 20, 25])
			.tickFormat(x => x + 's')

		this.mainGroup.append('g')
			.attr('class', 'axis axis-x')
			.attr('transform', 'translate(0,' + scaleY(0) + ')')
			.call(axisX)

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
		if (this.velocityDomain === undefined) {
			let dataSets = [this.goalData, ...this.trialsData]
			let min = d3.min(dataSets, (dataSet: MotionData[]) =>  d3.min(dataSet, (d: MotionData) => d.v))
			let max = d3.max(dataSets, (dataSet: MotionData[]) =>  d3.max(dataSet, (d: MotionData) => d.v))
			this.velocityDomain = [min, max]
		}

		return this.velocityDomain
	}

	clearDisposable() {
		if (this.doubleTapRecognizer) {
			this.doubleTapRecognizer.destroy()
			this.doubleTapRecognizer = null
		}

		if (this.mainGroup) {
			this.mainGroup.selectAll('.axis').remove()
		}
	}

	toggleZoom() {
		this.zoomActive = !(this.zoomActive)
		this.changeDetector.detectChanges()
		setTimeout(() => this.refresh(), 100)
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
		this.clearDisposable()
		this.refresh()
	}

	setTrialLineClip(clipSizeRatio: number) {
		let width = Math.floor(this.width * clipSizeRatio).toString()
		this.trialClip.setAttribute('width', width)
	}
}
