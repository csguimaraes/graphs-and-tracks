import { Component, OnInit, Output } from '@angular/core'
import { MotionSetup } from '../models/motion_setup'


@Component({
	selector: 'track-editor',
	template: `
		<md-card fill>
			<md-card-title>Track</md-card-title>
			
			<md-card-content>
				<label>
					position				
					<input type="number" [value]="trackSetup.position">
				</label><br>
				<label>
					velocity				
					<input type="number" [value]="trackSetup.velocity">
				</label><br>
				<button (click)="show()">SHOW</button>
			</md-card-content>
		</md-card>
	`
})
export class TrackEditorComponent implements OnInit {
	@Output()
	trackSetup: MotionSetup

	constructor() { }

	ngOnInit() {
		this.trackSetup = new MotionSetup()
	}

	show() {
		this.trackSetup.position++
		this.trackSetup.velocity--
		console.log(this.trackSetup)
	}
}
