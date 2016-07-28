import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { MD_GRID_LIST_DIRECTIVES } from '@angular2-material/grid-list/grid-list'
import { MD_CARD_DIRECTIVES } from '@angular2-material/card/card'

import { StorageService } from '../services'
import { Challenge } from '../types'
import { GraphsComponent } from './graphs'
import { TrackEditorComponent } from './track_editor'

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
	challenge: Challenge

	constructor(private route: ActivatedRoute, private storage: StorageService) {
		let id = this.route.snapshot.params['id']
		this.challenge = this.storage.getChallenge(id)
	}

	ngOnInit() {}
}
