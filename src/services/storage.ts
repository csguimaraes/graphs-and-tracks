import { Injectable } from '@angular/core'

import { Challenge } from '../types'

import * as Settings from '../settings'

@Injectable()
export class StorageService {
	private _challenges: Challenge[]
	private id: number = 0

	get challenges(): Challenge[] {
		if (this._challenges === undefined) {
			this._challenges = this.parseDefaultChallenges()
		}

		return this._challenges.slice()
	}

	getChallenge(id: string) {
		return this.challenges.find((c) => { return c.id === id })
	}

	private parseDefaultChallenges(): Challenge[] {
		let defaultChallenges: Challenge[] = []
		for (let trackSetup of Settings.DEFAULT_CHALLENGES) {
			let id = this.generateId()
			defaultChallenges.push({
				id: id,
				name: `Challenge #${id}`,
				custom: false,
				goal: trackSetup
			})
		}

		return defaultChallenges
	}

	private generateId(): string {
		// TODO: use UID generator
		this.id++
		return this.id.toString()
	}
}
