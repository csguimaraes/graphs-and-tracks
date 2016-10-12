import { Component, ElementRef, OnInit, AfterViewInit, ChangeDetectionStrategy } from '@angular/core'
import { Http, Response } from '@angular/http'

import { Subject } from 'rxjs'

import * as parse5 from 'parse5'

@Component({
	selector: 'gt-icon',
	styles: [
		`
			#icon-name {
				display: none !important;
			}
		`
	],
	template: `
		<div id="icon-name"><ng-content></ng-content></div>
		<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
		[attr.width]="size" [attr.height]="size" viewBox="0 0 24 24"
		[ngStyle]="{ 'fill': fillColor }"
		>
			<path *ngFor="let path of paths" [attr.d]="path"/>
		</svg>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent implements OnInit, AfterViewInit {
	name: string
	paths = new Subject<string[]>()

	size: number = 20

	fillColor: string = 'black'

	constructor(private elementRef: ElementRef, private http: Http) {
	}

	ngOnInit() {
	}

	ngAfterViewInit() {
		let element = <HTMLElement>this.elementRef.nativeElement
		let nameContainer = <HTMLDivElement> element.querySelector('#icon-name')
		this.name = nameContainer.innerText.trim()
		this.requestIcon(this.name)
		this.updateContext(element)
	}

	updateContext(host: HTMLElement) {
		let style = getComputedStyle(host)
		this.fillColor = style.color
		// this.updateSize(parseInt(style.fontSize))
	}

	requestIcon(iconName: string) {
		this.http
			.get(`/icons/${iconName}.svg`)
			.toPromise()
			.then(this.loadIcon)
			.catch(this.handleError)
	}

	loadIcon = (res: Response) => {
		let fileContent = res.text()
		let fragment = parse5.parseFragment(fileContent)
		let svg = fragment.childNodes.find(n => n.nodeName === 'svg')
		let pathElements = svg.childNodes.filter(n => n.nodeName === 'path')
		let paths = pathElements.map(p => p.attrs.find(a => a.name === 'd').value)
		this.paths.next(paths)
	}

	handleError = (error: any) => {
		let errMsg = (error.message) ? error.message :
			error.status ? `${error.status} - ${error.statusText}` : 'Server error'
		console.error(errMsg)
		return Promise.reject(errMsg)
	}
}
