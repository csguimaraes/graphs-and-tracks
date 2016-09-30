import {CHALLENGE_DIFFICULTY, CHALLENGE_TYPE, Challenge, ChallengeMode, MotionSetup} from '../shared/types'

export const MODE_NORMAL: ChallengeMode = {
	simulation: {
		duration: 25,
		precision: 25
	},
	domain: {
		position: { min: 0, max: 500, step: 50 },
		velocity: { min: -60, max: 60, step: 10 },
		posts: { min: 0, max: 10, step: 1 }
	},
	postsCount: 6
}

export const INITIAL_SETUP: MotionSetup = {
	position: 0,
	velocity: 30,
	posts: [0, 0, 0, 0, 0, 0]
}

export const TUTORIAL_CHALLENGE_SETUP: MotionSetup = {
	position: 50,
	velocity: 30,
	posts: [5, 5, 5, 5, 5, 5]
}

export const TUTORIAL_CHALLENGE: Challenge = {
	id: 'tutorial',
	name: 'Challenge Tutorial',
	type: CHALLENGE_TYPE.TUTORIAL,
	difficulty: CHALLENGE_DIFFICULTY.EASY,
	mode: MODE_NORMAL,
	goal: { position: 50, velocity: -30, posts: [4, 2, 0, 0, 0, 0] }
}

export const EASY_CHALLENGES: Challenge[] = [
	{
		id: '1',
		name: 'Challenge #1',
		type: CHALLENGE_TYPE.EXAMPLE,
		difficulty: CHALLENGE_DIFFICULTY.EASY,
		mode: MODE_NORMAL,
		goal: { position: 50, velocity: 30, posts: [0, 0, 0, 0, 0, 0] }
	},
	{
		id: '2',
		name: 'Challenge #2',
		type: CHALLENGE_TYPE.EXAMPLE,
		difficulty: CHALLENGE_DIFFICULTY.EASY,
		mode: MODE_NORMAL,
		goal: { position: 250, velocity: 20, posts: [0, 0, 0, 0, 0, 0] }
	},
	{
		id: '3',
		name: 'Challenge #3',
		type: CHALLENGE_TYPE.EXAMPLE,
		difficulty: CHALLENGE_DIFFICULTY.EASY,
		mode: MODE_NORMAL,
		goal: { position: 0, velocity: 0, posts: [5, 4, 3, 2, 1, 0] }
	},
	{
		id: '4',
		name: 'Challenge #4',
		type: CHALLENGE_TYPE.EXAMPLE,
		difficulty: CHALLENGE_DIFFICULTY.EASY,
		mode: MODE_NORMAL,
		goal: { position: 400, velocity: 60, posts: [0, 0, 0, 0, 0, 0] }
	},
	{
		id: '5',
		name: 'Challenge #5',
		type: CHALLENGE_TYPE.EXAMPLE,
		difficulty: CHALLENGE_DIFFICULTY.EASY,
		mode: MODE_NORMAL,
		goal: { position: 100, velocity: 20, posts: [5, 4, 3, 2, 1, 0] }
	}
]

export const INTERMEDIATE_CHALLENGES: Challenge[] = [
	{
		id: '6',
		name: 'Challenge #6',
		type: CHALLENGE_TYPE.EXAMPLE,
		difficulty: CHALLENGE_DIFFICULTY.INTERMEDIATE,
		mode: MODE_NORMAL,
		goal: { position: 350, velocity: 60, posts: [5, 4, 3, 2, 1, 0] }
	},
	{
		id: '7',
		name: 'Challenge #7',
		type: CHALLENGE_TYPE.EXAMPLE,
		difficulty: CHALLENGE_DIFFICULTY.INTERMEDIATE,
		mode: MODE_NORMAL,
		goal: { position: 50, velocity: 30, posts: [5, 4, 3, 2, 1, 0] }
	},
	{
		id: '8',
		name: 'Challenge #8',
		type: CHALLENGE_TYPE.EXAMPLE,
		difficulty: CHALLENGE_DIFFICULTY.INTERMEDIATE,
		mode: MODE_NORMAL,
		goal: { position: 500, velocity: 0, posts: [0, 0, 0, 2, 4, 6] }
	},
	{
		id: '9',
		name: 'Challenge #9',
		type: CHALLENGE_TYPE.EXAMPLE,
		difficulty: CHALLENGE_DIFFICULTY.INTERMEDIATE,
		mode: MODE_NORMAL,
		goal: { position: 50, velocity: 10, posts: [6, 6, 0, 0, 0, 0] }
	},
	{
		id: '10',
		name: 'Challenge #10',
		type: CHALLENGE_TYPE.EXAMPLE,
		difficulty: CHALLENGE_DIFFICULTY.INTERMEDIATE,
		mode: MODE_NORMAL,
		goal: { position: 450, velocity: 200, posts: [10, 2, 2, 1, 0, 2, 4] }
	}
]

export const HARD_CHALLENGES: Challenge[] = [
	{
		id: '11',
		name: 'Challenge #11',
		type: CHALLENGE_TYPE.EXAMPLE,
		difficulty: CHALLENGE_DIFFICULTY.HARD,
		mode: MODE_NORMAL,
		goal: { position: 50, velocity: 30, posts: [4, 2, 0, 0, 2, 4] }
	},
	{
		id: '12',
		name: 'Challenge #12',
		type: CHALLENGE_TYPE.EXAMPLE,
		difficulty: CHALLENGE_DIFFICULTY.HARD,
		mode: MODE_NORMAL,
		goal: { position: 450, velocity: 30, posts: [5, 0, 2, 2, 0, 6] }
	},
	{
		id: '13',
		name: 'Challenge #13',
		type: CHALLENGE_TYPE.EXAMPLE,
		difficulty: CHALLENGE_DIFFICULTY.HARD,
		mode: MODE_NORMAL,
		goal: { position: 50, velocity: 60, posts: [1, 2, 0, 3, 0, 9] }
	},
	{
		id: '14',
		name: 'Challenge #14',
		type: CHALLENGE_TYPE.EXAMPLE,
		difficulty: CHALLENGE_DIFFICULTY.HARD,
		mode: MODE_NORMAL,
		goal: { position: 100, velocity: 50, posts: [3, 0, 1, 1, 1, 1] }
	},
	{
		id: '15',
		name: 'Challenge #15',
		type: CHALLENGE_TYPE.EXAMPLE,
		difficulty: CHALLENGE_DIFFICULTY.HARD,
		mode: MODE_NORMAL,
		goal: { position: 350, velocity: 60, posts: [8, 0, 0, 0, 0, 6] }
	}
]
