import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { MD_CARD_DIRECTIVES } from '@angular2-material/card'
import { MD_GRID_LIST_DIRECTIVES } from '@angular2-material/grid-list'
import { MD_LIST_DIRECTIVES } from '@angular2-material/list/list'

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
	constructor(private router: Router) {
	}

	ngOnInit() {
		this.router.navigate(['/challenges'])
	}
}
