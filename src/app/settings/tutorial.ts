import { TutorialStep, UI_CONTROL } from '../shared/types'

export const TUTORIAL_STEPS: TutorialStep[] = [
	{
		title: 'Welcome to Graphs & Tracks!',
		message: `
			Your mission is to make the ball reproduce the very same moviment described in the graphs.<br><br>
			To do so you need to adjust the track below and roll the ball until you figure out
			the correct values to achieve the challenge goal.
		`
	},
	{
		title: 'Motion graphs',
		message: `
			The position, velocity and acceleration graphs represent the motion of a ball. <br>
			Try to recreate the motion by setting the initial conditions and adjusting the tracks. <br>
			When you roll the ball, your graphs (solid lines) should match the challenge graphs (dashed lines). <br>
			<br>
			Use the button <b class="b">ROLL BALL</b> to watch how the ball moves in this current setup...  
		`,
		requires: [UI_CONTROL.ROLL_BUTTON],
		triggers: [UI_CONTROL.POSITION_GRAPH]
	},
	{
		title: 'Position graph',
		message: `
			On the <b class="s">POSITION</b> graph, note that the graph for the actual motion (solid curve)
			does NOT match the given graph (dashed). <br>
			Your task is to match the graphs.<br>
			<br>
			Now select the <b class="v">VELOCITY</b> graph.
		`,
		requires: [UI_CONTROL.VELOCITY_GRAPH]
	},
	{
		title: 'Velocity graph',
		message: `
			Here is the velocity graph for this first example of motion.<br>
			<br>
			Let's see the <b class="a">ACCELERATION</b> graph now.
		`,
		requires: [UI_CONTROL.ACCELERATION_GRAPH]
	},
	{
		title: 'Three graphs, any motion',
		message: `
			You may use each of these three graphs to meet each challenge. <br>
			Now please return to the position vs. time graph by selecting the <b class="s">POSITION</b> again.
		`,
		requires: [UI_CONTROL.POSITION_GRAPH]
	},
	{
		title: 'Finding the right place',
		message: `
			Down below you can see the scale for selecting <b class="s">INITIAL POSITION</b>,
			you can drag the scale or select a value directly to set the starting point for the ball motion.
		`,
		requires: [UI_CONTROL.POSITION_SCALE]
	},
	{
		title: 'We know where it come from, now where it goes?',
		message: `
			Select the on the <b class="v">INITIAL VELOCITY</b> scale to set a starting velocity.
			Negative values correspond to motion to the left, positive values to the right.
		`,
		requires: [UI_CONTROL.VELOCITY_SCALE]
	},
	{
		title: 'Change the Track setup',
		message: `
			Drag the top of a <b>POST</b> to raise or lower its <b>height</b>,
			or simply tap above or below a post head to gradually change the height value of that post.
		`,
		requires: [UI_CONTROL.POST_ANY]
	},
	{
		title: 'Test your new setup',
		message: `
			Go on and select the <b class="b">ROLL BALL</b> button to see the <b class="a">ACCELERATION</b> graph that your currrent setup generates.
		`,
		requires: [UI_CONTROL.ROLL_BUTTON],
		triggers: [UI_CONTROL.ACCELERATION_GRAPH]
	},
	{
		title: 'Inclination and Acceleration',
		message: `
			Try adjusting the <b>left-most post</b> and select <b class="b">ROLL BALL</b> once more.<br>
			This time, pay attention on how the the ball accelaration changes over time as we adjust post heights and therefore the
			inclination of the ramp on which the ball is rolling on.
		`,
		requires: [UI_CONTROL.POST_FIRST, UI_CONTROL.ROLL_BUTTON]
	},
	{
		title: 'Let\'s go by parts',
		message: `
			It may be easier to understand what is wrong in your current setup by watching the ball rolling on each ramp segment,
			one at a time. To do that simply select and <b>hold</b> the <b class="b">ROLL BALL</b> button.
		`,
		requires: [UI_CONTROL.ROLL_BUTTON_HOLD]
	},
]
/*



	Now click on the INITIAL VELOCITY scale to set a starting velocity.
	Negative values correspond to motion to the left, positive values to the right.


	Click and drag the top of a post to raise or lower it, or simply click above or below to adjust its height.

	Try adjusting the left-most post one more time.

	Click ROLL BALL to see the graph for your trial motion.

	You may view the animation in short segments by pressing and holding down the ROLL BALL button.

	The position of the ball, x is measured from left to right. Ramp inclination have been exaggerated for clarity.
		                                                                                                       Next
*/
