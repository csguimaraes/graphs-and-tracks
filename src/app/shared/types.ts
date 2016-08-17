export interface ChallengeMode {
	simulation: {
		duration: number
		precision: number
	}

	domain: {
		position: DataDomain
		velocity: DataDomain
		posts: DataDomain
	}

	postsCount: number
}

export interface Challenge {
	id: string
	name: string
	custom: boolean
	goal: MotionSetup,
	// TODO mark as required
	mode?: ChallengeMode
}

export interface ChallengeStats {
	challengeId: string
	complete: boolean
	attempts: Attempt[]
}

export interface Attempt {
	time: string
	accuracy: number
	setup: MotionSetup
}


export interface MotionData {
	t: number
	s: number
	v: number
	a: number
}

export interface MotionSetup {
	velocity: number
	position: number
	posts: number[]
}

export interface DataDomain {
	min: number
	max: number
	step: number
}

export interface Ramp {
	number: number
	left: number
	right: number
	slope: number
	acceleration: number
	speed?: number
}

export interface Junction {
	speed: number
	height: number
	position: number
}

export interface Margin {
	top: number
	bottom: number
	left: number
	right: number
}

export interface Dimensions {
	x: number
	y: number
	width: number
	height: number
}

export interface Point {
	x: number
	y: number
}

export interface Ball {
	element?: SVGCircleElement
	radius: number
	rotation: number
	cx: number
	cy: number
}
