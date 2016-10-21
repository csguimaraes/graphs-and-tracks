import { Component, ElementRef, ChangeDetectionStrategy, Input, ViewEncapsulation, ChangeDetectorRef, OnInit, AfterViewInit } from '@angular/core'

const ICONS = require('assets/icons.json')
const DEFAULT_SIZE = 24

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

	iconSize: number = DEFAULT_SIZE

	@Input() size

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
		this.checkSizeChange()
		this.markForCheck()
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
				} else {
					console.error(`Icon '${this.name}' not found`)
				}
			} else {
				console.error(`Invalid icon name '${this.name}'`)
			}
		}
	}

	checkSizeChange() {
		if (this.size) {
			let size: number
			if (this.size === 'auto') {
				let hostStyle = window.getComputedStyle(this.host)
				size = parseInt(hostStyle.fontSize)
			} else {
				size = parseInt(this.size)
			}

			if (size && size > 0) {
				this.iconSize = size
			}
		} else {
			this.iconSize = DEFAULT_SIZE
		}
	}

	markForCheck() {
		setTimeout(() => this.detector.markForCheck(), 1)
	}
}



