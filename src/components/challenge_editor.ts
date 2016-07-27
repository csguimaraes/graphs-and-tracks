import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
	moduleId: module.id,
	selector: 'challenge',
	templateUrl: `
		Editing Challenge ID {{ challengeId }}
	`
})
export class ChallengeEditorComponent implements OnInit {
	challengeId: string

	constructor(private route: ActivatedRoute) {}

	ngOnInit() {
		this.challengeId = this.route.snapshot.params['id']
	}
}
