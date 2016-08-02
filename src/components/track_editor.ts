import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core'
import { MotionSetup, ChallengeMode } from '../types'
import * as _ from 'lodash'

@Component({
	selector: 'track-editor',
	templateUrl: '../templates/track_editor.html'
})
export class TrackEditorComponent implements OnInit {
	setup: MotionSetup

	@Input()
	mode: ChallengeMode

	@Output('roll')
	rollBallEvent: EventEmitter<MotionSetup>

	constructor() {
		this.rollBallEvent = new EventEmitter<MotionSetup>()
	}

	ngOnInit() {
		this.setup = {
			position: this.mode.domain.position.min,
			velocity: this.mode.domain.velocity.min,
			posts: new Array(this.mode.postsCount).fill(0)
		}

		this.setup = {
			position: 350,
			velocity: 40,
			posts: [4, 2, 0, 0, 2, 4]
		}
	}

	rollBall() {
		this.rollBallEvent.emit(_.cloneDeep(this.setup))
	}
}
