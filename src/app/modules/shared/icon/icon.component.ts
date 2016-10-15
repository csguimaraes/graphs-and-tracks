import { Component, ElementRef, ChangeDetectionStrategy, Input, ViewEncapsulation, ChangeDetectorRef, OnInit, AfterViewInit } from '@angular/core'

const ICONS = require('app/assets/icons.json')

@Component({
	selector: 'gt-icon',
	styleUrls: ['./icon.component.scss'],
	templateUrl: './icon.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class IconComponent implements OnInit, AfterViewInit {
	name: string
	path: string

	@Input() size = 24

	private host: HTMLElement
	private nameContainer: HTMLDivElement

	constructor(private elementRef: ElementRef, private detector: ChangeDetectorRef) {
		this.host = <HTMLElement>this.elementRef.nativeElement
	}

	ngOnInit() {
		this.nameContainer = <HTMLDivElement> this.host.querySelector('.svg-icon-name')
	}

	ngAfterViewInit() {
		this.checkIconChange()
	}

	checkIconChange() {
		let iconName = this.nameContainer.innerText.trim()
		if (iconName && this.name !== iconName) {
			this.name = iconName
			let iconPath = this.name.split('-')
			if (iconPath.length === 2) {
				let path = ICONS[iconPath[0]][iconPath[1]]
				if (path) {
					this.path = path
					this.check()
				} else {
					console.error(`Icon '${this.name}' not found`)
				}
			} else {
				console.error(`Invalid icon name '${this.name}'`)
			}
		}
	}

	check() {
		setTimeout(() => this.detector.markForCheck(), 1)
	}
}



