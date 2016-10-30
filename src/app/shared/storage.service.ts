import { Injectable } from '@angular/core'
import { Challenge } from './types'

import * as Settings from '../settings'

const MAIN_KEY = 'gt'
// TODO: Implement migration
// const DATA_VERSION = 1


@Injectable()
export class StorageService {
	private storage: Storage
	
	get challenges() {
		return this.storage.challenges
	}
	
	constructor() {
		this.storage = this.load()
		window.onbeforeunload = () => this.save()
	}
	
	init() {
		let storage: Storage = {}
		
		storage.challenges = this.loadBuiltinChallenges()
		
		this.save(storage)
		
		return storage
	}
	
	load(): Storage {
		let exists = localStorage.hasOwnProperty(MAIN_KEY)
		if (!exists) {
			this.init()
		}
		
		return JSON.parse(localStorage.getItem(MAIN_KEY))
	}
	
	save = (storage?: Storage) => {
		let toSave = storage || this.storage
		localStorage.setItem(MAIN_KEY, JSON.stringify(toSave))
	}
	
	private loadBuiltinChallenges() {
		let all: Challenge[] = [
			...Settings.CHALLENGES_EASY,
			...Settings.CHALLENGES_INTERMEDIATE,
			...Settings.CHALLENGES_HARD,
			Settings.TUTORIAL_CHALLENGE,
			Settings.EDITOR_SETUP,
			Settings.PRACTICE_SETUP,
		]
		
		for (let challenge of all) {
			challenge.attempts = challenge.attempts || 0
			challenge.complete = challenge.complete !== undefined ? challenge.complete : false
		}
		
		return all
	}
}


export interface Storage {
	challenges?: Challenge[]
}
