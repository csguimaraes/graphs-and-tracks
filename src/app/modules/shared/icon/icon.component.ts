import { Component, ElementRef, OnInit, ChangeDetectionStrategy, Input } from '@angular/core'
const ICONS = require('app/assets/icons.json')

@Component({
	selector: 'gt-icon',
	styleUrls: ['./icon.component.scss'],
	templateUrl: './icon.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent implements OnInit {
	name: string
	path: string

	@Input() size: number = 24

	fillColor: string = 'black'

	constructor(private elementRef: ElementRef) {
	}

	ngOnInit() {
		let element = <HTMLElement>this.elementRef.nativeElement
		let nameContainer = <HTMLDivElement> element.querySelector('#icon-name')
		this.name = nameContainer.innerText.trim()
		this.path = ICONS[this.name]
		this.updateContext(element)
	}

	updateContext(host: HTMLElement) {
		let style = getComputedStyle(host)
		this.fillColor = style.color
		// this.updateSize(parseInt(style.fontSize))
	}
}



