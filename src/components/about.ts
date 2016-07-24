import { Component, OnInit } from '@angular/core'

import { MD_CARD_DIRECTIVES } from '@angular2-material/card'

@Component({
	moduleId: module.id,
	selector: 'about',
	templateUrl: '../templates/about.html',
	styleUrls: ['../styles/about.scss'],
	directives: [
		MD_CARD_DIRECTIVES
	]
})
export class AboutComponent implements OnInit {

	constructor() {}

	ngOnInit() {}
}
