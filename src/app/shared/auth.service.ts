import { Injectable } from '@angular/core'

import { User } from './types'
import * as Settings from '../settings'

@Injectable()
export class AuthService {
	user: User
	constructor() {
		this.user = {
			id: '1',
			username: 'davidtro',
			avatarUrl: 'https://avatars2.githubusercontent.com/u/12277904?v=3&s=466',
			settings: Settings.USER_SETTINGS_DEFAULTS
		}
	}
}
