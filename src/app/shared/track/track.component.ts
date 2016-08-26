import { Component, OnInit, ElementRef, HostListener, AfterViewInit, Input } from '@angular/core'
import { Router } from '@angular/router'

import { ChallengeMode, Ball, Margin, Point, Dimensions, DeadZone } from '../types'
import { Angle, translate, getDistance } from '../helpers'

import { SliderDirective } from '../slider.directive'

declare let d3

@Component({
	selector: 'gt-track',
	templateUrl: './track.component.html',
	styleUrls: ['./track.component.scss'],
	directives: [
		SliderDirective
	]
})
export class TrackComponent implements OnInit, AfterViewInit {
	@Input()
	mode: ChallengeMode

	@Input()
	postsSetup: number[]
	posts: Dimensions[]

	@Input()
	position: number

	// TODO: get from THEME settings
	trackWidth = 10
	ball: Ball = {
		radius: 15,
		stroke: 3,
		rotation: 0,
		perimeter: Math.PI * 2 * 15,
		position: { x: 0, y: 0 }
	}

	margin: Margin = {
		left: 0,
		top: (this.ball.radius * 2) + (this.trackWidth / 2),
		right: 0,
		bottom: this.trackWidth * 2
	}

	host: HTMLElement
	svg: any
	trackGroup: any

	scaleX: any
	scaleY: any
	deadZones: DeadZone[]

	rampSize: number
	showHeights = true

	constructor(elementRef: ElementRef, public router: Router) {
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
		setTimeout(() => {
			this.refresh()
		}, 50)
	}

	@HostListener('window:resize')
	onResize(ev) {
		this.refresh()
	}

	refresh() {
		this.recalculate()
		this.drawTrackLine(this.postsSetup)
		this.updateBallPostion(this.position)
	}

	updateBallPostion(positionX?: number) {
		if (positionX === undefined) {
			positionX = this.position
		}

		let x = positionX, y = 0
		let posts = this.postsSetup
		let offset = this.ball.radius + (this.trackWidth / 2)

		let trackPositionRatio = positionX / this.rampSize
		let postIndex = Math.floor(trackPositionRatio)
		let rampIndex = postIndex
		let rampPositionRatio = trackPositionRatio - rampIndex

		let isOverPost = positionX % this.rampSize === 0
		let isOverEdge = postIndex === 0
		if (postIndex === (posts.length - 1)) {
			isOverEdge = true
			rampIndex--
		}

		let left = posts[rampIndex], right = posts[rampIndex + 1]
		let rampSlope = right - left
		let offsetAngle: Angle, newPosition: Point

		let deadZone = this.getDeadZone(positionX, rampIndex)
		if (deadZone) {
			newPosition = deadZone.position
		} else {
			if (isOverPost) {
				y = posts[postIndex]
				if (isOverEdge) {
					offsetAngle = this.getRampInclination(rampIndex, true)
				}
			} else {
				// The ball is between two postsSetup
				y = left + (rampSlope * rampPositionRatio)
				offsetAngle = this.getRampInclination(rampIndex, true)
			}

			newPosition = {
				x: this.scaleX(x),
				y: this.scaleY(y)
			}

			if (offsetAngle) {
				newPosition = translate(newPosition, offsetAngle.rad, offset)
			} else {
				newPosition.y = newPosition.y - offset
			}
		}

		this.rotateBall(newPosition, this.ball.position)
		this.ball.position = newPosition
	}

	calculatePost(idx: number) {
		let width = this.trackWidth
		let head = this.getPostHead(idx)

		let x = head.x - (width / 2)
		let y = head.y - (this.trackWidth / 2)
		let height = this.scaleY(-1) - y

		return { x: x, y: y, width: width, height: height }
	}

	incrementPost(postIndex: number) {
		this.postsSetup[postIndex] = Math.min(this.mode.domain.posts.max, this.postsSetup[postIndex] + 1)
		this.refresh()

		if (this.postsSetup[postIndex] < this.mode.domain.posts.max) {
			this.previewTrackChange(postIndex, this.postsSetup[postIndex] + 1)
		}
	}

	decrementPost(postIndex: number) {
		this.postsSetup[postIndex] = Math.max(this.mode.domain.posts.min, this.postsSetup[postIndex] - 1)
		this.refresh()
	}

	setPostToMinimum(postIndex: number) {
		this.postsSetup[postIndex] = this.mode.domain.posts.min
		this.refresh()
	}

	previewTrackChange(postIndex: number, value: number) {
		let posts = this.postsSetup.slice()
		posts[postIndex] = value

		this.drawTrackLine(posts, true)
	}

