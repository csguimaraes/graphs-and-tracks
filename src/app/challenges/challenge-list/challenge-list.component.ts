import { Component, OnInit } from '@angular/core'
import { ChallengesService } from '../../shared/challenges.service'
import { Challenge, CHALLENGE_TYPE } from '../../shared/types'

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
