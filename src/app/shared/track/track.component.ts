import { Component, OnInit, ElementRef, HostListener, AfterViewInit, Input } from '@angular/core'

import { MotionSetup, ChallengeMode, Ball, Margin, Point } from '../types'
import { Angle, translate, getDistance } from '../helpers'

declare let d3
type DeadZone = { position: Point, start: number, end: number }

@Component({
	selector: 'gt-track',
	templateUrl: './track.component.html',
	styleUrls: ['./track.component.scss']
})
export class TrackComponent implements OnInit, AfterViewInit {
	@Input() setup: MotionSetup
	@Input() mode: ChallengeMode

	// TODO: get from THEME settings
	trackWidth = 5
	ball: Ball = {
		radius: 19,
		stroke: 4,
		rotation: 0,
		perimeter: Math.PI * 2 * 19,
		cx: 50,
		cy: 50
	}

	margin: Margin = {
		left: 20,
		top: this.ball.radius,
		right: 20,
		bottom: 20
	}


	host: HTMLElement
	svg: any
	trackGroup: any

	scaleX: any
	scaleY: any
	deadZones: DeadZone[]

	rampSize: number

	constructor(elementRef: ElementRef) {
		this.host = elementRef.nativeElement
	}

	ngOnInit() {
		let trackSize = this.mode.domain.position.max - this.mode.domain.position.min
		this.rampSize = trackSize / (this.mode.postsCount - 1)

		this.svg = d3.select(this.host.querySelector('svg'))
		this.trackGroup = this.svg.select('g')
		this.ball.element = this.svg.select('circle').node()
	}

	ngAfterViewInit() {
		this.refresh()
	}

	@HostListener('window:resize')
	onResize(ev) {
		this.refresh()
	}

	refresh() {
		this.recalculate()
		this.drawTrackLine(this.setup.posts)
		this.updateBallPostion(this.setup.position)
	}

	recalculate() {
		let rect = this.host.getBoundingClientRect()
		this.svg.attr('width', rect.width).attr('height', rect.height)
		this.trackGroup.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)

		let domain = this.mode.domain
		let domainWidth = rect.width - this.margin.left - this.margin.right
		let domainHeight = rect.height - this.margin.top - this.margin.bottom

		this.scaleX = d3.scaleLinear()
			.range([0, domainWidth])
			.domain([domain.position.min, domain.position.max])

		this.scaleY = d3.scaleLinear()
			.range([domainHeight, 0])
			// Substract 1 of the min value so we have space to draw the post bases
			.domain([domain.posts.min - 1, domain.posts.max])

