import { Component, OnInit } from '@angular/core'

import { ChallengesService, Challenge, CHALLENGE_TYPE } from 'challenges'

@Component({
	selector: 'gt-challenge-list',
	templateUrl: './challenge-list.component.html',
	styleUrls: ['./challenge-list.component.scss']
})
export class ChallengeListComponent implements OnInit {
	examples: Challenge[]

	constructor(private challenges: ChallengesService) {}

	ngOnInit() {
		this.examples = this.challenges.getByType(CHALLENGE_TYPE.EXAMPLE)
	}
}
