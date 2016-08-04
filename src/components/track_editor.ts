import { Component, OnInit, Input, EventEmitter, Output, ElementRef, AfterViewInit} from '@angular/core'
import { MotionSetup, ChallengeMode } from '../types'
import * as _ from 'lodash'

declare let d3

@Component({
	selector: 'track-editor',
	host: { '(window:resize)': 'onResize($event)' },
	templateUrl: '../templates/track_editor.html',
	styleUrls: ['../styles/track_editor.scss']
})
export class TrackEditorComponent implements OnInit, AfterViewInit {
	@Input()
	mode: ChallengeMode

	@Output('roll')
	rollBallEvent: EventEmitter<MotionSetup>

	setup: MotionSetup

	ballPosition: (position: number, radiusX: number, radiusY: number) => any // { x: number, y: number }

	element: any
	host: any

	constructor(private elementRef: ElementRef) {
		this.rollBallEvent = new EventEmitter<MotionSetup>()
	}

	ngOnInit() {
		this.setup = {
			position: this.mode.domain.position.min,
			velocity: this.mode.domain.velocity.min,
			posts: new Array(this.mode.postsCount).fill(0)
		}

		this.setup = {
			position: 250,
			velocity: 0,
			posts: [2, 4, 4, 4, 4, 2]
		}
	}

	ngAfterViewInit() {
		this.element = this.elementRef.nativeElement.querySelector('#track')
		this.host = d3.select(this.element)

		setTimeout(() => {
			this.refresh()
		}, 50)

	}

	rollBall() {
		this.rollBallEvent.emit(_.cloneDeep(this.setup))
	}

	refresh() {
		this.host.html('')

		let ballRealRadius = 10
		let ballTrackDistance = 1
		let ballMargin = ballRealRadius * 2

		let domain = this.mode.domain
		let trackSize = domain.position.max - domain.position.min
		let rampSize = trackSize / (this.mode.postsCount - 1)
		let posts = this.setup.posts.slice()

		let margin = { top: ballMargin, right: ballMargin, bottom: 0, left: ballMargin }
		let width = this.element.clientWidth - margin.left - margin.right
		let height = this.element.clientHeight - margin.top - margin.bottom

		let svg = this.host.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`)

		let scaleX = d3.scaleLinear()
			.range([0, width])
			.domain([domain.position.min, domain.position.max])


		let scaleY = d3.scaleLinear()
			.range([height, 0])
			.domain([domain.posts.min - 1, domain.posts.max])

		let trackArea = d3.area()
			.y0(height)
			.y1(val => scaleY(val))
			.x((val, idx) => scaleX(idx * rampSize))

		svg.append('path')
			.data([posts])
			.attr('class', 'track-line')
			.attr('d', trackArea)

		// We define this function here because we can capture all the calculation contexts
		// This function will be used afterwards for animating the ball using the latest track setup
		this.ballPosition = (position: number, ballRadiusX: number, ballRadiusY: number) => {
			// Find the index of the left hand post
			let positionRatio = position / rampSize
			let postIndex = Math.floor(positionRatio)

			// Check if ball is exactly above one post
			if (position % rampSize === 0) {
				return {
					x: position,
					y: posts[postIndex] + ballRadiusY
				}
			}

			// Below we calculate the ball center when it is between two posts
			// It takes in consideration the angle of the current ramp

			positionRatio = positionRatio - postIndex
			let rampSlope = posts[postIndex + 1] - posts[postIndex]

			// This is the exact Y value where the ball touches the track
			let initialHeight = posts[postIndex] + (rampSlope * positionRatio)

			// Get ramp angle and its normal
			let rightAngle = 90 * (Math.PI / 180) * (rampSlope >= 0 ? 1 : -1)
			let rampDX = scaleX(rampSize * -1)
			let rampDY = scaleY(posts[postIndex]) - scaleY(posts[postIndex + 1])
			let rampAngle = Math.atan2(rampDX, rampDY) + rightAngle
			let normalAngle = rampAngle +  rightAngle

			// Translate the ball initial postion towards ramp's normal
			let finalX = position + (ballRadiusX * Math.cos(normalAngle))
			let finalY = initialHeight + (ballRadiusY * Math.sin(normalAngle))

			return {
				x: finalX,
				y: finalY
			}
		}

		let scaleYEnd = scaleY(Math.min(...scaleY.domain()))
		let scaleXEnd = scaleX(Math.max(...scaleX.domain()))

		// The ball radius is defined whithout scaling into the data dimensions
		// We invert the scale to know the proportional radius value in X and Y data domains
		let ballRadiusX = scaleX.invert(ballRealRadius + ballTrackDistance)
		let ballRadiusY = scaleY.invert(ballRealRadius + ballTrackDistance)

		// Y scale is upside down, so the actual radius is the returned offset
		ballRadiusY = Math.max(...scaleY.domain()) - ballRadiusY

		let ballPosition = this.ballPosition(this.setup.position, ballRadiusX, ballRadiusY)

		svg.append('circle')
			.attr('cx', scaleX(ballPosition.x))
			.attr('cy', scaleY(ballPosition.y))
			.attr('r', ballRealRadius)
			.attr('class', 'track-ball')

		let leftTrackSideY = scaleY(posts[0])
		let leftTrackSideHeigth = scaleYEnd - leftTrackSideY
		svg.append('rect')
			.attr('x', scaleX(0) - ballMargin)
			.attr('y', leftTrackSideY)
			.attr('width', ballMargin)
			.attr('height', leftTrackSideHeigth)
			.attr('class', 'track-side')

		let rightTrackSideY = scaleY(posts[posts.length - 1])
		let rightTrackSideHeigth = scaleYEnd - rightTrackSideY
		svg.append('rect')
			.attr('x', scaleXEnd)
			.attr('y', rightTrackSideY)
			.attr('width', ballMargin)
			.attr('height', rightTrackSideHeigth)
			.attr('class', 'track-side')
	}

	/**
	 * We need to use the array index as identity for detection change
	 * @param index
	 * @param value
	 * @returns {number}
	 * @see https://github.com/angular/angular/issues/10423
	 */
	trackByIndex(index: number, value: number) {
		return index
	}

	onResize(ev) {
		this.refresh()
	}
}
