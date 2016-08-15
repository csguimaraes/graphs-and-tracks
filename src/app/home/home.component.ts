import { Component } from '@angular/core'

import { SliderDirective } from '../shared/slider.directive'
import { ScaleComponent } from '../shared/scale/scale.component'

@Component({
	selector: 'gt-home',
	template: `
		Scale Value: {{s.value}}
		<gt-scale #s [color]="'orange'" [value]="scale" [min]="0" [max]="500" [step]="50"></gt-scale>
`,
	styleUrls: ['./home.component.scss'],
	directives: [
		SliderDirective,
		ScaleComponent
	]
})
export class HomeComponent {
	current: number = 0
	transitional: number = 0
	scale: number = 250

	onSlide(value: number) {
		this.transitional = value
	}

	onSlideEnd(value: number) {
		this.current = value
	}
}
