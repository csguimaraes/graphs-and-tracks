import { Component, Input, ViewEncapsulation } from '@angular/core'

export type IconPosition = 'left' | 'right'
@Component({
	selector: 'gt-button',
	styleUrls: ['./button.component.scss'],
	templateUrl: './button.component.html',
	encapsulation: ViewEncapsulation.None
})
export class ButtonComponent {
	@Input()
	icon: string

	@Input('icon-position')
	position: IconPosition = 'left'

	@Input()
	active = false

	constructor() {
	}
}
