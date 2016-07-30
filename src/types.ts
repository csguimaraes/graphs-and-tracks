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
	goal: MotionSetup
}

export interface ChallengeStats {
	challengeId: string
	complete: boolean
	attempts: Attempt[]
}

export interface Attempt {
	time: string
	accuracy: number
	motion: MotionSetup
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
	start?: number
	end: number
	acceleration: number
}
