import { Component, OnInit, Input, ElementRef, AfterViewInit } from '@angular/core'

import { Motion } from '../models'
import { MotionSetup, MotionData } from '../types'
import { printDataTable } from '../utils/debug'

declare let d3
type GraphType = 's' | 'v' | 'a'

@Component({
	selector: 'graphs',
	templateUrl: '../templates/graphs.html',
	host: {
		'(window:resize)': 'onResize($event)'
	},
	styleUrls: ['../styles/graphs.scss'],
	// directives: []
})
export class GraphsComponent implements OnInit, AfterViewInit {
	@Input()
	goal: MotionSetup
	goalMotion: Motion
	goalData: MotionData[]

	@Input()
	trial: MotionSetup

	activeGraph: GraphType = 's'

	element: any
	host: any

	private resizeDelay

	constructor(private elementRef: ElementRef) {
	}

	ngOnInit() {
		this.goalMotion = new Motion(this.goal.position, this.goal.velocity, this.goal.posts)
		this.goalMotion.execute()
		this.goalData = this.goalMotion.getData()

		this.element = this.elementRef.nativeElement.querySelector('chart')
		this.host = d3.select(this.element)
	}

	ngAfterViewInit() {
		this.refresh()
	}

	selectGraph(type: GraphType) {
		if (type !== this.activeGraph) {
			this.activeGraph = type
			this.refresh()
		}
	}

	onResize(ev: any) {
		if (this.resizeDelay) {
			clearInterval(this.resizeDelay)
		}

		this.clear()
		this.resizeDelay = setTimeout(() => {
			this.refresh()
		}, 200)
	}

	clear() {
		this.host.html('')
	}

	refresh(): void {
		console.log('refreshing chart')
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

		let isGoal = true
		let data = this.goalMotion.getData()
		let type = this.activeGraph

		let scaleX = d3.scaleLinear()
			.range([0, width])
			.domain([0, this.goalMotion.mode.simulation.duration])

		let scaleY = d3.scaleLinear()
			.range([height, 0])

		let axisTitle = ''

		// Some specific configurations for each graph type
		switch (type) {
			case 's':
				// Position graph uses the track size as domain
				let pos = this.goalMotion.mode.domain.position
				scaleY.domain([pos.min, pos.max])

				axisTitle = 'Position (cm)'
				break
			case 'v':
				// Velocity graph use min and max value from the dataset
				let domainY = d3.extent(data, (d: MotionData) => d[type])
				domainY = Math.max(Math.abs(domainY[0]), Math.abs(domainY[1]))
				scaleY.domain([domainY * -1, domainY])

				axisTitle = 'Velocity (cm/s)'
				break
			case 'a':
				// Here we use the maximum acceleration possible to achieve
				let postsDomain = this.goalMotion.mode.domain.posts
				let maxAcceleration = postsDomain.min - postsDomain.max
				scaleY.domain([maxAcceleration * -1, maxAcceleration])

				axisTitle = 'Acceleration (cm/s²)'
				break
			default:
				throw 'Unknown graph type'
		}

		let linePath = d3.line()
			.x((d: MotionData) => scaleX(d.t))
			.y((d: MotionData) => scaleY(d[type]))

		let line = svg.append('path')
			.data([data])
			.attr('d', linePath)

		// TODO: improve
		line.classed(type, true)
		line.classed('line', true)
		if (isGoal) {
			line.classed('goal', true)
		}

		// Add the X Axis
		let axisX = d3.axisBottom(scaleX)
		axisX.tickValues([5, 10, 15, 20, 25])
		axisX.tickFormat(x => x + 's')
		svg.append('g')
			.attr('class', 'axis axis-x')
			.attr('transform', 'translate(0,' + scaleY(0) + ')')
			.call(axisX)

		// Add the Y Axis
		svg.append('g')
			.attr('class', 'axis')
			.call(d3.axisLeft(scaleY))

		svg.append('text')
			.attr('class', 'axis-title')
			.attr('transform', 'rotate(-90)')
			.attr('y', (margin.left * -1) + 5)
			.attr('x', (height / -2))
			.attr('dy', '.71em')
			.style('text-anchor', 'middle')
			.text(axisTitle)
	}

	debug(type: string) {
		let data = type === 'goal' ? this.goalMotion.getData() : []
		printDataTable(data, type)
	}
}
