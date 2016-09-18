import * as Types from './types'

export * from './builtin-challenges'

export const GRAVITY_ACCELERATION = 980.665 // cm/s²
export const ANIMATION_DURATION = 10
export const USER_SETTINGS_DEFAULTS: Types.UserSettings = {
	effects: true
}

export const THEME = {
	colors: {
		position: 'orangered',
		velocity: 'forestgreen',
		acceleration: 'steelblue'
	}
}

export const HINT_MESSAGES: { [name: string]: Types.HintMessage } = {
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
		title: 'This is the right position?',
		message: `
			It seems that the ball is starting its motion from the wrong place...<br><br>
			Checkout the <b class="s">position graph</b> and try to select the appropriate <b>initial position</b> for the motion. 
		`
	},
	velocity: {
		title: 'Wrong velocity speed!',
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

export const TUTORIAL_STEPS = [
	{
		title: 'How to solve a challenge?',
		message: `
			Your mission is to make the ball reproduce the very same moviment described in the graphs.<br>
			To do so you need to adjust the track below and roll the ball until you figure out
			the correct values to achieve the challenge goal.
		`
	}
]
