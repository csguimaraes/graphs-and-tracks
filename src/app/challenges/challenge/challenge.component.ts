import { Component, OnInit, ViewChild, trigger, ChangeDetectorRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

import * as lodash from 'lodash'

import { Challenge, Attempt, MotionSetup, MotionData, Message, TrialResult, CHALLENGE_TYPE, UI_CONTROL, TutorialStep } from '../../shared/types'
import { printDataTable } from '../../shared/debug'
import { interpolate } from '../../shared/helpers'
import { HINT_MESSAGES, ANIMATION_DURATION, TUTORIAL_STEPS, INITIAL_SETUP, TUTORIAL_CHALLENGE_SETUP, KUDOS } from '../../settings'
import { ChallengesService } from '../../shared/challenges.service'
import { Motion } from '../../shared/motion.model'
import { GraphsPanelComponent } from '../../shared/graphs-panel/graphs-panel.component'
import { TrackPanelComponent } from '../../shared/track-panel/track-panel.component'
import { SWITCH_DURATION, SWITCH_ANIMATION } from '../../shared/animations'
import { AuthService } from '../../shared/auth.service'

const SETUP_STORAGE_KEY = 'latest-track-setup'
type SwitchDirection = 'toLeft' | 'toRight' | 'none'

@Component({
	selector: 'gt-challenge',
	templateUrl: './challenge.component.html',
	styleUrls: ['./challenge.component.scss'],
	animations: [ trigger('challengeSwitch', SWITCH_ANIMATION)]
})
export class ChallengeComponent implements OnInit {
	@ViewChild(TrackPanelComponent)
	trackPanel: TrackPanelComponent

	@ViewChild(GraphsPanelComponent)
	graphsPanel: GraphsPanelComponent

	challengeId: string
	challenge: Challenge

	collectionIndex: number
	collectionIds: string[]
	switchDirection: SwitchDirection = 'toRight'

	goalMotion: Motion
	isDemo = false
	isReady = false
	isLoadingNext = false

	segmentedAnimationIndex: number

	detailsEnabled = false

	hintsUsed = false
	hintsEnabled = false
	hintDismissed = false

	messageTitle: string
	messageIcon: string
	messageContent: string

	isTutorial = false
	tutorialStep: TutorialStep
	tutorialStepIndex: number
	tutorialRequires: UI_CONTROL[] = []

	attempts: Attempt[] = []
	commitedAttempts: number = 0
	lastTrialResult: TrialResult

	types = CHALLENGE_TYPE

	set currentMessage(message: Message) {
		if (message) {
			this.messageIcon = message.icon || this.messageIcon
			this.messageTitle = (message.title instanceof Array) ? lodash.sample(message.title) : message.title
			this.messageContent = (message.message instanceof Array) ? lodash.sample(message.message) : message.message
		} else {
			this.messageTitle = undefined
			this.messageContent = undefined
		}

		let isSuccessMessage = this.lastTrialResult && this.lastTrialResult.error === undefined

		if (this.isTutorial) {
			this.messageIcon = 'school'
		} else if (isSuccessMessage) {
		} else {
			this.messageIcon = 'lightbulb_outline'
		}
	}

	constructor(
		private challenges: ChallengesService,
		private router: Router,
		private changeDetector: ChangeDetectorRef,
		public  auth: AuthService,
		route: ActivatedRoute
	) {
		this.challengeId = route.snapshot.params['id']
		route.params.subscribe(p => this.loadChallengeById(p['id']))
	}

	ngOnInit() {
		this.isReady = true
		this.loadChallengeById(this.challengeId)
		this.loadTrackSetup()
	}

	onRollBall(setup: MotionSetup) {
		let allowRoll = this.tutorialRequires.indexOf(UI_CONTROL.ROLL_BUTTON_HOLD) === -1
		let allowRollHold = this.tutorialRequires.indexOf(UI_CONTROL.ROLL_BUTTON) === -1

		if (setup.breakDown && allowRollHold) {
			this.tutorialCheckRequirement(UI_CONTROL.ROLL_BUTTON_HOLD)
			this.performMotion(setup)
		} else if (allowRoll) {
			this.tutorialCheckRequirement(UI_CONTROL.ROLL_BUTTON)
			this.performMotion(setup)
		} else {
			console.warn('This shouldn\'t happen')
		}
	}

	onAbort() {
		if (this.trackPanel) {
			this.trackPanel.rolling = false
		}
	}

	onGraphPanelChange(control: UI_CONTROL) {
		this.segmentedAnimationIndex = undefined
		this.trackPanel.updateBallPostion()
		if (this.trackPanel.rolling) {
			this.endAnimation()
		}

		this.tutorialCheckRequirement(control)
	}

	onTrackPanelChange(control: UI_CONTROL) {
		this.segmentedAnimationIndex = undefined
		this.storeSetup()

		switch (control) {
			case UI_CONTROL.POSITION_SCALE:
			case UI_CONTROL.VELOCITY_SCALE:
				this.graphsPanel.refresh(false, true)
				break
		}

		this.tutorialCheckRequirement(control)
	}

	onHintToggle() {
		this.hintsEnabled = !(this.hintsEnabled)

		if (this.hintsEnabled) {
			this.hintDismissed = false
			this.currentMessage = HINT_MESSAGES['intro']
		} else {
			this.clearHints()
		}
	}

	onDetailsToggle() {
		this.detailsEnabled = !(this.detailsEnabled)
	}

	navigateTo(direction: SwitchDirection) {
		if (this.isLoadingNext === true) {
			return false
		}

		if (this.auth.user.settings.effects) {
			this.switchDirection = direction
			this.changeDetector.detectChanges()
		} else {
			this.switchDirection = 'none'
		}

		let newIndex = this.collectionIndex + (direction === 'toLeft' ? 1 : -1)
		let newId = this.collectionIds[newIndex]
		if (newId) {
			this.router.navigate(['challenges', newId])

			this.isLoadingNext = true
			setTimeout(() => {
				this.isLoadingNext = false
			}, SWITCH_DURATION)
		}
	}

	loadChallengeById(challengeId: string) {
		if (this.isReady === false) {
			return
		}

		if (challengeId === 'tutorial' || challengeId === 'exploration') {
			this.switchDirection = 'toRight'
		}

		let challenge = this.challenges.getById(challengeId)
		if (challenge) {
			this.onAbort()
			this.loadChallenge(challenge)
		} else {
			// TODO: navigate 404
		}
	}

	loadChallenge(challenge: Challenge) {
		this.clearHints()
		this.segmentedAnimationIndex = undefined

		if (this.collectionIds === undefined || this.challenge.type !== challenge.type) {
			this.collectionIds = this.challenges.getIdsInCollection(challenge.type)
		}

		this.challenge = challenge
		this.challengeId = challenge.id
		this.collectionIndex = this.collectionIds.indexOf(challenge.id)

		this.goalMotion = Motion.fromSetup(this.challenge.goal, this.challenge.mode)
		// this.graphsPanel.animateGoalUpdate(this.goalMotion.data)

		this.hintsUsed = false
		this.isDemo =
			this.challenge.type === CHALLENGE_TYPE.TUTORIAL ||
			this.challenge.type === CHALLENGE_TYPE.EXPLORATION

		this.isTutorial = this.challenge.type === CHALLENGE_TYPE.TUTORIAL
		if (this.isTutorial) {
			this.startTutorial()
		}
	}

	performMotion(setup: MotionSetup) {
		let trialMotion = Motion.fromSetup(setup)

		let isFreshStart = this.segmentedAnimationIndex === undefined

		if (isFreshStart) {
			this.graphsPanel.addTrialData(trialMotion.data)

			if (setup.breakDown) {
				this.segmentedAnimationIndex = 0
			}

			if (this.challenge.complete) {
				this.lastTrialResult = undefined
			} else {
				this.lastTrialResult = this.goalMotion.evaluateTrial(trialMotion)

				if (this.lastTrialResult.error) {
					this.attempts.push({
						accuracy: -1,
						setup: setup,
						motion: trialMotion
					})
				} else {
					this.challenge.complete = true
				}
			}
		}

		if (!this.isTutorial) {
			this.clearHints()
		}

		this.trackPanel.cancelBallReset()
		this.animate(trialMotion.data, ANIMATION_DURATION, setup.breakDown)
	}

	animate(motion: MotionData[], duration: number, breakdown = false) {
		this.trackPanel.rolling = true
		let animationStartedAt = Date.now()
		duration *= 1000

		// Ratio between real time and simulation time
		let timeRatio = (this.challenge.mode.simulation.duration * 1000) / duration

		// Index of which data point the animation is currently on
		// the index will be increased accordly with the amount of time elapsed
		let idx = this.segmentedAnimationIndex || 0
		let firstPoint = motion[idx]

		// If the animation isn't starting from the beggining
		// Adjust the real time offset to reflect that
		if (idx !== 0) {
			let timeToSkip = firstPoint.t * 1000
			animationStartedAt -= (timeToSkip / timeRatio)
		}

		// If animating in breakdown mode, make the accelaration of the initial frame
		// required to keep the animation going
		let requiredAcceleration = breakdown ? firstPoint.a : undefined


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
					this.segmentedAnimationIndex = idx + 1
					this.endAnimation(true)
					return
				}

				currentTime = Math.floor(motion[idx].t * 1000)
				nextTime = Math.floor(motion[idx + 1].t * 1000)
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
				console.error('Last data point not found')
			}

			this.graphsPanel.setTrialLineClip(elapsedTime / duration)
			this.trackPanel.updateBallPostion(position)
		}

		animationFrame()
	}

	endAnimation(justPause = false) {
		this.commitedAttempts = this.attempts.length
		this.trackPanel.onAnimationEnded(justPause)

		if (justPause === false) {
			// Restore some values
			this.segmentedAnimationIndex = undefined
			this.graphsPanel.setTrialLineClip(1)

			if (this.lastTrialResult && this.isTutorial === false) {
				this.hintDismissed = true
				let bumpDelay = 500

				setTimeout(() => {
					this.showTrialResult(this.lastTrialResult)
				}, bumpDelay)

				setTimeout(() => {
					this.hintDismissed = false
				}, bumpDelay + 50)
			}
		}
	}

	showTrialResult(forResult: TrialResult) {
		let error = forResult.error

		if (error) {
			if (this.hintsEnabled) {
				this.hintsUsed = true
				this.graphsPanel.highlightError(error)
				this.trackPanel.highlightResult(error)

				switch (error.type) {
					case 's':
						this.currentMessage = HINT_MESSAGES['position']
						break
					case 'v':
						this.currentMessage = HINT_MESSAGES['velocity']
						break
					case 'a':
						this.currentMessage = HINT_MESSAGES['posts']
						break
					default:
						this.currentMessage = HINT_MESSAGES['intro']
						break
				}
			}
		} else {
			let message = lodash.sample(KUDOS.intros)
			let messageEnd: string
			let icon = KUDOS.icons['normal']
			if (this.challenge.attempts.length) {
				if (this.hintsUsed) {
					messageEnd = KUDOS.h1n1
				} else {
					icon = KUDOS.icons['good']
					messageEnd = KUDOS.h0n1
				}

				messageEnd = messageEnd.replace('%N%', this.challenge.attempts.length.toString())
			} else {
				icon = KUDOS.icons['good']
				if (this.hintsUsed) {
					messageEnd = KUDOS.h1n0
				} else {
					icon = KUDOS.icons['awesome']
					messageEnd = KUDOS.h0n0
				}
			}

			this.currentMessage = {
				title: KUDOS.titles,
				message: `${message}<br>${messageEnd}`,
				icon: icon
			}
		}
	}

	clearHints() {
		this.currentMessage = undefined
		this.hintDismissed = true
		this.clearHighlights()
	}

	clearHighlights() {
		this.graphsPanel.clearHighlights()
		this.trackPanel.clearHighlights()
	}

	storeSetup() {
		localStorage.setItem(SETUP_STORAGE_KEY, JSON.stringify(this.trackPanel.setup))
	}

	loadTrackSetup() {
		let nextSetup: MotionSetup
		if (this.isTutorial) {
			nextSetup = TUTORIAL_CHALLENGE_SETUP
		} else {
			let cachedSetup = localStorage.getItem(SETUP_STORAGE_KEY)
			if (cachedSetup) {
				nextSetup = <MotionSetup> JSON.parse(cachedSetup)
			} else {
				nextSetup = INITIAL_SETUP
			}
		}

		this.trackPanel.setup = lodash.cloneDeep(nextSetup)
	}

	startTutorial() {
		this.hintsEnabled = true
		this.hintDismissed = false
		this.tutorialStepIndex = -1
		this.graphsPanel.autoClearTrials = false
		this.loadTrackSetup()
		this.tutorialNextStep()
	}

	endTutorial() {
		this.hintsEnabled = false
		this.hintDismissed = true
		this.tutorialRequires = []
		this.graphsPanel.autoClearTrials = true

		if (window.history.length > 1) {
			window.history.back()
		} else {
			this.router.navigate(['challenges'])
		}
	}

	tutorialHasNext() {
		return this.tutorialStepIndex < (TUTORIAL_STEPS.length - 1)
	}

	tutorialNextStep() {
		this.tutorialStepIndex++
		let currentStep = TUTORIAL_STEPS[this.tutorialStepIndex]

		if (currentStep === undefined) {
			return this.endTutorial()
		}

		this.tutorialStep = this.currentMessage = currentStep

		this.tutorialRequires = []
		let requirements: UI_CONTROL[] = currentStep.requires || []
		for (let requirement of requirements) {
			switch (requirement) {
				case UI_CONTROL.VELOCITY_SCALE:
				case UI_CONTROL.POSITION_SCALE:
				case UI_CONTROL.TRACK_POST_ANY:
				case UI_CONTROL.TRACK_POST_FIRST:
				case UI_CONTROL.ROLL_BUTTON:
				case UI_CONTROL.ROLL_BUTTON_HOLD:
					this.tutorialRequires.push(requirement)
					this.trackPanel.highlightControl(requirement)
					break
				case UI_CONTROL.POSITION_GRAPH:
				case UI_CONTROL.VELOCITY_GRAPH:
				case UI_CONTROL.ACCELERATION_GRAPH:
					this.tutorialRequires.push(requirement)
					this.graphsPanel.highlightControl(requirement)
					break
			}
		}

		if (this.tutorialRequires.length) {
			this.changeDetector.markForCheck()
		}
	}

	tutorialCheckRequirement(control: UI_CONTROL) {
		if (control === UI_CONTROL.TRACK_POST_FIRST && this.tutorialRequires.indexOf(UI_CONTROL.TRACK_POST_ANY) !== -1) {
			control = UI_CONTROL.TRACK_POST_ANY
		}

		if (this.tutorialRequires.length) {
			let requirementIndex = this.tutorialRequires.indexOf(control)
			if (requirementIndex !== -1) {
				this.tutorialRequires.splice(requirementIndex, 1)
			}

			if (this.tutorialRequires.length === 0) {
				this.clearHighlights()
				this.tutorialCheckTriggers()
			}
		}
	}

	tutorialCheckTriggers() {
		if (this.tutorialStep && this.tutorialStep.triggers) {
			for (let trigger of this.tutorialStep.triggers) {
				switch (trigger) {
					case UI_CONTROL.POSITION_GRAPH:
						this.graphsPanel.selectGraph('s', false)
						break
					case UI_CONTROL.ACCELERATION_GRAPH:
						this.graphsPanel.selectGraph('a', false)
						break
					case UI_CONTROL.TUTORIAL_NEXT:
						this.tutorialNextStep()
						break
				}
			}
		}
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
