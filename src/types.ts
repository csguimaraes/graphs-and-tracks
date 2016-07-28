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

export interface MotionSetupData {
	velocity: number
	position: number
	posts: number[]
}

export interface Challenge {
	id: string
	name: string
	custom: boolean
	goal: MotionSetupData
}

export interface ChallengeStats {
	challengeId: string
	complete: boolean
	attempts: Attempt[]
}

export interface Attempt {
	time: string
	accuracy: number
	motion: MotionSetupData
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

export interface MotionData {
	t: number[]
	x: number[]
	v: number[]
	a: number[]
}

export interface MotionSetup {
	velocity: number
	position: number
	posts: number[]
}
