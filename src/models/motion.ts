import * as Settings from '../settings'
import * as Types from '../types'

export class Motion {
	mode: Types.ChallengeMode

	initialPosition: number
	initialVelocity: number
	posts: number[]

	private ramps: Types.Ramp[]
	private _data: Types.MotionData[]

	get data() {
		if (this._data === undefined) {
			this.execute()
		}

		return this._data.slice()
	}

	// TODO: Round value to nearest valid step
	// value = Math.round(value / domain.step) * domain.step

	static fromSetup(setup: Types.MotionSetup, mode?: Types.ChallengeMode) {
		// TODO: fetch challenge mode
		return new this(setup.position, setup.velocity, setup.posts, mode)
	}

	constructor(position: number, velocity: number, posts: number[], mode?: Types.ChallengeMode) {
		// For now only NORMAL mode is available
		this.mode = mode || Settings.MODE_NORMAL

		// Calculate individual ramp size in the given mode
		let trackSize = this.mode.domain.position.max
		let postCount = this.mode.postsCount
		let rampSize = trackSize / (postCount - 1)

		// Calculate ramp acceleration values
		this.ramps = []
		for (let n = 1; n < posts.length; n++) {
			this.ramps.push({
				end: rampSize * n,
				acceleration: (posts[n - 1] - posts[n]) * 10
			})
		}

		// Store initial motion setup
		this.initialPosition = position
		this.initialVelocity = velocity
		this.posts = posts
	}

	execute() {
		// Initialize data series with values for T=0
		let s = this.initialPosition
		let v = this.initialVelocity
		let a = this.getAccelerationAt(s)
		this.commitData(0, s, v, a)


		let dt = 1 / this.mode.simulation.precision
		let tMax = this.mode.simulation.duration
		let sDomain = this.mode.domain.position

		for (let t = dt; t <= tMax; t += dt) {
			s = s + (v * dt) + ((Math.pow(dt, 2) * a) / 2)

			v = v + (a * dt)

			// When the ball move to another ramp we plot the new acceleration value
			// however we'll only use the new value in the next iteration
			a = this.getAccelerationAt(s)

			this.commitData(t, s, v, a)

			// Check if ball fell off the track
			if (s > sDomain.max || s < sDomain.min) {
				// TODO: normalize position
				break
			}
		}
	}



	private getAccelerationAt(position: number): number {
		let acceleration

		for (let ramp of this.ramps) {
			acceleration = ramp.acceleration
			if (ramp.end > position) {
				break
			}
		}

		return acceleration
	}

	private commitData(t: number, s: number, v: number, a: number) {
		if (t === 0 || this._data === undefined) {
			this._data = []
		}

		this._data.push({ t: t, s: s, v: v, a: a })
	}
}

