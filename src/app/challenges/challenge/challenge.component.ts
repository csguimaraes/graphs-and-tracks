import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import {Challenge, Attempt, MotionSetup, DataType, MotionData} from '../../shared/types'
import { printDataTable } from '../../shared/debug'
import { interpolate } from '../../shared/helpers'
import { ANIMATION_DURATION } from '../../shared/settings'
import { StorageService } from '../../shared/storage.service'
import { Motion } from '../../shared/motion.model'

import { GraphsComponent } from '../../shared/graphs/graphs.component'
import { TrackPanelComponent } from '../../shared/track-panel/track-panel.component'

@Component({
	selector: 'gt-challenge',
	templateUrl: './challenge.component.html',
	styleUrls: ['./challenge.component.scss'],
	directives: [
		TrackPanelComponent,
		GraphsComponent
	]
})
export class ChallengeComponent implements OnInit, AfterViewInit {
	@ViewChild(TrackPanelComponent)
	trackPanel: TrackPanelComponent

	@ViewChild(GraphsComponent)
	graphsPanel: GraphsComponent

	challenge: Challenge
	goalMotion: Motion

	attempts: Attempt[] = []
	zoom: boolean = false

	breakdownAtIndex: number

	constructor(private route: ActivatedRoute, private storage: StorageService) {
		let id = this.route.snapshot.params['id']
		this.challenge = this.storage.getChallenge(id)
		this.goalMotion = Motion.fromSetup(this.challenge.goal, this.challenge.mode)
	}

	ngOnInit() {
		this.graphsPanel.initialize(this.goalMotion.data, this.challenge.mode)
	}

	ngAfterViewInit() {
		if (this.route.snapshot.fragment === 'tutorial') {
			this.startTutorial()
		}
	}

	onGraphZoom() {
		this.zoom = !(this.zoom)
	}

	onRollBall(setup: MotionSetup) {
		let motion = Motion.fromSetup(setup)

		if (this.breakdownAtIndex === undefined) {
			// Only count this as an attempt if this roll isn't a continuation of a break down motion
			this.graphsPanel.addTrialData(motion.data)
			this.attempts.push({
				accuracy: -1,
				setup: setup,
				motion: motion
			})
		}

		if (setup.breakDown) {
			if (this.breakdownAtIndex === undefined) {
				this.breakdownAtIndex = 0
			}
		}

		this.animate(motion.data, ANIMATION_DURATION, setup.breakDown)
	}

	onTrackChange(dataType: DataType) {
		if (dataType === 's' || dataType === 'v') {
			this.graphsPanel.refresh(false, true)
		}
	}

	startTutorial() {
		// TODO
	}

	animate(motion: MotionData[], duration: number, breakdown = false) {
		this.trackPanel.rolling = true
		let animationStartedAt = Date.now()
		duration *= 1000

		// Ratio between real time and simulation time
		let timeRatio = (this.challenge.mode.simulation.duration * 1000) / duration

		// Index of which data point the animation is currently on
		// the index will be increased accordly with the amount of time elapsed
		let idx = this.breakdownAtIndex || 0

		// If the animation isn't starting for the beggining
		// Adjust the real time offset to reflect that
		if (idx !== 0) {
			let timeToSkip = (motion[idx].t * 1000) / timeRatio
			console.log(animationStartedAt)
			animationStartedAt -= timeToSkip

			console.log('removed time', timeToSkip, animationStartedAt)
		}

		// If animating in breakdown mode, make the accelaration of the initial frame
		// required to keep the animation going
		let requiredAcceleration = breakdown ? motion[idx].a : undefined


		let animationFrame = () => {
			let now = Date.now()
			let elapsedTime = now - animationStartedAt

			if (!(this.trackPanel.rolling) || elapsedTime > duration) {
				this.endAnimation()
				return
			}

			let t = elapsedTime * timeRatio
			let currentTime, nextTime, lastFound = idx, found = false
			while (idx < (motion.length - 1)) {
				if (requiredAcceleration !== undefined && motion[idx + 1].a !== requiredAcceleration) {
					// TODO: accelleration change isn't detected EXACTLY over a post head (interpolate?)
					// Suspend the animation until the user rolls again
					this.breakdownAtIndex = idx + 1
					this.endAnimation(true)
					return
				}

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
				let lastPoint = motion[lastFound + 1]
				if (lastPoint) {
					position = lastPoint.s
				} else {
					// It's probably a motion with a single data point (ball fall off right after T=0)
					position = motion[0].s
				}

				this.endAnimation()
			}

			if (typeof position !== 'number') {
				throw 'Last data point not found'
			}

			this.graphsPanel.setTrialLineClip(elapsedTime / duration)
			this.trackPanel.updateBallPostion(position)
		}

		animationFrame()
	}

	endAnimation(justPause = false) {
		if (!justPause) {
			this.graphsPanel.setTrialLineClip(1)
		}

		this.trackPanel.endAnimation(justPause)
	}

	debug(type: string) {
		let trialIndex = ''
		if (this.attempts.length) {
			let promptText = `Enter trial index (from 1 to ${this.attempts.length}) or leave empty for goal:`
			trialIndex = prompt('Which trial motion you want to debug?\n\n' + promptText)
		}

		if (trialIndex !== undefined) {
			if (trialIndex === '') {
				printDataTable(this.goalMotion.data, 'goal')
			} else {
				let attempt = this.attempts[+trialIndex - 1]
				printDataTable(attempt.motion.data, `attempt #${trialIndex}`)
			}
		}
	}
}
