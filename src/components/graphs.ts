import { Component, OnInit, ElementRef, AfterViewInit, Output, EventEmitter, HostListener } from '@angular/core'

import { MotionData, ChallengeMode } from '../types'
import { printDataTable } from '../utils/debug'

declare let d3
type GraphType = 's' | 'v' | 'a'

@Component({
	selector: 'graphs',
	templateUrl: '../templates/graphs.html',
	host: { '(window:resize)': 'onResize($event)' },
	styleUrls: ['../styles/graphs.scss'],
})
export class GraphsComponent implements OnInit, AfterViewInit {
	mode: ChallengeMode
	goalData: MotionData[]
	trialsData: MotionData[][]

	activeGraph: GraphType
	element: any
	host: any
	scaleX: any
	scaleY: any

	@Output('zoom')
	zoomEvent = new EventEmitter()
	zoomActive = false
	resizeTimeout: any

	constructor(private elementRef: ElementRef) {
		this.activeGraph = 's'
		this.trialsData = []
	}

	ngOnInit() {
		// Store references of the HTML
		this.element = this.elementRef.nativeElement.querySelector('chart')
		this.host = d3.select(this.element)
	}

	ngAfterViewInit() {
		// Draw graph for the first time only after view full initialization
		// This way we make sure that the parent container has the correct dimensions
		this.refresh()
	}

	initialize(goalData: MotionData[], mode: ChallengeMode) {
		this.goalData = goalData
		this.mode = mode
	}

	selectGraph(type: GraphType) {
		if (type !== this.activeGraph) {
			this.activeGraph = type
			this.refresh()
		}
	}

	highlightTrial(trialIndex?: number) {

	}

	addTrialData(data: MotionData[]) {
		this.trialsData.push(data)
		this.refresh()
	}

	private refresh() {
		this.clear()

		let margin = { top: 20, right: 20, bottom: 30, left: 50 }
		let width = this.element.clientWidth - margin.left - margin.right
		let height = this.element.clientHeight - margin.top - margin.bottom

		let svg = this.host.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform',
				'translate(' + margin.left + ',' + margin.top + ')')

		let data = this.goalData
		let type = this.activeGraph

		this.scaleX = d3.scaleLinear()
			.range([0, width])
			.domain([0, this.mode.simulation.duration])

		this.scaleY = d3.scaleLinear()
			.range([height, 0])

		let axisTitle = ''

		// Specific configurations for each graph type
		switch (type) {
			case 's':
				// Position graph uses the track size as domain
				let pos = this.mode.domain.position
				this.scaleY.domain([pos.min, pos.max])

				axisTitle = 'Position (cm)'
				break

			case 'v':
				// Velocity graph use min and max value from the dataset
				let domainY = d3.extent(data, (d: MotionData) => d[type])
				domainY = Math.max(Math.abs(domainY[0]), Math.abs(domainY[1]))
				this.scaleY.domain([domainY * -1, domainY])

				axisTitle = 'Velocity (cm/s)'
				break

			case 'a':
				// Here we use the maximum acceleration possible to achieve
				let postsDomain = this.mode.domain.posts
				let maxAcceleration = (postsDomain.max - postsDomain.min) * 10
				this.scaleY.domain([maxAcceleration * -1, maxAcceleration])

				axisTitle = 'Acceleration (cm/s²)'
				break

			default:
				throw 'Unknown graph type'
		}

		// Add the X Axis
		let axisX = d3.axisBottom(this.scaleX)
		axisX.tickValues([5, 10, 15, 20, 25])
		axisX.tickFormat(x => x + 's')
		svg.append('g')
			.attr('class', 'axis axis-x')
			.attr('transform', 'translate(0,' + this.scaleY(0) + ')')
			.call(axisX)

		// Add the Y Axis
		svg.append('g')
			.attr('class', 'axis')
			.call(d3.axisLeft(this.scaleY))

		svg.append('text')
			.attr('class', 'axis-title')
			.attr('transform', 'rotate(-90)')
			.attr('y', (margin.left * -1) + 5)
			.attr('x', (height / -2))
			.attr('dy', '.71em')
			.style('text-anchor', 'middle')
			.text(axisTitle)

		// Plot goal line
		this.plotLine(svg, data, type, true)

		// Plot trial lines
		let lastPlotLine: any = null
		for (let trial of this.trialsData) {
			lastPlotLine = this.plotLine(svg, trial, type, false)
		}

		if (lastPlotLine) {
			let lineEl = lastPlotLine.node()
			let pathLength = Math.round(lineEl.getTotalLength())
			lineEl.style.strokeDasharray = `${pathLength} ${pathLength}`
			lineEl.style.strokeDashoffset = `${pathLength}`
			setTimeout(() => {
				lineEl.classList.add('active')
				lineEl.style.strokeDashoffset = 0
				// TODO transition duration VS simulation duration
			}, 10)
		}
	}

	private plotLine(svg: any, data: MotionData[], type: GraphType, isGoal: boolean) {
		let classList = ['line', type, isGoal ? 'goal' : 'trial']

		let line = d3.line()
			.x((d: MotionData) => this.scaleX(d.t))
			.y((d: MotionData) => this.scaleY(d[type]))

		if (type === 'a') {
			// Change the shape of the acceleration line
			// https://github.com/d3/d3-shape#curveStepBefore
			line.curve(d3.curveStepBefore)
		}

		return svg.append('path')
			.data([data])
			.attr('class', classList.join(' '))
			.attr('d', line)
	}

	clear() {
		this.host.html('')
	}

	debug(type: string) {
		let data = type === 'goal' ? this.goalData : []
		printDataTable(data, type)
	}

	toggleZoom() {
		this.clear()
		this.zoomActive = !(this.zoomActive)
		this.zoomEvent.emit(this.zoomActive)

		// ev.target.innerHTML = this.zoomActive ? 'flip_to_back' : 'flip_to_front'
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

	onResize(ev: any) {
		if (this.resizeTimeout) {
			clearInterval(this.resizeTimeout)
		}

		this.clear()
		this.resizeTimeout = setTimeout(() => {
			this.refresh()
		}, 200)
	}
}
