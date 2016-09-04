import * as Types from './types'

export const GRAVITY_ACCELERATION = 980.665 // cm/s²
export const ANIMATION_DURATION = 5

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
	{ position: 250, velocity: -10, posts: [0, 8, 0, 0, 6, 0] },
	{ position: 100, velocity: -60, posts: [0, 10, 4, 0, 0, 0] }
]


export const THEME = {
	colors: {
		position: 'orangered',
		velocity: 'forestgreen',
		acceleration: 'steelblue'
	}
}

export const HINTS: { [name: string]: Types.Hint } = {
	intro: {
		title: 'Hints enabled!',
		message: `
			Leave hints enabled and after each unsuccessful attempt we will try to point out something wrong in your current setup.
			<br><br>
			If you want to learn how to resolve a challenge check out the <b>tutorial</b> available in button above.
			<br><br>
			<b>Good luck!</b>
		`
	},
	position: {
		title: 'Where is the ball coming from?',
		message: `
			It seems that the ball is starting its motion from the wrong place...<br><br>
			Checkout the <b class="s">position graph</b> and try to select the appropriate <b>initial position</b> for the motion. 
		`
	},
	velocity: {
		title: 'Need for speed!',
		message: `
			Starting with this velocity the ball will produce a different motion.<br><br>
			Is it too fast? Too slow? Take a look on the <b class="v">velocity graph</b> to find out how much is the <b>initial velocity</b>.
		`
	},
	posts: {
		title: 'You\'re almost there!',
		message: `
			Double check the inclination of each ramp as they determine the acceleration of the ball on that ramp.<br><br>
			Analyze the <b class="a">acceleration graph</b> carefully and try to figure out how to get
			the correct acceleration on each ramp by <b>adjusting the post heights</b> and therefore the ramp's inclination.
		`
	}
}

export const TOUR = [
	{
		title: 'How to solve a challenge?',
		hint: `
			Your mission is to make the ball reproduce the very same moviment described in the graphs.<br>
			To do so you need to adjust the track below and roll the ball until you figure out
			the correct values to achieve the challenge goal.
		`
	}
]
