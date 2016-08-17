import { Component, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { StorageService } from '../../shared/storage.service'
import { Challenge, Attempt, MotionSetup } from '../../shared/types'
import { Motion } from '../../shared/motion.model'

import { GraphsComponent } from '../../shared/graphs/graphs.component'
import { TrackPanelComponent } from '../../shared/track-panel/track-panel.component'

import * as moment from 'moment'

@Component({
	selector: 'gt-challenge',
	templateUrl: './challenge.component.html',
	styleUrls: ['./challenge.component.scss'],
	directives: [
		TrackPanelComponent,
		GraphsComponent
	]
})
export class ChallengeComponent implements OnInit {
	@ViewChild(TrackPanelComponent)
	trackEditor: TrackPanelComponent

	@ViewChild(GraphsComponent)
	graphsPanel: GraphsComponent

	challenge: Challenge
	goalMotion: Motion

	attempts: Attempt[] = []
	animationDuration: number
	zoom: boolean = false

	constructor(private route: ActivatedRoute, private storage: StorageService) {
		let id = this.route.snapshot.params['id']
		this.challenge = this.storage.getChallenge(id)
		this.goalMotion = Motion.fromSetup(this.challenge.goal, this.challenge.mode)

		// TODO get from settings
		this.animationDuration = 10
	}

	ngOnInit() {
		this.graphsPanel.initialize(this.goalMotion.data, this.challenge.mode)
	}

	onGraphZoom() {
		this.zoom = !(this.zoom)
	}

	onRollBall(setup: MotionSetup) {
		this.attempts.push({
			time: moment().format(),
			accuracy: -1,
			setup: setup
		})

		let motion = Motion.fromSetup(setup)
		this.graphsPanel.addTrialData(motion.data)
		this.trackEditor.animate(motion.data, this.animationDuration)
	}
}
