import { Point } from './types'

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
		let vector = getVector(a, b)
		let rad = Math.atan2(vector.y, vector.x)
		return this.fromRad(rad)
	}

	static betweenVectors(vertex: Point, firstSideEnd: Point, lastSideEnd: Point) {
		let firstSide = getVector(vertex, firstSideEnd)
		let lastSide = getVector(vertex, lastSideEnd)
		let dotProduct = getDotProduct(firstSide, lastSide)
		let determinant = getDeterminant(firstSide, lastSide)
		let rad = Math.atan2(determinant, dotProduct)
		return this.fromRad(rad)
	}

	private constructor(rad: number, deg: number) {
		this._rad = rad
		this._deg = deg
	}
}

export function interpolate(current, start, end, startValue, endValue) {
	let offset = current - start
	let delta = end - start
	let ratio = offset / delta
	let valueDelta = endValue - startValue

	return startValue + (valueDelta * ratio)
}

export function getDistance(a: Point, b: Point) {
	let vector = getVector(a, b)
	return Math.sqrt((vector.x ** 2) + (vector.y ** 2))
}

export function getDotProduct(vectorA: Point, vectorB: Point) {
	return (vectorA.x * vectorB.x) + (vectorA.y * vectorB.y)
}

export function getDeterminant(vectorA: Point, vectorB: Point) {
	return (vectorA.x * vectorB.y) - (vectorA.y * vectorB.x)
}

export function getVector(a: Point, b: Point): Point {
	return { x: b.x - a.x, y: b.y - a.y }
}

export function translate(point: Point, angleRad: number, distance: number): Point {
	return {
		x: point.x + (distance * Math.cos(angleRad)),
		y: point.y + (distance * Math.sin(angleRad))
	}
}

export function getMultiple(value: number, multiple: number, round: 'up' | 'down' | 'near' = 'near'): number {
	let result, ratio = value / multiple

	switch (round) {
		case 'up':
			result = Math.ceil(ratio)
			break
		case 'down':
			result = Math.floor(ratio)
			break
		case 'near':
			result = Math.round(ratio)
			break
	}

	return  result * multiple
}
