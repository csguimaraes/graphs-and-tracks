import { Injectable } from '@angular/core'

import { Challenge, MotionSetup } from './types'
import * as Settings from './settings'

@Injectable()
export class StorageService {
	private _challenges: Challenge[]
	private id: number = 0

	get challenges(): Challenge[] {
		if (this._challenges === undefined) {
			this._challenges = this.loadStaticChallenges()
		}

		return this._challenges.slice()
	}

	getChallenge(id: string) {
		return this.challenges.find((c) => { return c.id === id })
	}

	private loadStaticChallenges(): Challenge[] {
		let challenges: Challenge[] = []
		for (let trackSetup of Settings.DEFAULT_CHALLENGES) {
			let challenge = this.parseChallenge(trackSetup)
			challenges.push(challenge)
		}

		let tutorial = this.parseChallenge(Settings.TUTORIAL_CHALLENGE, 'tutorial')
		tutorial.name = 'Challenge Tutorial'
		tutorial.type = 'tutorial'
		challenges.push(tutorial)

		return challenges
	}

	private parseChallenge(setup: MotionSetup, id?: string): Challenge {
		let name: string

		if (id === undefined) {
			this.id++
			id = this.id.toString()
			name = `Challenge #${id}`
		}

		return {
			id: id,
			name: name,
			custom: false,
			mode: Settings.MODE_NORMAL,
			goal: setup,
			type: 'example'
		}
	}
}
