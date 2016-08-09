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

	velocityDomain: number[]

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
			this.refresh(true)
		}
	}

	addTrialData(data: MotionData[]) {
		this.trialsData.push(data)

		// Clear cached data domain for velocity
		this.velocityDomain = undefined

		this.refresh(true)
	}

	private refresh(animated = false) {
		this.clear()

		let margin = { top: 20, right: 20, bottom: 30, left: 50 }
		let width = this.element.clientWidth - margin.left - margin.right
		let height = this.element.clientHeight - margin.top - margin.bottom

		let svg = this.host.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`)

		let data = this.goalData
		let type = this.activeGraph

		let scaleX = this.scaleX = d3.scaleLinear()
			.range([0, width])
			.domain([0, this.mode.simulation.duration])

		let scaleY = this.scaleY = d3.scaleLinear()
			.range([height, 0])

		let axisTitle = ''
		let ticks: any

		// Specific configurations for each graph type
		switch (type) {
			case 's':
				// Position graph uses the track size as data domain
				let pos = this.mode.domain.position
				scaleY.domain([pos.min, pos.max])

				ticks = 6
				axisTitle = 'Position (cm)'
				break

			case 'v':
				// Velocity graph domain is min and max values from all datasets (challenge and trials)
				let domainY = this.getVelocityDomain()
				let domainYMax = Math.max(Math.abs(domainY[0]), Math.abs(domainY[1]))
				scaleY.domain([domainYMax * -1, domainYMax])

				ticks = height > 200 ? 10 : 5
				axisTitle = 'Velocity (cm/s)'
				break

			case 'a':
				// Here we use the maximum acceleration possible to achieve
				let postsDomain = this.mode.domain.posts
				let maxAcceleration = (postsDomain.max - postsDomain.min) * 10
				scaleY.domain([maxAcceleration * -1, maxAcceleration])

				ticks = 5
				axisTitle = 'Acceleration (cm/s²)'
				break

			default:
				throw 'Unknown graph type'
		}

		// Add the X Axis
		let axisX = d3
			.axisBottom(scaleX)
			.tickValues([5, 10, 15, 20, 25])
			.tickFormat(x => x + 's')
		svg.append('g')
			.attr('class', 'axis axis-x')
			.attr('transform', 'translate(0,' + scaleY(0) + ')')
			.call(axisX)

		// Add the Y Axis
		let axisY = d3
			.axisLeft(scaleY)
			.tickArguments([ticks])
		svg.append('g')
			.attr('class', 'axis')
			.call(axisY)

		svg.append('text')
			.attr('class', 'axis-title')
			.attr('transform', 'rotate(-90)')
			.attr('y', (margin.left * -1) + 5)
			.attr('x', (height / -2))
			.attr('dy', '.71em')
			.style('text-anchor', 'middle')
			.text(axisTitle)

		// Plot goal line
		this.plotLine(svg, data, type, ['goal'])

		// Plot last trial line
		if (this.trialsData.length ) {
			let lastTrial = this.trialsData[this.trialsData.length - 1]
			let lastTrialLine = this.plotLine(svg, lastTrial, type, ['trial'])

			let lineEl = lastTrialLine.node()
			if (animated) {
				let pathLength = Math.round(lineEl.getTotalLength())
				lineEl.style.strokeDasharray = `${pathLength} ${pathLength}`
				lineEl.style.strokeDashoffset = `${pathLength}`
				setTimeout(() => {
					lineEl.classList.add('active')
					lineEl.style.strokeDashoffset = 0
					// TODO: transition duration VS simulation duration
				}, 10)
			} else {
				lineEl.classList.add('active')
			}
		}
	}

	private plotLine(svg: any, data: MotionData[], type: GraphType, classList: string[]) {
		classList.push('line')
		classList.push(type)

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

	getVelocityDomain() {
		if (this.velocityDomain === undefined) {
			let dataSets = [this.goalData, ...this.trialsData]
			let min = d3.min(dataSets, (dataSet: MotionData[]) =>  d3.min(dataSet, (d: MotionData) => d.v))
			let max = d3.max(dataSets, (dataSet: MotionData[]) =>  d3.max(dataSet, (d: MotionData) => d.v))
			this.velocityDomain = [min, max]
		}

		return this.velocityDomain
	}


	clear() {
		this.host.html('')
	}

	debug(type: string) {
		let trialIndex = ''
		if (this.trialsData.length) {
			let promptText = `Enter trial index (from 1 to ${this.trialsData.length}) or leave empty for goal:`
			trialIndex = prompt('Which trial motion you want to debug?\n\n' + promptText)
		}

		if (trialIndex !== undefined) {
			if (trialIndex === '') {
				printDataTable(this.goalData, 'goal')
			} else {
				printDataTable(this.trialsData[+trialIndex - 1], `attempt #${trialIndex}`)
			}
		}
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
		this.clear()
		this.refresh()
	}
}
