import { Injectable } from '@angular/core'

import { MotionSetup } from '../models/motion_setup'

@Injectable()
export class EngineService {
	// TODO get engine params from settings
	interval = 1

	// TODO the duration will be fixed or dynamic?
	duration = 10
	positionRange = 500

	constructor() { }

	calculateMotion(setup: MotionSetup): any {
		let accelerations = this.calculateAccelerations(setup.posts)

		let x = setup.position
		let v = setup.velocity

		let firstRamp = this.getRampForPosition(x, setup.posts.length)
		let a = accelerations[firstRamp]

		// Initialize data series with values for T=0
		let data = {
			t: [0],
			x: [x],
			v: [v],
			a: [a]
		}


		console.info('Initial data points:', data)

		let dt = this.interval
		for (let t = dt; t <= this.duration; t += dt) {
			data.t.push(t)

			// TODO what happens when the ball go outside the track?
			x = x + (v * dt) + ((Math.pow(dt, 2) * a) / 2)
			data.x.push(x)

			v = v + (a * dt)
			data.v.push(v)

			// Even when the ball move to another ramp
			// We only use the new acceleration value in the next iteration
			let currentRamp = this.getRampForPosition(x, setup.posts.length)
			a = accelerations[currentRamp]
			data.a.push(a)
		}

		console.log(data)
		return data
	}

	private calculateAccelerations(posts: number[]): number[] {
		let accelerations = []
		for (let n = 1; n < posts.length; n++) {
			accelerations.push(posts[n - 1] - posts[n])
		}

		console.info('posts', posts)
		console.info('accelerations', accelerations)

		return accelerations
	}

	/**
	 * @param position
	 * @param numberOfPosts
	 * @returns {number}
	 * @deprecated calculate accelerations in a way that is possible to retrieve the value from the current position
	 */
	private getRampForPosition(position: number, numberOfPosts: number): number {
		if (position === this.positionRange) {
			return numberOfPosts - 1
		} else {
			let rampSize = this.positionRange / (numberOfPosts - 1)
			return Math.floor(position / rampSize)
		}
	}
}
