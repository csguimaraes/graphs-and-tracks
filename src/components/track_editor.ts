import { Component, OnInit } from '@angular/core'
import { MotionSetup } from '../types'

@Component({
	selector: 'track-editor',
	template: `
		<md-card>
			<md-card-title>Track</md-card-title>
			
			<md-card-content>
				
			</md-card-content>
		</md-card>
	`
})
export class TrackEditorComponent implements OnInit {
	trackSetup: MotionSetup

	constructor() { }

	ngOnInit() {
	}
}
