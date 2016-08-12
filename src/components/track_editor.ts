import { Component, OnInit, Input, EventEmitter, Output, ElementRef, AfterViewInit} from '@angular/core'
import { MotionSetup, ChallengeMode, MotionData } from '../types'
import * as _ from 'lodash'
import * as Hammer from 'hammerjs'

declare let d3
type coord = {x: number, y: number}

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

	getBallPosition: (position: number, radiusX: number, radiusY: number) => coord
	redrawTrackAndPosts: (posts: number[]) => void
	drawTrackOutline: (posts: number[]) => void
	updateBall: (newPosition: number) => void

	element: any
	host: any
	svg: any

	positionScale: number[]
	velocityScale: number[]
	postsScale: number[]

	gestureHandlers: HammerManager[]

	rolling = false

	// Should include ball radius and stroke width
	ballRadius = 10 + 4
	ballRotation = 0
	ballPosition: coord

	constructor(private elementRef: ElementRef) {
		this.gestureHandlers = []
		this.rollBallEvent = new EventEmitter<MotionSetup>()
	}

	ngOnInit() {
		let h = this.mode.domain.posts
		let p = this.mode.domain.position
		let v = this.mode.domain.velocity

		this.postsScale = []
		this.velocityScale = []
		this.positionScale = []

		for (let value = h.min; value <= h.max; value += h.step) {
			this.postsScale.push(value)
		}

		for (let value = p.min; value <= p.max; value += p.step) {
			this.positionScale.push(value)
		}

		for (let value = v.min; value <= v.max; value += v.step) {
			this.velocityScale.push(value)
		}

		let midPos = Math.ceil(this.positionScale.length / 2) - 1
		let midVel = Math.ceil(this.velocityScale.length / 2) - 1
		this.setup = {
			position: this.positionScale[midPos],
			velocity: this.velocityScale[midVel],
			posts: new Array(this.mode.postsCount).fill(0)
		}
	}

	ngAfterViewInit() {
		this.element = this.elementRef.nativeElement.querySelector('#track')
		this.host = d3.select(this.element)

		setTimeout(() => {
			this.refresh()
		}, 50)

		this.buildSlider('#position-controls .slider', this.positionScale, this.positionSetter)
		this.buildSlider('#velocity-controls .slider', this.velocityScale, this.velocitySetter)
	}

	buildSlider(
		targets: any,
		scale: number[],
		callback: (number, any?) => void,
		horizontal = true,
		sliderContainer?: any,
		callbackEnd?: (number, any?) => void,
		disposable = false
	) {
		let sliderStart
		let sliderTickSize
		let updateBoundary: (event?: HammerInput) => void

		if (typeof targets === 'string') {
			targets = this.elementRef.nativeElement.querySelector(targets)
		}

		if (sliderContainer instanceof Array) {
			updateBoundary = (ev) => {}
			sliderStart = sliderContainer[0]

			let sliderSize = sliderContainer[1] - sliderContainer[0]
			sliderTickSize = sliderSize / scale.length

		} else {
			sliderContainer = sliderContainer || targets
			updateBoundary = (event?: HammerInput) => {
				// Update slider boundary everytime a drag starts
				let sliderBoundary = sliderContainer.getBoundingClientRect()
				sliderStart = horizontal ? sliderBoundary.left : sliderBoundary.top

				let sliderSize = horizontal ? sliderBoundary.width : sliderBoundary.height
				sliderTickSize = sliderSize / scale.length
			}

			updateBoundary()
		}

		if (!(targets instanceof Array)) {
			targets = [targets]
		}

		for (let target of targets) {
			let gestureHandler = new Hammer.Manager(target, {
				recognizers: [
					[Hammer.Tap],
					[Hammer.Pan, {
						direction: horizontal ? Hammer.DIRECTION_HORIZONTAL : Hammer.DIRECTION_VERTICAL
					}]
				]
			})

			gestureHandler.on('panstart', updateBoundary)

			let eventTypes = horizontal ? 'panleft panright' : 'panup pandown'
			gestureHandler.on(`tap ${eventTypes}`, (event: HammerInput) => {
				let dragPosition = (horizontal ? event.center.x : event.center.y) - sliderStart
				let scaleIndex = Math.floor(dragPosition / sliderTickSize)
				scaleIndex = Math.max(0, Math.min(scaleIndex, scale.length - 1))
				callback(scale[scaleIndex], target)
			})


			if (callbackEnd) {
				gestureHandler.on('panend', (event: HammerInput) => {
					let dragPosition = (horizontal ? event.center.x : event.center.y) - sliderStart
					let scaleIndex = Math.floor(dragPosition / sliderTickSize)
					scaleIndex = Math.max(0, Math.min(scaleIndex, scale.length - 1))
					callbackEnd(scale[scaleIndex], target)
				})
			}

			if (disposable) {
				this.gestureHandlers.push(gestureHandler)
			}
		}
	}

	disposeGestureHandlers() {
		for (let handler of this.gestureHandlers) {
			handler.destroy()
		}
		this.gestureHandlers = []
	}

	rollBall() {
		this.rollBallEvent.emit(_.cloneDeep(this.setup))
	}

	refresh() {
		this.host.html('')
		this.disposeGestureHandlers()

		let trackLineWidth = 10 + 5
		let ballRealRadius = this.ballRadius
		let ballTrackDistance = trackLineWidth / 2
		let ballMargin = (ballRealRadius  * 2) + ballTrackDistance

		let domain = this.mode.domain
		let trackSize = domain.position.max - domain.position.min
		let rampSize = trackSize / (this.mode.postsCount - 1)
		let posts = this.setup.posts.slice()

		let margin = { top: ballMargin + 10, right: ballMargin, bottom: 0, left: ballMargin }
		let width = this.element.clientWidth - margin.left - margin.right
		let height = this.element.clientHeight - margin.top - margin.bottom

		let svg = this.svg = this.host.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`)

		let scaleX = d3.scaleLinear()
			.range([0, width])
			.domain([domain.position.min, domain.position.max])


		let scaleY = d3.scaleLinear()
			.range([height, 0])
			// Substract 1 of the min value so we have space to draw the post bases
			.domain([domain.posts.min - 1, domain.posts.max])

		let trackLine = d3.line()
			.y(val => scaleY(val))
			.x((val, idx) => {
				let x = scaleX(idx * rampSize)

				if (val === 0) {
					// This is needed to cover the post draggers entirelly
					// when a track edge is "on the ground"
					if (idx === 0) {
						x -= (trackLineWidth / 2)
					} else if (idx === posts.length - 1) {
						x += (trackLineWidth / 2)
					}
				}

				return x
			})


		this.drawTrackOutline = (postsToDraw?: number[]) => {
			svg.selectAll('.track-outline').remove()
			if (postsToDraw) {
				svg.append('path')
					.data([postsToDraw])
					.attr('class', 'track-outline')
					.attr('d', trackLine)
			}
		}

		// The ball radius is defined whithout scaling into the data dimensions
		// We invert the scale to know the proportional radius value in X and Y data domains
		let ballRadiusX = scaleX.invert(ballRealRadius + ballTrackDistance)
		let ballRadiusY = scaleY.invert(ballRealRadius + ballTrackDistance)

		// Y scale is upside down, so the actual radius is the returned offset
		ballRadiusY = Math.max(...scaleY.domain()) - ballRadiusY

		// We define this function here because we can capture all the calculation contexts
		// This function will be used afterwards for animating the ball using the latest track setup
		this.getBallPosition = (position: number, radiusX: number, radiusY: number) => {
			// Find the index of the left hand post
			let positionRatio = position / rampSize
			let postIndex = Math.floor(positionRatio)

			// Check if ball is exactly above one post
			if (position % rampSize === 0) {
				return {
					x: position,
					y: posts[postIndex] + radiusY
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
			let finalX = position + (radiusX * Math.cos(normalAngle))
			let finalY = initialHeight + (radiusY * Math.sin(normalAngle))

			return {
				x: finalX,
				y: finalY
			}
		}

		// We define this function here because we can capture all the calculation contexts
		// This function will be used afterwards to update the track line and posts
		this.redrawTrackAndPosts = (postsToDraw: number[]) => {
			svg.selectAll('.track-line').remove()
			svg.selectAll('.post-dragger').remove()

			// Append track line
			svg.append('path')
				.data([postsToDraw])
				.attr('class', 'track-line')
				.attr('d', trackLine)

			// Append post bases
			svg.selectAll('dot')
				.data(postsToDraw)
				.enter().append('path')
				.attr('d', d3.symbol().type(d3.symbolWye).size(200))
				.attr('class', 'post-base')
				.attr('transform', (val, idx) => `translate(${scaleX(idx * rampSize)}, ${scaleY(0) + (trackLineWidth / 2)}) rotate(180, 0, 0)`)

			// Append post draggers
			let draggerWidth = trackLineWidth
			let draggers = svg.selectAll('dot')
				.data(postsToDraw)
				.enter().append('rect')
				.attr('data-post-index', (val, idx) => idx.toString())
				.attr('class', 'post-dragger')
				.attr('x', (val, idx) => scaleX(idx * rampSize) - (draggerWidth / 2))
				.attr('y', (val, idx) => scaleY(val))
				.attr('width', (val, idx) => draggerWidth)
				.attr('height', (val, idx) => scaleY(0) - scaleY(val) + (draggerWidth / 2))

			// Add gesture recognizers to draggers
			let svgPosition = this.svg.node().parentElement.getBoundingClientRect()
			let postSliderRange = [
				svgPosition.top + margin.top + scaleY(domain.posts.max) + trackLineWidth,
				svgPosition.top + margin.top + scaleY(domain.posts.min) + trackLineWidth
			]

			this.buildSlider(draggers.nodes(), this.postsScale, (value, draggerEl) => {
				// Y axis is upside down so we need to calculate the value offset here
				value = domain.posts.max - value
				let postsPreview = this.setup.posts.slice()
				let postIndex = parseInt(draggerEl.getAttribute('data-post-index'), 10)

				postsPreview[postIndex] = value
				this.drawTrackOutline(postsPreview)
			}, false, postSliderRange, (value, draggerEl) => {
				// Y axis is upside down so we need to calculate the value offset here
				value = domain.posts.max - value


				// NOTE: not all browsers support data-* attributes yet
				let postIndex = parseInt(draggerEl.getAttribute('data-post-index'), 10)
				this.setup.posts[postIndex] = value
				this.refresh()
			}, true)

			// Append ball position placeholders
			let ballPlaceholders = svg.selectAll('dot')
				.data(this.positionScale)
				.enter().append('circle')
				.attr('data-position', (val) => val.toString())
				.attr('class', 'track-ball-placeholder')
				.attr('r', ballRealRadius)
				.attr('cx', (val) => {
					let ballPosition = this.getBallPosition(val, ballRadiusX, ballRadiusY)
					return scaleX(ballPosition.x)
				})
				.attr('cy', (val) => {
					let ballPosition = this.getBallPosition(val, ballRadiusX, ballRadiusY)
					return scaleY(ballPosition.y)
				})

			for (let placeholders of ballPlaceholders.nodes()) {
				placeholders.onclick = (ev) => {
					let newPosition = parseInt(ev.target.getAttribute('data-position'), 10)
					this.positionSetter(newPosition)
				}
			}
		}

		this.redrawTrackAndPosts(posts)

		this.ballPosition = this.getBallPosition(this.setup.position, ballRadiusX, ballRadiusY)
		let ball = svg.append('circle')
			.attr('cx', scaleX(this.ballPosition.x))
			.attr('cy', scaleY(this.ballPosition.y))
			.attr('r', ballRealRadius)
			.attr('class', 'track-ball')

		let ballPerimeter = Math.PI * 2 * this.ballRadius
		this.updateBall = (newPosition: number) => {
			// Calculate new ball position and update it
			let newBallPosition = this.getBallPosition(newPosition, ballRadiusX, ballRadiusY)
			ball
				.attr('cx', scaleX(newBallPosition.x))
				.attr('cy', scaleY(newBallPosition.y))

			// Calculate how much ball travelled and change its rotation
			// to give the impression that it is rolling proportionally to its speed
			let leftToRight = newBallPosition.x > this.ballPosition.x
			let distance = this.getDistance(newBallPosition, this.ballPosition)
			let newRotation = this.ballRotation + (distance * (leftToRight ? -1 : 1))

			let rotationRatio = newRotation / ballPerimeter
			if (rotationRatio > 1) {
				// Normalize new rotation if more than 360 degres
				newRotation = (rotationRatio - Math.floor(rotationRatio)) * ballPerimeter
			}

			ball.node().style.strokeDashoffset = `${newRotation}px`

			this.ballPosition = newBallPosition
			this.ballRotation = newRotation
		}

		this.buildSlider(ball.node(), this.positionScale, this.positionSetter, true, svg.node(), null, true)
	}

	onResize(ev) {
		this.refresh()
	}

	velocitySetter = (val: number) => {
		this.setup.velocity = val
	}

	positionSetter = (val: number) => {
		this.setup.position = val

		// Only redraw ball instead of rebuilding the whole track
		if (this.updateBall) {
			this.updateBall(val)
		}
	}

	animate(motion: MotionData[], duration: number) {
		this.rolling = true
		let start = Date.now()
		duration *= 1000
		// Ratio between real time and simulation time
		let timeRatio = (this.mode.simulation.duration * 1000) / duration

		// Index of which data point the animation is currently on
		// the index will be increased accordly with the amount of time elapsed
		let idx = 0
		let animationFrame = () => {
			let now = Date.now()
			let elapsedTime = now - start

			if (!(this.rolling) || elapsedTime > duration) {
				this.rolling = false
				return
			}

			// queue next animation frame
			requestAnimationFrame(animationFrame)

			let t = elapsedTime * timeRatio
			let currentTime, nextTime, found = false
			while (idx < (motion.length - 1)) {
				currentTime = motion[idx].t * 1000
				nextTime = motion[idx + 1].t * 1000
				if (currentTime <= t && t < nextTime) {
					// This index is surrounded by two data points that have our current animation time
					// som we can interpolate the current position value from them
					found = true
					break
				} else {
					idx++
				}
			}

			if (!found) {
				console.log('No more data points found, ending animation!')
				this.rolling = false
				return
			}

			let current = motion[idx]
			let next = motion[idx + 1]
			let position = this.interpolate(t, currentTime, nextTime, current.s, next.s)
			this.updateBall(position)
		}

		animationFrame()
	}

	private interpolate(current, start, end, startValue, endValue) {
		let offset = current - start
		let delta = end - start
		let ratio = offset / delta
		let valueDelta = endValue - startValue

		return startValue + (valueDelta * ratio)
	}

	private getDistance(a: coord, b: coord) {
		let deltaX = Math.pow(b.x - a.x, 2)
		let deltaY = Math.pow(b.y - a.y, 2)
		return Math.sqrt(deltaX + deltaY)
	}
}
