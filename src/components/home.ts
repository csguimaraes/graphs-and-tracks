import { Component, OnInit } from '@angular/core'

import { MD_CARD_DIRECTIVES } from '@angular2-material/card'
import { MD_GRID_LIST_DIRECTIVES } from '@angular2-material/grid-list'
import { MD_LIST_DIRECTIVES } from '@angular2-material/list/list'

import { MotionData }  from '../models'

@Component({
	selector: 'home',
	templateUrl: '../templates/home.html',
	styleUrls: ['../styles/home.scss'],
	directives: [
		MD_CARD_DIRECTIVES,
		MD_LIST_DIRECTIVES,
		MD_GRID_LIST_DIRECTIVES
	]
})
export class HomeComponent implements OnInit {
	examples: MotionData[] = [
		{ position: 50, velocity: -30, heights: [6, 5, 4, 3, 2, 1] },
		{ position: 400, velocity: 30, heights: [0, 0, 0, 2, 4, 6] }
	]

	selectedExample: MotionData

	constructor() {
	}

	ngOnInit() {
	}

	selectExample(example: MotionData) {
		this.selectedExample = example
		console.log('Example selected', example)
	}
}
