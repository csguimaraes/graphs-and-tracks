import { Component, OnInit, Input, ElementRef, AfterViewInit } from '@angular/core'

import { Motion } from '../models'
import { MotionSetup } from '../types'

declare let d3
type GraphType = 'x' | 'v' | 'a'

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

	@Input()
	trial: MotionSetup

	timeDebug: string
	positionDebug: string
	velocityDebug: string
	accelerationDebug: string

	activeGraph: GraphType = 'x'

	element: any
	host: any

	constructor(private elementRef: ElementRef) {
	}

	ngOnInit() {
		this.element = this.elementRef.nativeElement.querySelector('chart')
		this.host = d3.select(this.element)
		this.goalMotion = new Motion(this.goal.position, this.goal.velocity, this.goal.posts)

		this.goalMotion.execute()

		this.timeDebug = JSON.stringify(this.goalMotion.getData('t'))
		this.positionDebug = JSON.stringify(this.goalMotion.getData('x'))
		this.velocityDebug = JSON.stringify(this.goalMotion.getData('v'))
		this.accelerationDebug = JSON.stringify(this.goalMotion.getData('a'))
	}

	ngAfterViewInit() {
		this.buildSVG()
	}

	selectGraph(type: GraphType) {
		this.activeGraph = type
		this.buildSVG()
	}

	onResize(ev: any) {
		// TODO: redraw only after a short delay
		this.buildSVG()
	}

	buildSVG(): void {
		// set the dimensions and margins of the graph
		let margin = {top: 20, right: 20, bottom: 30, left: 50},
			width = this.element.clientWidth - margin.left - margin.right,
			height = this.element.clientHeight - margin.top - margin.bottom

		// append the svg obgect to the body of the page
		// appends a 'group' element to 'svg'
		// moves the 'group' element to the top left margin
		this.host.html('')
		let svg = this.host.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform',
				'translate(' + margin.left + ',' + margin.top + ')')

		// set the ranges
		let x = d3.scaleLinear().range([0, width])
		let y = d3.scaleLinear().range([height, 0])

		// define the line
		let valueline = d3.line()
			.x(function(d) { return x(d.time) })
			.y(function(d) { return y(d.pos) })

		// format the data
		let time = this.goalMotion.getData('t')
		let pos = this.goalMotion.getData('x')

		let data = []
		for (let i = 0; i < time.length; i++) {
			data.push({
				time: time[i],
				pos: pos[i]
			})
		}
		console.log(data)

		// Scale the range of the data
		x.domain(d3.extent(data, function(d) { return d.time }))
		y.domain([0, d3.max(data, function(d) { return d.pos })])

		// Add the valueline path.
		svg.append('path')
			.data([data])
			.attr('class', 'line')
			.attr('d', valueline)

		// Add the X Axis
		svg.append('g')
			.attr('transform', 'translate(0,' + height + ')')
			.call(d3.axisBottom(x))

		// Add the Y Axis
		svg.append('g')
			.call(d3.axisLeft(y))
	}
}
