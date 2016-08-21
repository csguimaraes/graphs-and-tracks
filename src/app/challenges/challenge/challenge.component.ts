import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { Challenge, Attempt, MotionSetup, DataType } from '../../shared/types'
import { ANIMATION_DURATION } from '../../shared/settings'
import { StorageService } from '../../shared/storage.service'
import { Motion } from '../../shared/motion.model'

import { GraphsComponent } from '../../shared/graphs/graphs.component'
import { TrackPanelComponent } from '../../shared/track-panel/track-panel.component'

@Component({
	selector: 'gt-challenge',
	templateUrl: './challenge.component.html',
	styleUrls: ['./challenge.component.scss'],
	directives: [
		TrackPanelComponent,
		GraphsComponent
	]
})
export class ChallengeComponent implements OnInit, AfterViewInit {
	@ViewChild(TrackPanelComponent)
	trackEditor: TrackPanelComponent

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

	ngAfterViewInit() {
		if (this.route.snapshot.fragment === 'tutorial') {
			this.startTutorial()
		}
	}

	onGraphZoom() {
		this.zoom = !(this.zoom)
	}

	onRollBall(setup: MotionSetup) {
		this.attempts.push({
			accuracy: -1,
			setup: setup
		})

		let motion = Motion.fromSetup(setup)
		this.graphsPanel.addTrialData(motion.data)
		this.trackEditor.animate(motion.data, ANIMATION_DURATION)
	}

	onTrackChange(dataType: DataType) {
		if (dataType === 's' || dataType === 'v') {
			this.graphsPanel.refresh(false, true)
		}
	}

	startTutorial() {
		// TODO
	}
}
