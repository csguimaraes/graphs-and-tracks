import { UserSettings } from '../shared/types'

export * from './hints'
export * from './tutorial'
export * from './builtin-challenges'

export const GRAVITY_ACCELERATION = 980.665 // cm/s²
export const ANIMATION_DURATION = 10

export const USER_SETTINGS_DEFAULTS: UserSettings = {
	effects: true
}

export const THEME = {
	colors: {
		position: 'orangered',
		velocity: 'forestgreen',
		acceleration: 'steelblue'
	}
}



