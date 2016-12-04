import { Component, OnInit } from '@angular/core'

@Component({
	selector: 'gt-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
	constructor() {
	}

	ngOnInit() {
		if (window['fs-out']) {
			window['fs-out']()
		}
	}
}
