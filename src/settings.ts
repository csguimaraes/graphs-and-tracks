import * as Types from './types'

export const MODE_NORMAL: Types.ChallengeMode = {
	simulation: {
		duration: 20,
		precision: 1
	},
	domain: {
		position: { step: 50, min: 0, max: 500 },
		velocity: { step: 10, min: 60, max: 60 },
		posts: { step: 1, min: 0, max: 10 }
	},
	postsCount: 6
}

// List of motion setups for built-in challenges
export const DEFAULT_CHALLENGES: Types.MotionSetupData[] = [
	{ position: 500, velocity: 0, posts: [5, 5, 4, 4, 4, 6] },
	{ position: 50, velocity: -30, posts: [6, 5, 4, 3, 2, 1] },
	{ position: 400, velocity: 30, posts: [0, 0, 0, 2, 4, 6] }
]
