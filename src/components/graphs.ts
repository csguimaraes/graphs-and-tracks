import { Component, OnInit, Input } from '@angular/core'

import { MotionSetup } from '../models/motion_setup'
import { EngineService } from '../services/engine'


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

	constructor(public engine: EngineService) {
		this.selectGraph(this.graphTypes[0])
	}

	ngOnInit() {
		let data = this.engine.calculateMotion(this.goal)
		this.x = JSON.stringify(data.x)
		this.v = JSON.stringify(data.v)
		this.a = JSON.stringify(data.a)
	}

	selectGraph(graphType: string) {
		this.activeGraph = graphType
	}
}