	clearPreview() {
		this.trackGroup.select(`.track-outline`).attr('d', '')
	}

	onPostDrag(position: number, postIndex: number, commit = false) {
		position = 1 - position
		let domain = this.mode.domain.posts
		let range = domain.max - domain.min
		let value = Math.round((range * position) / domain.step) * domain.step

		if (commit) {
			this.postsSetup[postIndex] = value
			this.refresh()
		} else {
			let posts = this.postsSetup.slice()
			posts[postIndex] = value
			this.drawTrackLine(posts, true)
		}
	}

	private recalculate() {
		let rect = this.host.getBoundingClientRect()
		let domain = this.mode.domain
		let pos = this.mode.domain.position

		let scaleMargin = 15 + 5
		let scaleTickSize = (rect.width - scaleMargin) / ((pos.max / pos.step) + 1)
		let trackMargin = scaleMargin + (scaleTickSize / 2)
		this.margin.left = trackMargin
		this.margin.right = trackMargin

		this.svg.attr('width', rect.width).attr('height', rect.height)
		this.trackGroup.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)


		let domainWidth = rect.width - this.margin.left - this.margin.right
		let domainHeight = rect.height - this.margin.top - this.margin.bottom

		this.scaleX = d3.scaleLinear()
			.range([0, domainWidth])
			.domain([pos.min, pos.max])

		this.scaleY = d3.scaleLinear()
			.range([domainHeight, 0])
			// Substract 1 of the min value so we have space to draw the post bases
			.domain([domain.posts.min - 1, domain.posts.max])

		this.posts = []
		for (let idx = 0; idx < this.postsSetup.length; idx++) {
			this.posts.push(this.calculatePost(idx))
		}

		this.updateDeadZones()
	}

	private drawTrackLine(posts: number[], outline = false) {
		posts = posts.slice()
		posts.unshift(posts[0])
		posts.push(posts[posts.length - 1])

		let lineClass = outline ? 'track-outline' : 'track-line'
		let lineShape = d3.line()
			.x((val, idx) => {
				if (idx === posts.length - 1) {
					idx -= 2
				} else if (idx !== 0) {
					idx--
				}

				return this.scaleX(idx * this.rampSize)
			})
			.y((val, idx) => {
				if (idx === 0 || idx === posts.length - 1) {
					return this.scaleY(-1)
				}

				return this.scaleY(val)
			})

		if (!outline) {
			this.trackGroup.select(`.track-outline`).attr('d', '')
		}

		this.trackGroup.select(`.${lineClass}`)
			.datum(posts)
			.attr('d', lineShape)
	}

	private rotateBall(currentPosition: Point, previousPosition: Point) {
		// --------
		// Calculate how much ball travelled and change its rotation
		// to give the impression that it is rolling proportionally to its speed
		let leftToRight = currentPosition.x > previousPosition.x

		let distance = getDistance(previousPosition, currentPosition)
		let rotation = this.ball.rotation + (distance * (leftToRight ? -1 : 1))

		let rotationRatio = rotation / this.ball.perimeter
		if (rotationRatio > 1) { // TODO: negative values?
			// Normalize new rotation if its more than 360 degres
			rotation = (rotationRatio - Math.floor(rotationRatio)) * this.ball.perimeter
		}

		this.ball.element.style.strokeDashoffset = `${rotation}px`
		this.ball.rotation = rotation
	}

	private getPostHead(postIndex): Point {
		let val = this.postsSetup[postIndex]
		return {
			x: this.scaleX(postIndex * this.rampSize),
			y: this.scaleY(val)
		}
	}

	private getRampInclination(rampIndex: number, normal = false): Angle {
		let rampVertex = this.getPostHead(rampIndex)
		let rampEnd = this.getPostHead(rampIndex + 1)

		let result = Angle.fromVector(rampVertex, rampEnd)
		if (normal) {
			let normalAngle = result.rad - Angle.fromDeg(90).rad
			result = Angle.fromRad(normalAngle)
		}

		return result
	}

	private getDeadZone(position: number, rampIndex: number) {
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

	private updateDeadZones() {
		let posts = this.postsSetup
		this.deadZones = []

		// Iterate between postsSetup skiping postsSetup on edges
		for (let idx = 1; idx < (posts.length - 1); idx++) {
			let deadZone = this.calculateDeadZone(idx)
			this.deadZones.push(deadZone)
		}

		// Set null dead zones for edges
		this.deadZones.unshift(null)
		this.deadZones.push(null)
	}

	private calculateDeadZone(postIndex: number): DeadZone {
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
