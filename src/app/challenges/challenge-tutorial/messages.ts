import { TutorialStep, UI_CONTROL } from 'challenges'

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
		triggers: [UI_CONTROL.POSITION_GRAPH, UI_CONTROL.TUTORIAL_NEXT]
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
