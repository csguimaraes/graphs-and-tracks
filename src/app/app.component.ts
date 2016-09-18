import { Component } from '@angular/core'

import { AuthService } from './shared/auth.service'

@Component({
	selector: 'gt-app',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	constructor(public auth: AuthService) {
	}
}
