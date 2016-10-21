import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core'
import { MotionSetup, ChallengeMode, DataType, UI_CONTROL, TrialError } from '../types'

import * as _ from 'lodash'
import * as Hammer from 'hammerjs'

import { TrackComponent } from '../track/track.component'
import { INITIAL_SETUP, THEME } from '../../settings'

@Component({
	selector: 'gt-track-panel',
	templateUrl: './track-panel.component.html',
	styleUrls: ['./track-panel.component.scss']
})
export class TrackPanelComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild(TrackComponent)
	track: TrackComponent

	@Input()
	mode: ChallengeMode

	@Output('roll')
	roll = new EventEmitter<MotionSetup>()

	@Output()
	change = new EventEmitter<UI_CONTROL>()

	@Output()
	abort = new EventEmitter()

	setup: MotionSetup
	colors = THEME.colors

	rollButton: HTMLElement
	longPressHandler: HammerManager

	zoomActive: boolean
	tapHandler: HammerManager

	positionScale: number[]
	velocityScale: number[]
	postsScale: number[]

	initialized = false
	rolling = false
	rollingSingle = false
	ignoreNext = false
	ballResetTimout: any

	requestingSelectionOf: DataType

	constructor(private element: ElementRef) {
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

		this.setup = this.setup || INITIAL_SETUP
	}

	ngAfterViewInit() {
		setTimeout(() => {
			this.initialized = true
			this.track.refresh()
		}, 500)


		// Initialize long press recognizer on the roll button
		this.rollButton = this.element.nativeElement.querySelector('#ball-roller')
		let pressHandler = this.longPressHandler = new Hammer.Manager(this.rollButton)
		pressHandler.add(new Hammer.Press({ time: 1000 }))
		pressHandler.on('press', () => this.rollBall(true))


		// Initialize tap recognizer in the whole track panel
		let card = this.element.nativeElement.querySelector('md-card')
		let tapHandler = this.tapHandler = new Hammer.Manager(<any> card)
		tapHandler.add(new Hammer.Tap({ event: 'singletap', taps: 1 }))
		tapHandler.on('singletap', () => {
			if (this.rolling) {
				this.abort.emit()
			}
		})
	}

	ngOnDestroy() {
		if (this.longPressHandler) {
			this.longPressHandler.destroy()
			this.longPressHandler = null
		}

		if (this.tapHandler) {
			this.tapHandler.destroy()
			this.tapHandler = null
		}
	}

	onTrackChange(postIndex: number) {
		if (postIndex === 0) {
			this.change.emit(UI_CONTROL.TRACK_POST_FIRST)
		} else {
			this.change.emit(UI_CONTROL.TRACK_POST_ANY)
		}
	}

	onAnimationEnded(pausing = false) {
		this.rolling = false

		if (!pausing) {
			this.rollingSingle = false

			// Reset ball position after a few seconds
			this.ballResetTimout = setTimeout(() => {
				this.updateBallPostion()
				this.cancelBallReset()
			}, 3000)
		}
	}

	rollBall(single = false) {
		if (single) {
			// Hammerjs has a "ghost click" after a long press
			// this flag disable normal roll until the long press ends
			this.ignoreNext = true
			this.rollingSingle = true
		} else if (this.ignoreNext) {
			this.ignoreNext = false
			return
		} else {
			this.rollingSingle = false
		}

		let setup = _.cloneDeep(this.setup)
		setup.breakDown = single
		this.roll.emit(setup)

		if (this.requestingSelectionOf === 'b') {
			this.requestingSelectionOf = undefined
		}
	}

	velocitySetter = (val: number) => {
		let changed = this.setup.velocity !== val
		this.setup.velocity = val

		if (changed) {
			this.change.emit(UI_CONTROL.VELOCITY_SCALE)
			// Just make sure that the ball position is up to date
			this.updateBallPostion(this.setup.position)
		}

		if (this.requestingSelectionOf === 'v') {
			this.requestingSelectionOf = undefined
		}
	}

	positionSetter = (val: number) => {
		let changed = this.setup.position !== val

		if (changed) {
			this.setup.position = val
			this.updateBallPostion(val)
			this.change.emit(UI_CONTROL.POSITION_SCALE)
		} else if (!this.rollingSingle) {
			this.updateBallPostion()
		}

		if (this.requestingSelectionOf === 's') {
			this.requestingSelectionOf = undefined
		}
	}

	clearHighlights() {
		this.track.highlightRamp()
		this.track.highlightPost()
		this.requestingSelectionOf = undefined
	}

	highlightResult(error: TrialError) {
		switch (error.type) {
			case 's':
				this.highlightControl(UI_CONTROL.POSITION_SCALE)
				break
			case 'v':
				this.highlightControl(UI_CONTROL.VELOCITY_SCALE)
				break
			case 'a':
				this.highlightControl(UI_CONTROL.TRACK_RAMP, error.position)
				break
		}
	}

	highlightControl(control: UI_CONTROL, at?: number) {
		switch (control) {
			case UI_CONTROL.ROLL_BUTTON:
			case UI_CONTROL.ROLL_BUTTON_HOLD:
				this.requestingSelectionOf = 'b'
				break

			case UI_CONTROL.POSITION_SCALE:
				this.requestingSelectionOf = 's'
				break

			case UI_CONTROL.VELOCITY_SCALE:
				this.requestingSelectionOf = 'v'
				break

			case UI_CONTROL.TRACK_POST_ANY:
				this.track.highlightPost(-1)
				break

			case UI_CONTROL.TRACK_POST_FIRST:
				this.track.highlightPost(0)
				break

			case UI_CONTROL.TRACK_RAMP:
				if (at) {
					this.track.highlightRamp(at)
				}
				break
		}
	}

	updateBallPostion(position?: number) {
		this.track.updateBallPostion(position)
	}

	cancelBallReset() {
		if (this.ballResetTimout) {
			clearInterval(this.ballResetTimout)
			this.ballResetTimout = undefined
		}
	}
}
