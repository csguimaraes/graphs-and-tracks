import { Message } from 'challenges'

export const HINT_MESSAGES: { [name: string]: Message } = {
	intro: {
		// NOTE: titles and messages can be arrays, they will be randomly selected
		title: ['Hints enabled'],
		content: `
			With hints enabled, we will provide guidance on how to improve your current setup.
			<br> <br>
			For instructions on how to use the program, select the <b>tutorial</b> icon above.
		`
	},
	position: {
		title: 'Starting position',
		content: `
			Your ball starts at the wrong place.
			<br> <br>
			Examine the <b class="s">position graph</b> and read off the <b class="s">initial position</b> <span>(at time t=0)</span>.
		`
	},
	velocity: {
		title: 'Initial velocity',
		content: `
			Take a careful look at the <b class="v">velocity graph</b>.
			<br> <br>
			If the velocity at time t=0 is positive, this means the ball is initially rolling to the right;
			<br>
			if it’s negative the ball is rolling to the left.
		`
	},
	posts: {
		title: 'Accelerations on ramps',
		content: `
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

const KUDOS_TITLES: string[] = [
	'Congratulations!',
	'Excellent!',
	'That’s it!',
	'Very good!',
]

const KUDOS_INTROS: string[] = [
	'You have successfully recreated the motion described in the challenge graphs.',
	'All three graphs match. You have found the correct motion.',
	'You have reproduced the challenge motion.',
	'The graphs for your motion match the graphs of the challenge.',
]

const KUDOS_ICONS: { [key: string]: string } = {
	normal: 'sentiment_satisfied',
	good: 'mood',
	awesome: 'sentiment_very_satisfied',
}

const KUDOS_H0N0 = 'Without using any hints, you discovered the motion on your first try.'
const KUDOS_H0N1 = 'Without using any hints, you found the solution after %N% tries.'
const KUDOS_H1N0 = 'You found the correct arrangement on your first try. Now try another challenge without using any hints.'
const KUDOS_H1N1 = 'You found the correct arrangement after %N% tries. Try another. See if you can do it without hints.'

export const KUDOS = {
	titles: KUDOS_TITLES,
	intros: KUDOS_INTROS,
	icons: KUDOS_ICONS,
	h0n0: KUDOS_H0N0,
	h0n1: KUDOS_H0N1,
	h1n0: KUDOS_H1N0,
	h1n1: KUDOS_H1N1,
}
