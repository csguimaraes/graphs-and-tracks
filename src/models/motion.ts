import * as _ from 'lodash'

enum DATA_TYPE {
	POSITION,
	VELOCITY,
	HEIGHT
}

export const DATA_DOMAINS = {
	POSITION: { step: 50, limits: [0, 500] },
	VELOCITY: { step: 10, limits: [-60, 60] },
	HEIGHT: { step: 1, limits: [0, 10] }
}

export interface MotionData {
	position: number
	velocity: number
	heights: number[]
}

export class Motion {
	data: MotionData

	constructor(inputData: MotionData) {
		this.data.position = this.validate(inputData.position, DATA_TYPE.POSITION)
		this.data.velocity = this.validate(inputData.velocity, DATA_TYPE.VELOCITY)
		this.data.heights = inputData.heights.map(function (height) {
			return this.validate(height, DATA_TYPE.HEIGHT)
		})
	}

	validate(value: any, type: DATA_TYPE) {
		let limits = DATA_DOMAINS[type].limits
		let step = DATA_DOMAINS[type].step

		// Check if value isn't off limits
		if (_.inRange(value, limits[0], limits[1])) {
			// Round value to nearest valid step
			return Math.round(value / step) * step
		} else {
			throw 'Value should be in range ' + limits.join(', ')
		}
	}
}
