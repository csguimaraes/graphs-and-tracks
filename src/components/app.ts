import { Component } from '@angular/core'

import { MD_TOOLBAR_DIRECTIVES } from '@angular2-material/toolbar'

@Component({
	selector: 'app',
	templateUrl: '../templates/app.html',
	styleUrls: ['../styles/app.scss'],
	directives: [
		MD_TOOLBAR_DIRECTIVES
	]
})
export class AppComponent {
	constructor() {}
}
