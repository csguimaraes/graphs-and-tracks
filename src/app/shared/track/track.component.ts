import { Component, OnInit, ElementRef, HostListener, AfterViewInit, Input } from '@angular/core'

import { MotionSetup, ChallengeMode, Ball, Margin, Point } from '../types'
import { Angle } from '../helpers'

declare let d3

@Component({
	selector: 'gt-track',
	templateUrl: './track.component.html',
	styleUrls: ['./track.component.scss']
})
export class TrackComponent implements OnInit, AfterViewInit {
	@Input() setup: MotionSetup
	@Input() mode: ChallengeMode


	aux: any // TODO remove

	// TODO: get from THEME settings
	trackWidth = 5
	ball: Ball = {
		radius: 6 + 4,
		rotation: 0,
		cx: 50,
		cy: 50
	}

	margin: Margin = {
		left: 20,
		top: 20,
		right: 20,
		bottom: 20
	}


	host: HTMLElement
	svg: any
	trackGroup: any

	scaleX: any
	scaleY: any

	rampSize: number

	constructor(elementRef: ElementRef) {
		this.host = elementRef.nativeElement
	}

	ngOnInit() {
		let trackSize = this.mode.domain.position.max - this.mode.domain.position.min
		this.rampSize = trackSize / (this.mode.postsCount - 1)

		this.svg = d3.select(this.host.querySelector('svg'))
		this.trackGroup = this.svg.select('g')
		this.ball.element = this.svg.select('circle')
	}

	ngAfterViewInit() {
		this.refresh()
	}

	@HostListener('window:resize')
	onResize(ev) {
		this.refresh()
	}

	refresh() {
		this.updateBounds()
		this.drawTrackLine(this.setup.posts)
		this.updateBallPostion(this.setup.position)
	}

	updateBounds() {
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
		let offset = this.ball.radius + 2.5

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
		let offsetAngle: Angle

		let isOverDeadZone = false // TODO

		if (isOverDeadZone) {
			// TODO
		} else if (isOverPost) {
			y = posts[postIndex]
			if (isOverEdge) {
				offsetAngle = this.getRampInclination(rampIndex, true)
			} else {
			// TODO remove debug
				let deadZone = this.getDeadZoneOverPost(rampIndex)
				offsetAngle = deadZone.normal
				offset += deadZone.offset
			}
		} else {
			// The ball is between two posts
			y = left + (rampSlope * rampPositionRatio)
			offsetAngle = this.getRampInclination(rampIndex, true)
		}

		let cx = this.scaleX(x)
		let cy = this.scaleY(y)
		// TODO remove aux debug
		if (this.aux) {
			this.aux.remove()
		}

		this.aux = this.trackGroup.append('circle')
			.attr('r', 2)
			.attr('fill', 'red')
			.attr('cx', cx)
			.attr('cy', cy)

		if (offsetAngle) {
			cx = cx + (offset * Math.cos(offsetAngle.rad))
			cy = cy + (offset * Math.sin(offsetAngle.rad))
		} else {
			cy = cy - offset
		}

		this.ball.cx = cx
		this.ball.cy = cy
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

	getDeadZoneOverPost(postIndex: number): {offset: number, normal: Angle} {
		let vertex = this.getPostHead(postIndex)
		let firstSide = this.getPostHead(postIndex - 1)
		let lastSide = this.getPostHead(postIndex + 1)

		let innerAngle = Angle.betweenVectors(vertex, firstSide, lastSide)
		console.log('innerAngle is ', innerAngle.deg)

		let rampInclination = this.getRampInclination(postIndex)
		let normalAngle = Angle.fromRad(rampInclination.rad - (innerAngle.rad / 2))
		console.log('normalAngle is ', normalAngle.deg)

		// Distance between ball center and vertex
		let offset = this.ball.radius + (this.trackWidth / 2)
		let ballDistance = (offset / Math.sin(innerAngle.rad / 2)) - offset
		console.log('ballDistance is ', ballDistance)

		return {
			offset: ballDistance,
			normal: normalAngle
		}
	}

	calculateDeadZones() {
		let posts = this.setup.posts

		// Iterate between posts skiping posts on edges
		for (let idx = 1; idx < (posts.length - 1); idx++) {

		}
	}
}
