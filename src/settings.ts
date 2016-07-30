import * as Types from './types'

export const MODE_NORMAL: Types.ChallengeMode = {
	simulation: {
		duration: 25,
		precision: 5
	},
	domain: {
		position: { min: 0, max: 500, step: 50 },
		velocity: { min: -60, max: 60, step: 10 },
		posts: { min: 0, max: 10, step: 1 }
	},
	postsCount: 6
}

// List of motion setups for built-in challenges
export const DEFAULT_CHALLENGES: Types.MotionSetup[] = [
	{ position: 50, velocity: -30, posts: [5, 4, 3, 2, 1, 0] },
	{ position: 400, velocity: 30, posts: [0, 0, 0, 2, 4, 6] },
	{ position: 350, velocity: 60, posts: [4, 2, 0, 0, 2, 4] },
	{ position: 50, velocity: -30, posts: [4, 2, 1, 0, 2, 4] },
	{ position: 100, velocity: -50, posts: [3, 0, 1, 1, 1, 1] },
	{ position: 450, velocity: 10, posts: [2, 2, 1, 0, 2, 4] },
	{ position: 450, velocity: -30, posts: [5, 0, 2, 2, 0, 6] },
	{ position: 50, velocity: 60, posts: [1, 2, 0, 3, 0, 9] },
]
