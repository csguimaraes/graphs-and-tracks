import { Component } from '@angular/core'

@Component({
	moduleId: module.id,
	selector: 'test',
	template: `
	Current value: {{currentValue}} <br>
	Slider value: {{transitionalValue}} <br>
	<!--<div [slider] (slide)="onSlide($event)" (change)="onChange($event)"></div>-->
	`,
	styles: [
		'div { background: red; height: 50px; }'
	],
})
export class TestComponent {
	currentValue: number
	transitionalValue: number

	constructor() {
		this.currentValue = 0
	}

	onSlide(val: number) {
		this.transitionalValue = val
	}

	onChange(val: number) {
		this.currentValue = val
	}
}
