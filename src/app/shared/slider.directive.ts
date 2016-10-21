import { Directive, ElementRef, Input, Output, OnInit, OnDestroy, EventEmitter, HostListener } from '@angular/core'

import * as Hammer from 'hammerjs'

/***
 * Use this directive to watch for pan gestures in a svg
 *
 * The dimensions of the svg itself will be used as boundary reference,
 * but you can target another svg with the [reference] attribute
 *
 * The slider position between the start and end of the slider
 * is always a represented as a floating point between 0 and 1
 *
 * # Attributes
 * [reference] HTML svg to be used as a boundary reference
 * [start] Offset in pixels of the start slider area
 * [end] Offset in pixels of the end slider area
 * [vertical] Set to true
 *
 * # Events
 * (slide) Emits the latest position when dragging
 * (change) Emits the final position when the drag ends
 */

@Directive({selector: '[gtSlider]'})
export class SliderDirective implements OnInit, OnDestroy {
	@Input() vertical: boolean = false
	@Input() emitTap: boolean = false
	@Input() reference: HTMLElement = null
	@Input() start: number = 0
	@Input() end: number = 0

	@Output() slided: EventEmitter<number> = new EventEmitter<number>()
	@Output() change: EventEmitter<number> = new EventEmitter<number>()
	@Output() tap: EventEmitter<number> = new EventEmitter<number>()

	sliderStart: number
	sliderEnd: number
	sliderSize: number

	cancelNextPan = false

	private target: HTMLElement
	private handler: HammerManager

	constructor(el: ElementRef) {
		this.target = el.nativeElement
	}

	ngOnInit(): any {
		let panDirection, panEvents
		if (this.vertical) {
			panDirection = Hammer.DIRECTION_VERTICAL
			panEvents = 'panup pandown'
		} else {
			panDirection = Hammer.DIRECTION_HORIZONTAL
			panEvents = 'panleft panright'
		}

		this.handler = new Hammer.Manager(this.target, {
			recognizers: [
				[Hammer.Tap],
				[Hammer.Pan, { direction: panDirection }]
			]
		})

		this.handler.on('panstart', this.onPanStart)
		this.handler.on(panEvents, this.onPan)

		if (this.emitTap) {
			this.handler.on('tap', this.onTap)
			this.handler.on('panend', this.onPanEnd)
		} else {
			this.handler.on('tap panend', this.onPanEnd)
		}

		setTimeout(() => {
			this.updateBoundaries()
		}, 10)
	}

	ngOnDestroy(): any {
		if (this.handler) {
			this.handler.destroy()
			this.handler = null
		}
	}

	onPanStart = (event: HammerInput) => {
		this.updateBoundaries()
	}

	onPan = (event: HammerInput) => {
		let relativePosition = this.getRelativePosition(event)
		this.slided.emit(relativePosition)
	}

	onPanEnd = (event: HammerInput) => {
		let relativePosition = this.getRelativePosition(event)
		this.change.emit(relativePosition)
	}

	onTap = (event: HammerInput) => {
		let relativePosition = this.getRelativePosition(event)
		this.tap.emit(relativePosition)
	}

	getRelativePosition(event: HammerInput) {
		let position = this.vertical ? event.center.y : event.center.x
		let positionOffset = position - this.sliderStart
		let relativePosition = positionOffset / this.sliderSize
		relativePosition = Math.max(0, Math.min(relativePosition, 1))
		return relativePosition
	}

	updateBoundaries() {
		let boundaries = (this.reference || this.target).getBoundingClientRect()

		this.sliderStart = this.vertical ? boundaries.top : boundaries.left
		this.sliderEnd = this.vertical ? boundaries.bottom : boundaries.right

		this.sliderStart += this.start
		this.sliderEnd -= this.end

		this.sliderSize = this.sliderEnd - this.sliderStart
	}

	@HostListener('window:resize')
	onResize() {
		this.updateBoundaries()
	}
}
