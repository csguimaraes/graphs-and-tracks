import { TutorialStep, Message, UI_CONTROL } from '../shared/types'

export const TUTORIAL_STEPS: TutorialStep[] = [
	{
		title: 'Welcome to Graphs & Tracks!',
		content: `
			Your mission is to discover the true motion of a rolling ball by using the
			information provided in graphs of position, velocity and acceleration.
		`
	},
	{
		title: 'Motion graphs',
		content: `
			Try to recreate the motion by setting the initial conditions and adjusting the tracks. When you roll the ball,
			your graphs <span>(solid lines)</span> should match the challenge graphs <span>(dashed lines)</span>.
			<br> <br>
			Click on <b class="b">ROLL BALL</b>.
		`,
		requires: [UI_CONTROL.ROLL_BUTTON],
		triggers: [UI_CONTROL.POSITION_GRAPH, UI_CONTROL.TUTORIAL_NEXT_ON_ANIMATION_END]
	},
	{
		title: 'Position graph',
		content: `
			On the <b class="s">POSITION</b> graph, note that the graph for the actual motion <span>(solid curve)</span>
			does NOT match the given graph (dashed). <br>
			Your task is to match the graphs.<br>
			<br>
			Now select the <b class="v">VELOCITY</b> graph.
		`,
		requires: [UI_CONTROL.VELOCITY_GRAPH],
		triggers: [UI_CONTROL.TUTORIAL_NEXT]
	},
	{
		title: 'Velocity graph',
		content: `
			Here is the velocity graph for this first example of motion.
			<br> <br>
			Let's see the <b class="a">ACCELERATION</b> graph now.
		`,
		requires: [UI_CONTROL.ACCELERATION_GRAPH],
		triggers: [UI_CONTROL.TUTORIAL_NEXT]
	},
	{
		title: 'Three graphs, any motion',
		content: `
			Use information contained in these three graphs to discover the motion of the ball which is one-dimensional <span>(along a straight line)</span>.
			<br> <br>
			Now return to the position vs. time graph by clicking on <b class="s">POSITION</b>.
		`,
		requires: [UI_CONTROL.POSITION_GRAPH],
		triggers: [UI_CONTROL.TUTORIAL_NEXT]
	},
	{
		title: 'Finding the right place',
		content: `
			Note the scale of <b class="s">INITIAL POSITION</b> directly below the tracks.
			<br> <br>
			You can set the starting position of the ball by clicking on new position values
			or by dragging the scale pointers. Drag the pointers rather than the ball itself.
		`,
		requires: [UI_CONTROL.POSITION_SCALE]
	},
	{
		title: 'Setting the initial speed and direction',
		content: `
			The ball in the challenge motion may already be moving at time t=0.
			<br> <br>
			Its initial velocity may be positive <span>(to the right)</span> or negative <span>(to the left)</span>, or zero <span>(at rest)</span>.
			<br> <br>
			Use the <b class="v">INITIAL VELOCITY</b> scale to set the ball’s starting velocity.
		`,
		requires: [UI_CONTROL.VELOCITY_SCALE],
		triggers: [UI_CONTROL.TUTORIAL_NEXT]
	},
	{
		title: 'Change the Track setup',
		content: `
			Drag the top of a <b>POST</b> to raise or lower its <b>height</b>,
			or simply tap above or below a post head to gradually change the height value of that post.
		`,
		requires: [UI_CONTROL.TRACK_POST_ANY]
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
		requires: [UI_CONTROL.ROLL_BUTTON_HOLD]
	},
	{
		title: 'Tutorial complete',
		content: `
			That's it, now you're ready to start. You can go to the <a [routerLink]="['/challenges']">challenges list</a> and
			pick your first one.
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
