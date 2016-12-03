import { Injectable } from '@angular/core'

import { Challenge, CHALLENGE_TYPE, CHALLENGE_DIFFICULTY } from './types'
import { StorageService } from './storage.service'
import { MODE_NORMAL } from '../settings/challenge-setups'

@Injectable()
export class ChallengesService {
	importedChallenge: string
	constructor(private storage: StorageService) {
		this.checkForImport()
	}
	
	checkForImport() {
		if (localStorage['import']) {
			this.importChallenge(localStorage['import'])
			localStorage['import'] = ''
		}
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
	
	encodeChallenge(challenge: Challenge) {
		let setupArray = [
			challenge.difficulty,
			challenge.goal.position,
			challenge.goal.velocity,
			...challenge.goal.posts
		]
		let setupString = setupArray.join(',')
		let challengeString = `${setupString}|${challenge.name}`
		
		return btoa(challengeString)
	}
	
	importChallenge(encodedChallenge: string) {
		let challengeString = atob(encodedChallenge).split('|')
		let setup = challengeString[0].split(',').map(p => parseInt(p))
		let name = challengeString[1]
		
		if (this.storage.challenges.find(c => c.name === name)) {
			console.log(`A challenge named "${name}" already exists!`)
			return
		}
		
		let d = setup.shift()
		let p = setup.shift()
		let v = setup.shift()
		
		let challenge: Challenge = {
			id: Date.now().toString(),
			name: name,
			attempts: 0,
			complete: false,
			mode: MODE_NORMAL,
			type: CHALLENGE_TYPE.CUSTOM,
			difficulty: <CHALLENGE_DIFFICULTY> d,
			goal: {
				position: p,
				velocity: v,
				posts: setup,
			}
		}
		
		this.importedChallenge = challenge.id
		this.storage.challenges.push(challenge)
	}
}
