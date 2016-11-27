import {
	Component, ElementRef,
	OnInit, AfterViewInit,
	Input, Output, EventEmitter, HostListener,
	ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, ViewChild, SimpleChanges, OnChanges
} from '@angular/core'

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
	@Input()
	mode: ChallengeMode
	
	@Input()
	goal: Motion
	
	@Output()
	zoom = new EventEmitter<string>()
	
	@ViewChild('goalLine')
	goalLine: ElementRef
	
	hideGoal = false
	goalData: MotionData[]
	goalLinePath: string
	
	trialsData: MotionData[][]
	trialLinePaths: string[]
	
	margin = { top: 20, right: 10, bottom: 30, left: 30 }
	height: number = 0
	width: number = 0
	
	activeGraph: DataType
	axisTitle: string
	svg: any
	mainGroup: any
	scaleX: any
	scaleY: any
	
	lineToClip: number
	shadowClip: SVGRectElement
	trialClip: SVGRectElement
	currentClip: number = 0
	
	@Output()
	change = new EventEmitter<UI_CONTROL>()
	
	activeUrl
	initialized = false
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
		this.shadowClip = this.svg.querySelector('#shadow-line-clip rect')
		this.activeGraph = 's'
	}
	
	ngAfterViewInit() {
		this.initialized = true
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
			.duration(900)
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
	
	addTrialData(data: MotionData[], single = false) {
		if (single) {
			// Only the latest trial is shown
			this.trialsData = [data]
		} else {
			// Now only latest trial is being held
			let trials = []
			let latest = this.trialsData.pop()
			if (latest) {
				trials.push(latest)
			}
			
			trials.push(data)
			
			this.trialsData = trials
		}
		
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
		
		let isEdge = /Edge\/\d./i.test(window.navigator.userAgent)
		this.lineToClip = undefined
		if (animated) {
			if (this.trialsData.length) {
				this.lineToClip = this.trialsData.length - 1
			} else if (!isEdge) {
				this.lineToClip = -1
			}
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
				this.axisTitle = '(cm)'
				break
			
			case 'v':
				scaleY.domain([-150, 150])
				ticks = this.height > 300 ? 15 : 5
				this.axisTitle = '(cm/s)'
				break
			
			case 'a':
				// Here we use the maximum acceleration possible to achieve
				let postsDomain = this.mode.domain.posts
				let maxAcceleration = (postsDomain.max - postsDomain.min) * 10
				scaleY.domain([maxAcceleration * -1, maxAcceleration])
				
				ticks = 5
				this.axisTitle = '(cm/s²)'
				break
			
			default:
				throw 'Unknown graph type'
		}
		
		// Add the X Axis
		let axisX = d3
			.axisBottom(scaleX)
			.tickValues([5, 10, 15, 20, 25]) // FIXME: should be based on simulation duration
		
		if (this.mainGroup) {
			this.mainGroup.selectAll('.axis').remove()
		}
		
		this.mainGroup.append('g')
			.attr('class', 'axis axis-x')
			.attr('transform', 'translate(0,' + scaleY(0) + ')')
			.call(axisX)
		
		// Add X Axis title based on last tick position
		let lastTick = <SVGGElement> this.mainGroup.select('.axis-x .tick:last-child').node(0)
		let axisXTitle = <SVGTextElement> lastTick.querySelector('text').cloneNode()
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
		if (!this.hideGoal) {
			this.goalLinePath = this.generateLinePath(data, type)
		}
		
		// Plot available trial lines
		let trialLinePaths = []
		for (let trialData of this.trialsData) {
			let trialLinePath = this.generateLinePath(trialData, type)
			trialLinePaths.push(trialLinePath)
		}
		
		this.trialLinePaths = trialLinePaths
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
	
	@HostListener('window:resize')
	onResize(ev: any) {
		this.refresh()
	}
	
	setTrialLineClip(clipSizeRatio: number) {
		this.currentClip = clipSizeRatio
		let width = Math.floor(this.width * clipSizeRatio).toString()
		this.trialClip.setAttribute('width', width)
	}
	
	clipShadowLine() {
		let width = Math.floor(this.width * this.currentClip).toString()
		this.shadowClip.setAttribute('width', width)
	}
}
