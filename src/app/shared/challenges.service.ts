import { Injectable } from '@angular/core'

import { Challenge, CHALLENGE_TYPE } from './types'
import * as Settings from '../settings'

@Injectable()
export class ChallengesService {
	private tutorial: Challenge
	private editor: Challenge
	private practice: Challenge
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

			case CHALLENGE_TYPE.PRACTICE:
				result = [this.practice]
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

			case 'practice':
				result = this.practice
				break
			
			case 'editor':
				result = this.editor
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
			...Settings.CHALLENGES_EASY,
			...Settings.CHALLENGES_INTERMEDIATE,
			...Settings.CHALLENGES_HARD,
		]

		this.tutorial = Settings.TUTORIAL_CHALLENGE
		this.editor = Settings.EDITOR_SETUP
		this.practice = Settings.PRACTICE_SETUP

		let all = [
			this.tutorial,
			this.practice,
			this.editor,
			...this.examples
		]

		for (let challenge of all) {
			challenge.attempts = challenge.attempts || []
			challenge.complete = challenge.complete !== undefined ? challenge.complete : false
		}
	}
}
