import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit, ViewChild } from '@angular/core'
import { MotionSetup, ChallengeMode, MotionData, DataType } from '../types'

import * as _ from 'lodash'

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
export class TrackPanelComponent implements OnInit, AfterViewInit {
	@ViewChild(TrackComponent)
	track: TrackComponent

	@Input()
	mode: ChallengeMode

	@Output('roll')
	rollBallEvent: EventEmitter<MotionSetup>

	@Output()
	change: EventEmitter<DataType> = new EventEmitter<DataType>()

	setup: MotionSetup

	element: any
	host: any
	svg: any

	positionScale: number[]
	velocityScale: number[]
	postsScale: number[]

	rolling = false
	colors: any

	constructor() {
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
	}

	rollBall() {
		this.rollBallEvent.emit(_.cloneDeep(this.setup))
	}

	velocitySetter = (val: number) => {
		let changed = this.setup.velocity !== val
		this.setup.velocity = val

		if (changed) {
			this.change.emit('v')
		}
	}

	positionSetter = (val: number) => {
		let changed = this.setup.position !== val
		this.setup.position = val
		this.track.updateBallPostion(val)

		if (changed) {
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
				position = lastPoint.s
			}

			if (typeof position !== 'number') {
				throw 'Last data point not found'
			}

			this.track.updateBallPostion(position)
		}

		animationFrame()
	}
}
