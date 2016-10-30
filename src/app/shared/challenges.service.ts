import { Injectable } from '@angular/core'

import { Challenge, CHALLENGE_TYPE } from './types'
import { StorageService } from './storage.service'

@Injectable()
export class ChallengesService {
	constructor(private storage: StorageService) {
	}

	getByType(type: CHALLENGE_TYPE = CHALLENGE_TYPE.EXAMPLE): Challenge[] {
		return this.storage.challenges.filter(c => c.type === type)
	}

	getById(id?: string) {
		return this.storage.challenges.find(c => c.id === id)
	}

	getIdsInCollection(collectionType: CHALLENGE_TYPE) {
		let result, collection: Challenge[]
		collection = this.getByType(collectionType)

		if (collection) {
			result = collection.map(c => c.id)
		}

		return result
	}
	
	save(challenge: Challenge) {
		challenge.id = Date.now().toString()
		challenge.attempts = 0
		challenge.complete = false
		challenge.type = CHALLENGE_TYPE.CUSTOM
		this.storage.challenges.push(challenge)
	}
	
	remove(challengeId: string) {
		let challenge = this.storage.challenges.find(c => c.id === challengeId)
		let idx = this.storage.challenges.indexOf(challenge)
		this.storage.challenges.splice(idx, 1)
	}
}
