import { Component, OnInit } from '@angular/core'
import { StorageService } from '../../shared/storage.service'
import { Challenge } from '../../shared/types'

@Component({
	selector: 'gt-challenge-list',
	templateUrl: './challenge-list.component.html',
	styleUrls: ['./challenge-list.component.scss']
})
export class ChallengeListComponent implements OnInit {
	challenges: Challenge[]

	constructor(private storage: StorageService) {}


	ngOnInit() {
		this.challenges = this.storage.challenges
	}
}
