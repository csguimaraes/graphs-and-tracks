import { Component, OnInit, Input } from '@angular/core'
import { Challenge } from '../../../shared/types'

@Component({
	selector: 'gt-challenge-list-item',
	templateUrl: './challenge-list-item.component.html',
	styleUrls: ['./challenge-list-item.component.scss']
})
export class ChallengeListItemComponent implements OnInit {
	@Input() challenge: Challenge
	constructor() {
	}

	ngOnInit() {
	}
}
