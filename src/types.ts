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
	count?: number
}
