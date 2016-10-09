import { UserSettings } from '../shared/types'

export * from './challenge-messages'
export * from './challenge-setups'

export const GRAVITY_ACCELERATION = 980.665 // cm/s²
export const ANIMATION_DURATION = 10

export const USER_SETTINGS_DEFAULTS: UserSettings = {
	effects: true,
	animationDuration: ANIMATION_DURATION
}

export const THEME = {
	colors: {
		position: 'orangered',
		velocity: 'forestgreen',
		acceleration: 'steelblue'
	}
}
