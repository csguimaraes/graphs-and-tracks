import * as Settings from '../settings'
import * as Types from '../types'

/**
 * Class used to represent and manipulate motion setups
 */
export class MotionSetup {
	private _velocity: number
	private _position: number
	private _posts: number[]

	get velocity(): number { return this._velocity }

	get position(): number { return this._position }

	get posts(): number[] { return this._posts.slice() }

	set velocity(val: number) { this._velocity = this.clamp(val, Settings.VELOCITY_DOMAIN) }

	set position(val: number) { this._position = this.clamp(val, Settings.POSITION_DOMAIN) }

	setPost(postHeight, postPosition) {
		// TODO: position validation
		this._posts[postPosition] = this.clamp(postHeight, Settings.POSITION_DOMAIN)
	}

	constructor(inputData?: Types.MotionSetupData) {
		if (inputData) {
			// TODO validations
			if (inputData.posts.length !== Settings.POSTS_DOMAIN.count) {

			}
		} else {
			this._position = 0
			this._velocity = 0
			this._posts = [0, 0, 0, 0, 0, 0]
		}
	}

	clamp(value: number, domain: Types.DataDomain): number {
		console.log('received value', value)
		// Ensure value is on a valid range
		value = Math.max(domain.min, value)
		value = Math.min(domain.max, value)

		// Round value to nearest valid step
		value = Math.round(value / domain.step) * domain.step

		return value
	}
}
