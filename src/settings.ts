import * as Types from './types'

// Valid data domains for each param type
export const VELOCITY_DOMAIN: Types.DataDomain = { step: 10, min: 60, max: 60 }
export const POSITION_DOMAIN: Types.DataDomain = { step: 50, min: 0, max: 500 }
export const POSTS_DOMAIN: Types.DataDomain = { step: 1, min: 0, max: 10, count: 6 }

// List of track setups for built-in challenges
export const DEFAULT_CHALLENGES: Types.TrackSetupData[] = [
	{ position: 50, velocity: -30, posts: [6, 5, 4, 3, 2, 1] },
	{ position: 400, velocity: 30, posts: [0, 0, 0, 2, 4, 6] }
]

export const GRAPH = { clock_interval: 200 }
