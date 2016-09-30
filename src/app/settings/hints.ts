import { HintMessage } from '../shared/types'

export const HINT_MESSAGES: { [name: string]: HintMessage } = {
	intro: {
		// NOTE: titles and messages can be arrays, they will be randomly selected
		title: ['Hints enabled'],
		message: `
			With hints enabled, we will provide guidance on how to improve your current setup.
			<br> <br>
			For instructions on how to use the program, select the <b>tutorial</b> icon above.
		`
	},
	position: {
		title: 'Starting position',
		message: `
			Your ball starts at the wrong place.
			<br> <br>
			Examine the <b class="s">position graph</b> and read off the <b class="s">initial position</b> <span>(at time t=0)</span>.
		`
	},
	velocity: {
		title: 'Initial velocity',
		message: `
			Take a careful look at the <b class="v">velocity graph</b>.
			<br> <br>
			If the velocity at time t=0 is positive, this means the ball is initially rolling to the right;
			<br>
			if it’s negative the ball is rolling to the left.
		`
	},
	posts: {
		title: 'Accelerations on ramps',
		message: `
			The highlighted ramp has the wrong inclination.
			<br><br>
			Take a careful look at the <b class="a">acceleration graph</b> to see whether the acceleration
			on this ramp should be <b>positive</b> <span>(sloping downward to the right)</span>,
			<b>negative</b> <span>(sloping upward to the right)</span> or zero (level).
			<br> <br>
			Holding down the <b class="b">ROLL BALL</b> button will show the motion one segment at a time.
		`
	}
}
