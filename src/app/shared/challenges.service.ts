import { Injectable } from '@angular/core'

import { Challenge, CHALLENGE_TYPE } from './types'
import * as Settings from './settings'

@Injectable()
export class ChallengesService {
	private tutorial: Challenge
	private exploration: Challenge
	private examples: Challenge[]
	// private community: Challenge[]
	// private teacher: Challenge[]

	constructor() {
		this.loadBuiltinChallenges()
	}

	getByType(type: CHALLENGE_TYPE = CHALLENGE_TYPE.EXAMPLE): Challenge[] {
		let result: Challenge[]
		switch (type) {
			case CHALLENGE_TYPE.EXAMPLE:
				result = this.examples.slice()
				break

			case CHALLENGE_TYPE.TUTORIAL:
				result = [this.tutorial]
				break

			case CHALLENGE_TYPE.EXPLORATION:
				result = [this.exploration]
				break

			default:
				throw 'Not Implemented'
		}

		return result
	}

	getById(id?: string) {
		let result: Challenge
		switch (id) {
			case 'tutorial':
				result = this.tutorial
				break

			case 'exploration':
				result = this.exploration
				break

			default:
				if (id.length <= 2) {
					result = this.examples.find((c) => { return c.id === id })
				} else {
					// TODO: try to find id in community and teacher collections
				}
				break
		}

		return result
	}

	getIdsInCollection(collectionType: CHALLENGE_TYPE) {
		let result, collection: Challenge[]
		collection = this.getByType(collectionType)

		if (collection) {
			result = collection.map(c => c.id)
		}

		return result
	}

	private loadBuiltinChallenges() {
		let id = 0
		this.examples = []
		for (let trackSetup of Settings.DEFAULT_CHALLENGES) {
			id++
			this.examples.push({
				id: id.toString(),
				name: `Challenge #${id}`,
				custom: false,
				mode: Settings.MODE_NORMAL,
				goal: trackSetup,
				type: CHALLENGE_TYPE.EXAMPLE
			})
		}

		this.tutorial = {
			id: 'tutorial',
			name: 'Challenge Tutorial',
			custom: false,
			mode: Settings.MODE_NORMAL,
			goal: Settings.TUTORIAL_CHALLENGE,
			type: CHALLENGE_TYPE.TUTORIAL
		}

		this.exploration = {
			id: 'exploration',
			name: 'Free Exploration',
			custom: false,
			mode: Settings.MODE_NORMAL,
			goal: Settings.TUTORIAL_CHALLENGE,
			type: CHALLENGE_TYPE.EXPLORATION
		}
	}
}
