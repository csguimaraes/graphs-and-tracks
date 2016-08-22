import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core'
import { MotionSetup, ChallengeMode, MotionData, DataType } from '../types'

import * as _ from 'lodash'
import * as Hammer from 'hammerjs'

import * as Settings from '../settings'
import { interpolate } from '../helpers'
import { ScaleComponent } from '../scale/scale.component'
import { TrackComponent } from '../track/track.component'

@Component({
	selector: 'gt-track-panel',
	templateUrl: './track-panel.component.html',
	styleUrls: ['./track-panel.component.scss'],
	directives: [
		ScaleComponent,
		TrackComponent
	]
})
export class TrackPanelComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild(TrackComponent)
	track: TrackComponent

	@Input()
	mode: ChallengeMode

	@Output('roll')
	rollBallEvent: EventEmitter<MotionSetup>

	@Output()
	change: EventEmitter<DataType> = new EventEmitter<DataType>()

	setup: MotionSetup

	rollButton: HTMLElement
	longPressHandler: HammerManager

	positionScale: number[]
	velocityScale: number[]
	postsScale: number[]

	rolling = false
	rollingSingle = false
	colors: any

	constructor(private element: ElementRef) {
		this.rollBallEvent = new EventEmitter<MotionSetup>()
		this.colors = Settings.THEME.colors
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
			posts: [5, 4, 3, 2, 1, 0]
			// new Array(this.mode.postsCount).fill(0)
		}
	}

	ngAfterViewInit() {
		setTimeout(() => {
			this.track.refresh()
		}, 500)


		// Initialize long press recognizer on the roll button
		this.rollButton = this.element.nativeElement.querySelector('#ball-roller')
		this.longPressHandler = new Hammer.Manager(this.rollButton, {
			recognizers: [[Hammer.Press, { time: 1000 }]]
		})
		this.longPressHandler.on('press', () => {
			this.rollingSingle = true
			this.rollBall(true)
		})

		// Hammerjs has a "ghost click" after a long press
		// this flag disable normal roll until the long press ends
		this.longPressHandler.on('pressup', () => {
			setTimeout(() => {
				this.rollingSingle = false
			}, 100)
		})
	}

	ngOnDestroy() {
		this.longPressHandler.destroy()
		this.longPressHandler = null
	}

	rollBall(single = false) {
		if (single === false && this.rollingSingle) {
			return
		}

		let setup = _.cloneDeep(this.setup)
		setup.single = single
		this.rollBallEvent.emit(setup)
	}

	velocitySetter = (val: number) => {
		let changed = this.setup.velocity !== val
		this.setup.velocity = val

		if (changed) {
			this.change.emit('v')
			// Just make sure that the ball position is up to date
			this.track.updateBallPostion(this.setup.position)
		}
	}

	positionSetter = (val: number) => {
		let changed = this.setup.position !== val

		if (changed) {
			this.setup.position = val
			this.track.updateBallPostion(val)
			this.change.emit('s')
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

			let t = elapsedTime * timeRatio
			let currentTime, nextTime, lastFound = idx, found = false
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

			let position
			if (found) {
				let current = motion[idx]
				let next = motion[idx + 1]
				position = interpolate(t, currentTime, nextTime, current.s, next.s)

				// queue next animation frame
				requestAnimationFrame(animationFrame)
			} else {
				this.rolling = false
				let lastPoint = motion[lastFound + 1]
				if (lastPoint) {
					position = lastPoint.s
				} else {
					// It's probably a single point motion (ball fall off at T=0)
					position = motion[0].s
				}
			}

			if (typeof position !== 'number') {
				throw 'Last data point not found'
			}

			this.track.updateBallPostion(position)
		}

		animationFrame()
	}
}
