import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { ChallengesService } from '../../shared/challenges.service'
import { Challenge, CHALLENGE_TYPE } from '../../shared/types'

@Component({
	selector: 'gt-challenge-list',
	templateUrl: './challenge-list.component.html',
	styleUrls: ['./challenge-list.component.scss']
})
export class ChallengeListComponent implements OnInit {
	localChallenges: Challenge[]
	
	constructor(private challenges: ChallengesService, public router: Router) {}

	ngOnInit() {
		let examples = this.challenges.getByType(CHALLENGE_TYPE.EXAMPLE)
		let custom = this.challenges.getByType(CHALLENGE_TYPE.CUSTOM)
		this.localChallenges = [
			...examples,
			...custom,
		]
		
		if (this.challenges.importedChallenge) {
			this.router
				.navigate(['challenges', this.challenges.importedChallenge])
				.then(() => this.challenges.importedChallenge = undefined)
		}
		
		if (window['fs-out']) {
			window['fs-out']()
		}
	}
	
	stopPropagation(e: TouchEvent) {
		e.stopPropagation()
	}
}
