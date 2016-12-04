import { TutorialStep, Message, UI_CONTROL } from '../shared/types'

export const TUTORIAL_STEPS: TutorialStep[] = [
	{
		title: 'Welcome to Graphs and Tracks!',
		content: `
			Your mission is to discover the motion of a rolling ball by using the
			information provided in graphs of position, velocity and acceleration.
		`
	},
	{
		title: 'Motion graphs',
		content: `
			Try to recreate the motion by setting the initial conditions and adjusting the tracks.
			<br>
			When you are successful, your graph will match the challenge graph.
			<br> <br>
			Click on the <b class="b">ROLL BALL</b> button.
		`,
		requires: [UI_CONTROL.ROLL_BUTTON],
		triggers: [UI_CONTROL.POSITION_GRAPH]
	},
	{
		title: 'Motion graphs',
		content: `
			Your graphs, with <span class="solid">solid lines</span>, should match the challenge graphs, the <span class="dashed">dashed lines</span>.
		`,
		requires: [],
		triggers: [UI_CONTROL.POSITION_GRAPH]
	},
	{
		title: 'Position graph',
		content: `
			The vertical axis of the <b class="s">POSITION</b> vs. time graph corresponds to the horizontal position of the ball.
		`,
		requires: [],
		triggers: []
	},
	{
		title: 'Finding the right place',
		content: `
			Note the scale of <b class="s">Initial Position</b> directly below the tracks.
			<br> <br>
			You can set the starting position of the ball by clicking on new position values, dragging the ball,
			or by dragging the scale pointers. Try it!
		`,
		requires: [UI_CONTROL.POSITION_SCALE],
		triggers: [UI_CONTROL.TUTORIAL_NEXT]
	},
	{
		title: 'Finding the right place',
		content: `
			The position vs. time graph shows what direction the ball travels. An upward line means going to the right.
			<br> <br>
			When ready, click on <b class="v">VELOCITY</b> to see a graph of velocity vs. time.
		`,
		requires: [UI_CONTROL.VELOCITY_GRAPH],
		triggers: [UI_CONTROL.TUTORIAL_NEXT]
	},
	{
		title: 'Velocity graph',
		content: `
			Here is the <b class="v">VELOCITY</b> graph for this first example of motion. <br> 
			Can you see places where the speed changes? Or stays the same for a period of time?
		`,
		requires: [],
		triggers: []
	},
	{
		title: 'Initial speed and direction',
		content: `
			In some challenge motions, the ball may already be moving at time t=0.
			<br> <br>
			Its initial velocity may be positive <span>(to the right)</span> or negative <span>(to the left)</span>, or zero <span>(at rest)</span>.
			<br> <br>
			Use the <b class="v">Initial Velocity</b> scale to set the ball’s starting velocity.
		`,
		requires: [UI_CONTROL.VELOCITY_SCALE],
		triggers: [UI_CONTROL.TUTORIAL_NEXT]
	},
	{
		title: 'Initial speed and direction',
		content: `
			Try different initial  velocities (positive and negative) and see what happens.
			<br> <br>
			When ready, click on <b class="a">ACCELERATION</b>.
		`,
		requires: [UI_CONTROL.ACCELERATION_GRAPH],
		triggers: [UI_CONTROL.TUTORIAL_NEXT]
	},
	{
		title: 'Acceleration graph',
		content: `
			The acceleration vs. time graph shows when the acceleration of the ball is positive (to the right), negative (to the left) or zero (constant velocity).
		`,
		requires: [],
		triggers: []
	},
	{
		title: 'Change the track setup',
		content: `
			Drag the top of a <b>POST</b> to raise or lower it, or simply tap above or below to increase or decrease its <b>height</b>.
			The height of each post is displayed at its base.
		`,
		requires: [UI_CONTROL.TRACK_POST_ANY],
		triggers: []
	},
	{
		title: 'Test your new setup',
		content: `
			Select the <b class="a">ACCELERATION</b> graph.
			<br> <br>
			Then click <b class="b">ROLL BALL</b> to see how the acceleration of the ball changes.
			<br> <br>
			Acceleration graphs will help you for find out how steep to make your ramps.
		`,
		requires: [UI_CONTROL.ROLL_BUTTON],
		triggers: [UI_CONTROL.ACCELERATION_GRAPH]
	},
	{
		title: 'One step at a time',
		content: `
			The problem can be simplified by focusing on short segments.
			<br> <br>
			To see the motion for only one sloping section at a time, click and <b>hold down</b> the <b class="b">ROLL BALL</b> button.
		`,
		requires: [UI_CONTROL.ROLL_BUTTON_HOLD],
		triggers: []
	},
	{
		title: 'Tutorial complete',
		content: `
			That’s it. Feel free to experiment in the <a [routerLink]="['/challenges/practice']">Practice</a> section,
			or go directly to the <a [routerLink]="['/challenges']">Challenges</a> list to pick your first one.
		`,
		requires: []
	},
]

export const HINT_MESSAGES: { [name: string]: Message } = {
	intro: {
		// NOTE: titles and messages can be arrays, they will be randomly selected
		title: ['Hints enabled'],
		content: `
			With hints enabled, we will provide guidance on how to improve your current setup.
			<br> <br>
			You can select the <b>tutorial</b> button for instructions on how to use the program.
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
			Use the <b class="v">VELOCITY</b> graph to read off the initial velocity.
			<br>
			If the initial velocity is positive, this means the ball is initially rolling to the right; if it’s negative the ball rolls to the left.
		`
	},
	posts: {
		title: 'Accelerations on ramps',
		content: `
			The highlighted ramp has the wrong inclination.
			<br><br>
			Take a careful look at the <b class="a">acceleration graph</b> to see whether the acceleration
			on this ramp should be <b>positive</b> <span>(sloping downward to the right)</span>,
			<b>negative</b> <span>(sloping upward to the right)</span> or <b>zero</b> (level).
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
const KUDOS_SS = `Note that with this track arrangement and the initial position and initial velocity values as shown on the scales,
the graphs match. <br><br> When ready, try a challenge without viewing the solution.`

export const KUDOS = {
	titles: KUDOS_TITLES,
	intros: KUDOS_INTROS,
	icons: KUDOS_ICONS,
	h0n0: KUDOS_H0N0,
	h0n1: KUDOS_H0N1,
	h1n0: KUDOS_H1N0,
	h1n1: KUDOS_H1N1,
	ss: KUDOS_SS
}
