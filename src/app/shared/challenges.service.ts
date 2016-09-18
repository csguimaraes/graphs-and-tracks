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
		this.examples = [
			...Settings.EASY_CHALLENGES,
			...Settings.INTERMEDIATE_CHALLENGES,
			...Settings.HARD_CHALLENGES,
		]

		this.tutorial = Settings.TUTORIAL_CHALLENGE
	}
}
