import { Component, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { MD_GRID_LIST_DIRECTIVES } from '@angular2-material/grid-list/grid-list'
import { MD_CARD_DIRECTIVES } from '@angular2-material/card/card'

import { StorageService } from '../services'
import { Challenge, Attempt, MotionSetup } from '../types'
import { Motion } from '../models'

import { GraphsComponent } from './graphs'
import { TrackEditorComponent } from './track_editor'

import * as moment from 'moment'


@Component({
	moduleId: module.id,
	selector: 'challenge',
	templateUrl: '../templates/challenge_viewer.html',
	directives: [
		MD_GRID_LIST_DIRECTIVES,
		MD_CARD_DIRECTIVES,
		TrackEditorComponent,
		GraphsComponent
	]
})
export class ChallengeViewerComponent implements OnInit {
	@ViewChild(TrackEditorComponent)
	trackEditor: TrackEditorComponent

	@ViewChild(GraphsComponent)
	graphsPanel: GraphsComponent

	challenge: Challenge
	goalMotion: Motion

	attempts: Attempt[] = []

	zoom: boolean = false

	constructor(private route: ActivatedRoute, private storage: StorageService) {
		let id = this.route.snapshot.params['id']
		this.challenge = this.storage.getChallenge(id)
		this.goalMotion = Motion.fromSetup(this.challenge.goal, this.challenge.mode)
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
	}
}
