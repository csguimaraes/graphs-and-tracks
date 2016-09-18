import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core'
import { MotionSetup, ChallengeMode, DataType, AttemptError } from '../types'

import * as _ from 'lodash'
import * as Hammer from 'hammerjs'

import * as Settings from '../../settings'
import { TrackComponent } from '../track/track.component'

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
	change = new EventEmitter<DataType>()

	@Output()
	abort = new EventEmitter()

	setup: MotionSetup
	colors = Settings.THEME.colors

	rollButton: HTMLElement
	longPressHandler: HammerManager

	zoomActive: boolean
	tapHandler: HammerManager

	positionScale: number[]
	velocityScale: number[]
	postsScale: number[]

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

		this.setup = this.setup || {
			position: 0,
			velocity: 30,
			posts: [0, 0, 0, 0, 0, 0]
		}
	}

	ngAfterViewInit() {
		setTimeout(() => {
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
		tapHandler.on('singletap', ev => {
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

	onTrackChange(type: DataType) {
		this.change.emit('p')
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
	}

	velocitySetter = (val: number) => {
		let changed = this.setup.velocity !== val
		this.setup.velocity = val

		if (changed) {
			this.change.emit('v')
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
			this.change.emit('s')
		} else if (!this.rollingSingle) {
			this.updateBallPostion()
		}

		if (this.requestingSelectionOf === 's') {
			this.requestingSelectionOf = undefined
		}
	}

	highlightError(error?: AttemptError) {
		if (error) {
			if (error.type === 'a') {
				this.track.highlightRamp(error.position)
			} else {
				this.requestingSelectionOf = error.type
			}
		} else {
			this.track.highlightRamp()
			this.requestingSelectionOf = undefined
		}

	}

	updateBallPostion(position?: number) {
		this.track.updateBallPostion(position)
	}

	toggleZoom() {
		this.zoomActive = !(this.zoomActive)
		this.track.refresh()
	}

	cancelBallReset() {
		if (this.ballResetTimout) {
			clearInterval(this.ballResetTimout)
			this.ballResetTimout = undefined
		}
	}

	restoreSetup(setup: MotionSetup) {
		this.setup = setup
	}
}
