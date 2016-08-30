import { Component, OnInit, ElementRef, AfterViewInit, Output, EventEmitter, HostListener } from '@angular/core'
import { Router } from '@angular/router'

import * as Hammer from 'hammerjs'

import { MotionData, ChallengeMode, DataType } from '../types'

declare let d3

@Component({
	selector: 'gt-graphs',
	templateUrl: './graphs.component.html',
	styleUrls: ['./graphs.component.scss'],
})
export class GraphsComponent implements OnInit, AfterViewInit {
	mode: ChallengeMode

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
	trialClip: SVGRectElement
	mainGroup: any
	scaleX: any
	scaleY: any

	@Output('zoom')
	zoomEvent = new EventEmitter()

	zoomActive = false
	velocityDomain: number[]

	doubleTapRecognizer: HammerManager

	@Output()
	change: EventEmitter<DataType> = new EventEmitter<DataType>()

	activeUrl

	constructor(private elementRef: ElementRef, router: Router) {
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
		// Draw graph for the first time only after view full initialization
		// This way we make sure that the parent container has the correct dimensions
		setTimeout(() => {
			this.refresh()
		}, 500)
	}

	initialize(goalData: MotionData[], mode: ChallengeMode) {
		this.goalData = goalData
		this.mode = mode
	}

	selectGraph(type: DataType) {
		if (type !== this.activeGraph) {
			this.activeGraph = type
			this.refresh(false, true)
			this.change.emit(type)
		}
	}

	addTrialData(data: MotionData[]) {
		this.trialsData.push(data)

		// Clear cached data domain for velocity
		this.velocityDomain = undefined

		this.refresh(true)
	}

	refresh(animated = false, clearTrials = false) {
		this.clearDisposable()
		if (clearTrials) {
			this.trialsData = []
		}

		if (animated) {
			this.activeUrl = document.location.pathname
		}

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


		let recognizer = this.doubleTapRecognizer = new Hammer.Manager(<any> this.svg)
		recognizer.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }))
		recognizer.on('doubletap', ev => { this.toggleZoom() })
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

		this.mainGroup.selectAll('.axis').remove()
	}

	toggleZoom() {
		this.zoomActive = !(this.zoomActive)
		this.zoomEvent.emit(this.zoomActive)

		setTimeout(() => {
			this.refresh()
		}, 1)
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
