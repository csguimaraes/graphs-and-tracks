import { Component } from '@angular/core'
import { ROUTER_DIRECTIVES } from '@angular/router'

import { MD_TOOLBAR_DIRECTIVES } from '@angular2-material/toolbar'
import { MD_CARD_DIRECTIVES } from '@angular2-material/card'
import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav'
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button'
import { MD_LIST_DIRECTIVES } from '@angular2-material/list'


import { ApiService } from '../services'


@Component({
	selector: 'app',
	templateUrl: '../templates/app.html',
	styleUrls: ['../styles/app.scss'],
	directives: [
		ROUTER_DIRECTIVES,
		MD_TOOLBAR_DIRECTIVES,
		MD_SIDENAV_DIRECTIVES,
		MD_CARD_DIRECTIVES,
		MD_BUTTON_DIRECTIVES,
		MD_LIST_DIRECTIVES
	]
})
export class AppComponent {
	views = [
		{ name: 'Home', link: '', icon: 'dashboard' },
		{ name: 'About', link: 'about', icon: 'info_outline' }
	]

	constructor(private api: ApiService) {
		console.info(api.key)
	}
}
