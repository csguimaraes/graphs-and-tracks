import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core'

import { SliderDirective } from '../slider.directive'
import { DataDomain } from '../types'

@Component({
	selector: 'gt-scale',
	templateUrl: './scale.component.html',
	styleUrls: ['./scale.component.scss'],
	directives: [
		SliderDirective
	]
})
export class ScaleComponent implements OnInit, AfterViewInit {
	@Input() min: number
	@Input() max: number
	@Input() step: number
	@Input() domain: DataDomain

	@Input() value: number
	@Input() color = 'black'

	@Output() change = new EventEmitter<number>()
	@Output() slide = new EventEmitter<number>()

	@ViewChild(SliderDirective) slider: SliderDirective

	scale: number[]
	scaleRange: number
	interval: number
	latestValue: number

	ngOnInit(): void {
		let initialIndex, scaleValue
		if (this.domain) {
			this.min = this.domain.min
			this.max = this.domain.max
			this.step = this.domain.step
		}

		this.scale = []
		for (scaleValue = this.min; scaleValue <= this.max; scaleValue += this.step) {
			this.scale.push(scaleValue)
		}
		let lastValue = scaleValue - this.step
		this.scaleRange = lastValue - this.min

		if (this.value === undefined) {
			// Pick one value at the center of the scale
			initialIndex = Math.round(this.scale.length / 2) - 1
			this.value = this.scale[initialIndex]
		}

		this.latestValue = this.value
		this.interval = 1 / this.scale.length
	}

	ngAfterViewInit(): void {
		setTimeout(() => {
			this.slider.updateBoundaries()
		}, 1)
	}

	onSlide(position: number) {
		let newValue = this.getValueAtPosition(position)
		if (newValue !== this.value) {
			this.value = newValue
		}

		this.slide.emit(this.min + (this.scaleRange * position))
	}

	onChange(position: number) {
		let newValue = this.getValueAtPosition(position)

		if (newValue !== this.latestValue) {
			this.value = newValue
			this.latestValue = this.value
			this.change.emit(this.value)
		}
	}

	getValueAtPosition(position: number) {
		let newIndex = position === 1 ?
		this.scale.length - 1 :
			Math.floor(position / this.interval)

		return this.scale[newIndex]
	}

	setStyles() {
		return {
			'background': this.color,
			'color': this.color,
			'border-top-color': this.color,
			'border-bottom-color': this.color
		}
	}
}
