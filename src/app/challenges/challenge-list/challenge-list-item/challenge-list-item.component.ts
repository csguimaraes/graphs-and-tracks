import { Component, OnInit, Input } from '@angular/core'
import { Challenge } from '../../../shared/types'

@Component({
	selector: 'gt-challenge-list-item',
	templateUrl: './challenge-list-item.component.html',
	styleUrls: ['./challenge-list-item.component.scss'],
})
export class ChallengeListItemComponent implements OnInit {
	@Input() challenge: Challenge
	challengeStatus: string
	constructor() {
	}

	ngOnInit() {
		this.challengeStatus = this.getChallengeStatus()
	}

	getChallengeStatus() {
		let message = ''
		let count = this.challenge.attempts
		let complete = this.challenge.complete

		if (complete) {
			message = 'Completed '
			message += count === 1 ? 'on first attempt' : `after ${count} attempts`
		} else {
			message = count === 0 ? 'No attempts made yet' :
				(count === 1 ? '1 attempt made' : `${count} attempts made`)
			message += ' so far'
		}

		return message
	}
}

