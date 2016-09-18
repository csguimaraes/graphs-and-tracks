import { Motion } from './motion.model'

export type DataType = 's' | 'v' | 'a' | 'p'

export enum CHALLENGE_TYPE {
	EXAMPLE,
	TUTORIAL,
	EXPLORATION,
	COMMUNITY,
	TEACHER
}

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
	mode?: ChallengeMode
	type: CHALLENGE_TYPE
}

export interface ChallengeStats {
	challengeId: string
	complete: boolean
	attempts: Attempt[]
}

export interface Attempt {
	accuracy: number
	setup: MotionSetup
	motion?: Motion
}

export interface AttemptError {
	type: DataType,
	position?: number
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
	posts: number[],
	breakDown?: boolean
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
	stroke: number
	rotation: number
	perimeter: number
	position: Point
}

export interface DeadZone {
	position: Point,
	start: number,
	end: number
}

export interface Hint {
	title: string,
	message: string
}

export interface User {
	id: string
	username: string
	avatarUrl: string
	settings: UserSettings
}

export interface UserSettings {
	effects: boolean
}
