import * as helpers from 'challenges'
import { Point } from 'challenges'

export class Angle {
	// Store in both formats to avoid conversions and value fluctuation
	private _rad: number
	get rad() { return this._rad }

	private _deg: number
	get deg() { return this._deg }


	static fromDeg(deg: number) {
		return new this((deg / 180) * Math.PI, deg)
	}

	static fromRad(rad: number) {
		return new this(rad, (rad * 180) / Math.PI)
	}

	static fromVector(a: Point, b: Point) {
		let vector = helpers.getVector(a, b)
		let rad = Math.atan2(vector.y, vector.x)
		return this.fromRad(rad)
	}

	static betweenVectors(vertex: Point, firstSideEnd: Point, lastSideEnd: Point) {
		let firstSide = helpers.getVector(vertex, firstSideEnd)
		let lastSide = helpers.getVector(vertex, lastSideEnd)
		let dotProduct = helpers.getDotProduct(firstSide, lastSide)
		let determinant = helpers.getDeterminant(firstSide, lastSide)
		let rad = Math.atan2(determinant, dotProduct)
		return this.fromRad(rad)
	}

	private constructor(rad: number, deg: number) {
		this._rad = rad
		this._deg = deg
	}
}
