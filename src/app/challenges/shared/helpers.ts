import { Point } from './declarations'

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
