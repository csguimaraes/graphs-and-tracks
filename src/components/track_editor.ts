import { Component, OnInit, Input, EventEmitter, Output, ElementRef, AfterViewInit} from '@angular/core'
import { MotionSetup, ChallengeMode } from '../types'
import * as _ from 'lodash'

declare let d3

@Component({
	selector: 'track-editor',
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
			position: 350,
			velocity: 40,
			posts: [4, 2, 0, 0, 2, 4]
		}
	}

	ngAfterViewInit() {
		this.element = this.elementRef.nativeElement.querySelector('#track')
		this.host = d3.select(this.element)

		this.refresh()

	}

	rollBall() {
		this.rollBallEvent.emit(_.cloneDeep(this.setup))
	}

	refresh() {
		this.host.html('')

		let domain = this.mode.domain
		let trackSize = domain.position.max - domain.position.min
		let rampSize = trackSize / (this.mode.postsCount - 1)
		let posts = this.setup.posts.slice()

		let width = this.element.clientWidth
		let height = this.element.clientHeight


		let svg = this.host.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')

		let scaleX = d3.scaleLinear()
			.range([0, width])
			.domain([domain.position.min, domain.position.max])

		let scaleY = d3.scaleLinear()
			.range([height, 0])
			.domain([domain.posts.min - 1, domain.posts.max + 1])

		let data = this.setup.posts
		let line = d3.line()
			.x((val, idx) => { return scaleX(idx * rampSize) })
			.y((val, idx) => { return scaleY(val) })

		svg.append('path')
			.data([data])
			.attr('class', 'track-line')
			.attr('d', line)

		this.ballPosition = (position: number, radiusX: number, radiusY: number) => {
			// Find the index of the left hand post
			let positionRatio = position / rampSize
			let postIndex = Math.floor(positionRatio)

			if (position % rampSize) {
				// Ball is between two posts
				positionRatio = positionRatio - postIndex
				let slope = posts[postIndex + 1] - posts[postIndex]
				// This is the exact height of the track at the ball position
				let initialHeight = posts[postIndex] + (slope * positionRatio)

				// Get ramp angle and its normal
				let rampDX = scaleX(rampSize * -1)
				let rampDY = scaleY(posts[postIndex]) - scaleY(posts[postIndex + 1])
				let rampAngle = Math.atan2(rampDX, rampDY)
				let normalAngle = 180 * (Math.PI / 180)
				if (rampAngle >= 0) {
					normalAngle = rampAngle + normalAngle
				} else {
					normalAngle = rampAngle - normalAngle
				}

				// Translate the ball postion against ramp's normal
				let finalPosition = {
					x: position + (radiusX * Math.cos(normalAngle)),
					y: initialHeight + (radiusY * Math.sin(normalAngle)),
					initial: {
						x: position,
						y: initialHeight
					}
				}

				return finalPosition
			} else {
				// Ball is exactly above one post
				return {
					x: position,
					y: posts[postIndex] + radiusY
				}
			}
		}

		// This is the 'real' radius of the ball
		let trackStrokeWidth = 3
		let ballRealRadius = 10 + (trackStrokeWidth / 2)

		// To make the calculation with the radius in the abstract portion of dimensions
		// We need to use an abstract radius for each dimension
		let ballRealRadiusX = scaleX.invert(ballRealRadius)
		let ballRealRadiusY = scaleY.invert(ballRealRadius)
		// Y scale is upside down
		ballRealRadiusY = Math.max(...scaleY.domain()) - ballRealRadiusY

		let ballPosition = this.ballPosition(this.setup.position, ballRealRadiusX, ballRealRadiusY)

		svg.append('circle')
			.attr('cx', scaleX(ballPosition.x))
			.attr('cy', scaleY(ballPosition.y))
			.attr('r', ballRealRadius - (trackStrokeWidth / 2))

		/*if (ballPosition.initial) {
			svg.append('circle')
				.attr('cx', scaleX(ballPosition.initial.x))
				.attr('cy', scaleY(ballPosition.initial.y))
				.attr('r', ballRealRadius / 4)
				.attr('fill', 'red')

			svg.append('circle')
				.attr('cx', scaleX(ballPosition.x))
				.attr('cy', scaleY(ballPosition.y))
				.attr('r', ballRealRadius / 4)
				.attr('fill', 'green')
		}*/
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
}
