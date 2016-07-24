import { Component, OnInit } from '@angular/core'

import { MD_CARD_DIRECTIVES } from '@angular2-material/card'
import { MD_GRID_LIST_DIRECTIVES } from '@angular2-material/grid-list'


@Component({
	selector: 'home',
	templateUrl: '../templates/home.html',
	styleUrls: ['../styles/home.scss'],
	directives: [
		MD_CARD_DIRECTIVES,
		MD_GRID_LIST_DIRECTIVES
	]
})
export class HomeComponent implements OnInit {
	constructor() {}

	ngOnInit() {}
}
