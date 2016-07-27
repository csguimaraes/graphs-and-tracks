export interface TrackSetupData {
	velocity: number
	position: number
	posts: number[]
}

export interface Challenge {
	id: string
	name: string
	custom: boolean
	track: TrackSetupData
}

export interface ChallengeStats {
	challengeId: string
	complete: boolean
	attempts: Attempt[]
}

export interface Attempt {
	time: string
	accuracy: number
	track: TrackSetupData
}

export interface DataDomain {
	min: number
	max: number
	step: number
	count?: number
}
