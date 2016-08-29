import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core'
import { MotionSetup, ChallengeMode, DataType } from '../types'

import * as _ from 'lodash'
import * as Hammer from 'hammerjs'

import * as Settings from '../settings'
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
	ballResetTimout: any

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

		// let midPos = Math.ceil(this.positionScale.length / 2) - 1
		// let midVel = Math.ceil(this.velocityScale.length / 2) - 1
		this.setup = {
			position: 0, // this.positionScale[midPos],
			velocity: 10, // this.velocityScale[midVel],
			posts: [1, 0, 1, 0, 1, 0]
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
		setup.breakDown = single
		this.rollBallEvent.emit(setup)
	}

	velocitySetter = (val: number) => {
		let changed = this.setup.velocity !== val
		this.setup.velocity = val

		if (changed) {
			this.change.emit('v')
			// Just make sure that the ball position is up to date
			this.updateBallPostion(this.setup.position)
		}
	}

	positionSetter = (val: number) => {
		let changed = this.setup.position !== val

		if (changed) {
			this.setup.position = val
			this.updateBallPostion(val)
			this.change.emit('s')
		} else {
			this.updateBallPostion()
		}
	}

	endAnimation(justPause = false) {
		this.rolling = false

		if (!justPause) {
			// Reset ball position after a few seconds
			this.ballResetTimout = setTimeout(() => {
				this.updateBallPostion()
			}, 3000)
		}
	}

	updateBallPostion(position?: number) {
		if (this.ballResetTimout) {
			clearInterval(this.ballResetTimout)
		}

		this.track.updateBallPostion(position)
	}
}
