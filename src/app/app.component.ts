import { Component, ViewEncapsulation } from '@angular/core'

@Component({
	selector: 'gt-app',
	styleUrls: [
		'./styles/reset.scss',
		'./styles/theme.scss',
		'./styles/utils.scss',
		'./app.component.scss'
	],
	templateUrl: './app.component.html',
	encapsulation: ViewEncapsulation.None
})
export class AppComponent {
}
