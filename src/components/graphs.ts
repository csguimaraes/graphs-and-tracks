import { Component, OnInit, Input } from '@angular/core'

import { Motion } from '../models/motion'
import { MotionSetup } from '../types'

@Component({
	selector: 'graphs',
	templateUrl: '../templates/graphs.html',
	styleUrls: ['../styles/graphs.scss'],
	directives: [
		// DIRECTIVES
	]
})
export class GraphsComponent implements OnInit {
	@Input()
	goal: MotionSetup

	@Input()
	trial: MotionSetup

	x: string
	v: string
	a: string

	graphTypes = [
		'Position',
		'Velocity',
		'Acceleration'
	]

	activeGraph: string

	constructor() {
		this.selectGraph(this.graphTypes[0])
	}

	ngOnInit() {
		let motion = new Motion(this.goal.position, this.goal.velocity, this.goal.posts)
		motion.execute()
		this.x = JSON.stringify(motion.getData('x'))
		this.v = JSON.stringify(motion.getData('v'))
		this.a = JSON.stringify(motion.getData('a'))
	}

	selectGraph(graphType: string) {
		this.activeGraph = graphType
	}
}
