import * as Types from './types'

export const MODE_NORMAL: Types.ChallengeMode = {
	simulation: {
		duration: 20,
		precision: 1
	},
	domain: {
		position: { min: 0, max: 500, step: 50 },
		velocity: { min: -60, max: 60, step: 10 },
		posts: { min: 0, max: 10, step: 1 }
	},
	postsCount: 6
}

// List of motion setups for built-in challenges
export const DEFAULT_CHALLENGES: Types.MotionSetupData[] = [
	{ position: 500, velocity: 0, posts: [5, 5, 4, 4, 4, 6] },
	{ position: 50, velocity: -30, posts: [6, 5, 4, 3, 2, 1] },
	{ position: 400, velocity: 30, posts: [0, 0, 0, 2, 4, 6] }
]
