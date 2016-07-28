import * as Types from './types'

// Valid data domains for each param type
export const VELOCITY_DOMAIN: Types.DataDomain = { step: 10, min: 60, max: 60 }
export const POSITION_DOMAIN: Types.DataDomain = { step: 50, min: 0, max: 500 }
export const POSTS_DOMAIN: Types.DataDomain = { step: 1, min: 0, max: 10, count: 6 }

// List of motion setups for built-in challenges
export const DEFAULT_CHALLENGES: Types.MotionSetupData[] = [
	{ position: 400, velocity: 10, posts: [2, 2, 3, 4, 5, 6] },
	{ position: 50, velocity: -30, posts: [6, 5, 4, 3, 2, 1] },
	{ position: 400, velocity: 30, posts: [0, 0, 0, 2, 4, 6] }
]

export const GRAPH = { clock_interval: 200 }
