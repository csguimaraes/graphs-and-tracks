import { Component, OnInit } from '@angular/core'

import { MD_CARD_DIRECTIVES } from '@angular2-material/card'
import { MD_LIST_DIRECTIVES } from '@angular2-material/list/list'
import { MD_GRID_LIST_DIRECTIVES } from '@angular2-material/grid-list/grid-list'

import { StorageService } from '../services'
import { Challenge } from '../types'

@Component({
	moduleId: module.id,
	selector: 'about',
	templateUrl: '../templates/challenge_list.html',
	styleUrls: ['../styles/challenge_list.scss'],
	directives: [
		MD_CARD_DIRECTIVES,
		MD_LIST_DIRECTIVES,
		MD_GRID_LIST_DIRECTIVES
	]
})
export class ChallengeListComponent implements OnInit {
	challenges: Challenge[]

	constructor(private storage: StorageService) {}


	ngOnInit() {
		this.challenges = this.storage.challenges
	}
}
