import { Component } from '@angular/core'

import { MD_TOOLBAR_DIRECTIVES } from '@angular2-material/toolbar'
import { MD_CARD_DIRECTIVES } from '@angular2-material/card'
import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav'
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button'
import { MD_LIST_DIRECTIVES } from '@angular2-material/list'

@Component({
	selector: 'app',
	templateUrl: '../templates/app.html',
	styleUrls: ['../styles/app.scss'],
	directives: [
		MD_TOOLBAR_DIRECTIVES,
		MD_SIDENAV_DIRECTIVES,
		MD_CARD_DIRECTIVES,
		MD_BUTTON_DIRECTIVES,
		MD_LIST_DIRECTIVES
	]
})
export class AppComponent {
	views = [
		{ name: 'Challenges', link: 'challenges', icon: 'stars' }
	]

	constructor() {}
}
