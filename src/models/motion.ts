import * as Settings from '../settings'
import * as Types from '../types'

export class Motion {
	mode: Types.ChallengeMode

	initialPosition: number
	initialVelocity: number
	posts: number[]

	private ramps: Types.Ramp[]
	private data: Types.MotionData

	// TODO: Round value to nearest valid step
	// value = Math.round(value / domain.step) * domain.step

	constructor(position: number, velocity: number, posts: number[], mode?: Types.ChallengeMode) {
		// For now only NORMAL mode is available
		this.mode = mode || Settings.MODE_NORMAL

		// Calculate individual ramp size in the given mode
		let trackSize = this.mode.domain.position.max
		let postCount = this.mode.postsCount
		let rampSize =  trackSize / (postCount - 1)

		// Calculate ramp acceleration values
		this.ramps = []
		for (let n = 1; n < posts.length; n++) {
			this.ramps.push({
				end: rampSize * n,
				acceleration: posts[n - 1] - posts[n]
			})
		}

		// Store initial motion setup
		this.initialPosition = position
		this.initialVelocity = velocity
		this.posts = posts
	}

	execute() {
		// Initialize data series with values for T=0
		let x = this.initialPosition
		let v = this.initialVelocity
		let a = this.getAccelerationAt(x)
		this.commitData(0, x, v, a)


		let dt = 1 / this.mode.simulation.precision
		let tMax = this.mode.simulation.duration
		for (let t = dt; t <= tMax; t += dt) {
			// TODO: what happens when the ball go outside the track?
			x = x + (v * dt) + ((Math.pow(dt, 2) * a) / 2)

			v = v + (a * dt)

			// When the ball move to another ramp we plot the new acceleration value
			// however we'll only use the new value in the next iteration
			a = this.getAccelerationAt(x)

			this.commitData(t, x, v, a)
		}
	}

	getData(type: 't' | 'x' | 'v' | 'a') {
		return this.data[type].slice()
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

	private commitData(t: number, x: number, v: number, a: number) {
		if (t === 0 || this.data === undefined) {
			this.data = { t: [], x: [], v: [], a: [] }
		}

		this.data.t.push(t)
		this.data.x.push(x)
		this.data.v.push(v)
		this.data.a.push(a)
	}
}