		this.updateDeadZones()
	}

	drawTrackLine(posts: number[], outline = false) {
		let lineClass = outline ? 'track-outline' : 'track-line'
		let lineShape = d3.line()
			.x((val, idx) => this.scaleX(idx * this.rampSize))
			.y(val => this.scaleY(val))

		this.trackGroup.selectAll(`.${lineClass}`).remove()
		this.trackGroup
			.append('path')
			.datum(posts)
			.attr('class', lineClass)
			.attr('d', lineShape)
	}

	updateBallPostion(position: number) {
		let x = position, y = 0
		let posts = this.setup.posts
		let offset = this.ball.radius + (this.trackWidth / 2)

		let trackPositionRatio = position / this.rampSize
		let postIndex = Math.floor(trackPositionRatio)
		let rampIndex = postIndex
		let rampPositionRatio = trackPositionRatio - rampIndex

		let isOverPost = position % this.rampSize === 0
		let isOverEdge = postIndex === 0
		if (postIndex === (posts.length - 1)) {
			isOverEdge = true
			rampIndex--
		}

		let left = posts[rampIndex], right = posts[rampIndex + 1]
		let rampSlope = right - left
		let offsetAngle: Angle, center: Point

		let deadZone = this.getDeadZone(position, rampIndex)
		if (deadZone) {
			center = deadZone.position
		} else {
			if (isOverPost) {
				y = posts[postIndex]
				if (isOverEdge) {
					offsetAngle = this.getRampInclination(rampIndex, true)
				}
			} else {
				// The ball is between two posts
				y = left + (rampSlope * rampPositionRatio)
				offsetAngle = this.getRampInclination(rampIndex, true)
			}

			center = {
				x: this.scaleX(x),
				y: this.scaleY(y)
			}

			if (offsetAngle) {
				center = translate(center, offsetAngle.rad, offset)
			} else {
				center.y = center.y - offset
			}
		}

		let previousCenter = { x: this.ball.cx, y: this.ball.cy }
		this.ball.cx = center.x
		this.ball.cy = center.y

		// --------
		// Calculate how much ball travelled and change its rotation
		// to give the impression that it is rolling proportionally to its speed
		let leftToRight = center.x > previousCenter.x

		let distance = getDistance(previousCenter, center)
		let rotation = this.ball.rotation + (distance * (leftToRight ? -1 : 1))

		let rotationRatio = rotation / this.ball.perimeter
		if (rotationRatio > 1) {
			// Normalize new rotation if more than 360 degres
			rotation = (rotationRatio - Math.floor(rotationRatio)) * this.ball.perimeter
		}

		this.ball.element.style.strokeDashoffset = `${rotation}px`
		this.ball.rotation = rotation
	}

	getPostHead(postIndex): Point {
		let val = this.setup.posts[postIndex]
		return {
			x: this.scaleX(postIndex * this.rampSize),
			y: this.scaleY(val)
		}
	}

	getRampInclination(rampIndex: number, normal = false): Angle {
		let rampVertex = this.getPostHead(rampIndex)
		let rampEnd = this.getPostHead(rampIndex + 1)
		let slope = rampVertex.y - rampEnd.y
		if (slope === 0) {
			return null
		}

		let result = Angle.fromVector(rampVertex, rampEnd)
		if (normal) {
			let normalAngle = result.rad - Angle.fromDeg(90).rad
			result = Angle.fromRad(normalAngle)
		}

		return result
	}

	getDeadZone(position: number, rampIndex: number) {
		let dzLeft = this.deadZones[rampIndex]
		let dzRight = this.deadZones[rampIndex + 1]

		if (dzLeft && position <= dzLeft.end) {
			return dzLeft
		}

		if (dzRight && position >= dzRight.start) {
			return dzRight
		}

		return null
	}

	updateDeadZones() {
		let posts = this.setup.posts
		this.deadZones = []

		// Iterate between posts skiping posts on edges
		for (let idx = 1; idx < (posts.length - 1); idx++) {
			let deadZone = this.calculateDeadZone(idx)
			this.deadZones.push(deadZone)
		}

		// Set null dead zones for edges
		this.deadZones.unshift(null)
		this.deadZones.push(null)
	}

	calculateDeadZone(postIndex: number): DeadZone {
		let vertex = this.getPostHead(postIndex)
		let firstSide = this.getPostHead(postIndex - 1)
		let lastSide = this.getPostHead(postIndex + 1)

		let innerAngle = Angle.betweenVectors(vertex, firstSide, lastSide)

		if (innerAngle.rad <= 0) {
			return null
		}

		let rightRampInclination = this.getRampInclination(postIndex)
		let normalAngle = Angle.fromRad(rightRampInclination.rad - (innerAngle.rad / 2))

		// --------
		// Distance between ball center and vertex
		// @see http://math.stackexchange.com/questions/1064410
		let radius = this.ball.radius + (this.trackWidth / 2)
		let ballDistance = (radius / Math.sin(innerAngle.rad / 2)) - radius
		let offset = ballDistance + radius

		let ballPosition = translate(vertex, normalAngle.rad, offset)

		// --------
		// Get tangent points between ball and ramps
		// to determine were dead zone starts and ends

		let leftRampNormal = this.getRampInclination(postIndex - 1, true)
		let tangentPointLeft = translate(ballPosition, leftRampNormal.rad, radius * -1)

		let rightRampNormal = this.getRampInclination(postIndex, true)
		let tangentPointRight = translate(ballPosition, rightRampNormal.rad, radius * -1)

		return {
			position: ballPosition,
			start: this.scaleX.invert(tangentPointLeft.x),
			end: this.scaleX.invert(tangentPointRight.x)
		}
	}
}
