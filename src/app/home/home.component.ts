import { Component, ViewChild, HostListener } from '@angular/core'
import { Router } from '@angular/router'

import * as Types from '../shared/types'
import * as Settings from '../shared/settings'

import { TrackComponent } from '../shared/track/track.component'
import { ScaleComponent } from '../shared/scale/scale.component'

@Component({
	selector: 'gt-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	directives: [
		TrackComponent,
		ScaleComponent
	]
})
export class HomeComponent {
	@ViewChild(TrackComponent)
	track: TrackComponent

	setup: Types.MotionSetup
	mode: Types.ChallengeMode


	tutorialChallengeLink = '/challenges/tutorial'

	constructor(private router: Router) {
		this.mode = Settings.MODE_NORMAL
		this.setup = {
			position: 250,
			velocity: 0,
			posts: [0, 1, 10, 4, 6, 10]
		}
	}

	onPositionChange(newPosition: number) {
		this.setup.position = newPosition

		// TODO: track should what for changes in the setup object
		this.track.refresh()
	}

	@HostListener('window:keydown', ['$event'])
	onKeydown(ev: KeyboardEvent) {
		if (ev.which === 39  || ev.which === 13) {
			this.router.navigateByUrl(`${this.tutorialChallengeLink}#tutorial`)
		}
	}
}
