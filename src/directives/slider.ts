import { Directive, ElementRef, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core'

import * as Hammer from 'hammerjs'

/***
 * Use this directive to watch for pan gestures in a element
 *
 * The dimensions of the element itself will be used as boundary reference,
 * but you can target another element with the [reference] attribute
 *
 * The slider position between the start and end of the slider
 * is always a represented as a floating point between 0 and 1
 *
 * # Attributes
 * [reference] HTML element to be used as a boundary reference
 * [start] Offset in pixels of the start slider area
 * [end] Offset in pixels of the end slider area
 * [vertical] Set to true
 *
 * # Events
 * (slide) Emits the latest position when dragging
 * (change) Emits the final position when the drag ends
 */

@Directive({selector: '[slider]'})
export class SliderDirective implements OnInit, OnDestroy {
	@Input('vertical')
	isVertical: boolean = false

	@Input('reference')
	panReference: HTMLElement = null

	@Input('start')
	startOffset: number = 0

	@Input('end')
	endOffset: number = 0

	@Output('slide')
	slide: EventEmitter<number> = new EventEmitter<number>()

	@Output('change')
	change: EventEmitter<number> = new EventEmitter<number>()

	private target: HTMLElement
	private handler: HammerManager
	private boundaries: ClientRect
	private sliderSize: number

	constructor(el: ElementRef) {
		this.target = el.nativeElement
	}

	ngOnInit(): any {
		let panDirection, panEvents = ['tap']
		if (this.isVertical) {
			panDirection = Hammer.DIRECTION_VERTICAL
			panEvents.push('panup', 'pandown')
		} else {
			panDirection = Hammer.DIRECTION_HORIZONTAL
			panEvents.push('panleft', 'panright')
		}

		this.handler = new Hammer.Manager(this.target, {
			recognizers: [
				[Hammer.Tap],
				[Hammer.Pan, { direction: panDirection }]
			]
		})

		this.handler.on('panstart', this.onPanStart)
		this.handler.on(panEvents.join(' '), this.onPan)
		this.handler.on('panend', this.onPanEnd)
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
		// let dragPosition = (horizontal ? event.center.x : event.center.y) - sliderStart
		// let scaleIndex = Math.floor(dragPosition / sliderTickSize)
		// scaleIndex = Math.max(0, Math.min(scaleIndex, scale.length - 1))
		// callback(scale[scaleIndex], target)
		this.slide.emit(Math.random())
	}

	onPanEnd = (event: HammerInput) => {
		this.change.emit(Math.random())
	}

	updateBoundaries() {
		this.boundaries = (this.panReference || this.target).getBoundingClientRect()

		if (this.isVertical) {
			this.boundaries.top -= this.startOffset
			this.boundaries.bottom -= this.endOffset
			this.sliderSize = this.boundaries.bottom - this.boundaries.top
		} else {
			this.boundaries.left -= this.startOffset
			this.boundaries.right -= this.endOffset
			this.sliderSize = this.boundaries.right - this.boundaries.left
		}
	}
}
