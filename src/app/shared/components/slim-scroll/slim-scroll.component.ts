import {
	Component,
	ElementRef,
	ViewChild,
	HostListener,
	AfterViewInit,
	OnInit,
	OnDestroy
} from '@angular/core'

@Component({
	selector: 'gt-slim-scroll',
	styleUrls: ['slim-scroll.component.scss'],
	templateUrl: 'slim-scroll.component.html'
})
export class SlimScrollComponent implements OnInit, OnDestroy, AfterViewInit {
	@ViewChild('contentWrapper') contentWrapper: ElementRef
	@ViewChild('scrollbarHandler') scrollbarHandler: ElementRef

	nativeBarWidth = 15
	debounceInterval: any

	handlerHeight = 0
	handlerTop = 0

	observer: MutationObserver

	previousSize = Infinity
	needsShrink = false

	enabled = true

	constructor(public el: ElementRef) {
	}

	ngOnInit() {
		this.nativeBarWidth = this.getNativeBarWidth()
		this.observer = new MutationObserver((mutations) => {
			this.refresh()
		})
	}

	ngOnDestroy() {
		this.observer.disconnect()
		delete this.observer
	}

	ngAfterViewInit() {
		setTimeout(() => {
			this.refresh()
			let wrapper = this.contentWrapper.nativeElement
			wrapper.style.width = `calc(100% + ${this.nativeBarWidth}px)`
		}, 50)

		this.observer.observe(this.contentWrapper.nativeElement, { childList: true })
	}

	refresh() {
		if (this.debounceInterval) {
			clearTimeout(this.debounceInterval)
		}

		this.debounceInterval = setTimeout(() => {
			let host = this.el.nativeElement
			let wrapper = this.contentWrapper.nativeElement
			let handler = this.scrollbarHandler.nativeElement

			if (this.needsShrink) {
				host.style.flexGrow = 0
				this.needsShrink = false
			}

			setTimeout(() => {
				host.style.flexGrow = 1
				this.debounceInterval = undefined

				let rect = host.getBoundingClientRect()
				let scrollHeight = wrapper.scrollHeight

				this.handlerHeight = Math.floor(rect.height * (rect.height / scrollHeight))
				handler.style.height = this.handlerHeight + 'px'

				this.enabled = rect.height < scrollHeight
				this.refreshOffset()
			}, 10)
		}, 100)
	}

	refreshOffset() {
		let hostRect = this.el.nativeElement.getBoundingClientRect()
		let handler = this.scrollbarHandler.nativeElement
		let wrapper = <HTMLElement> this.contentWrapper.nativeElement

		let position = wrapper.scrollTop / (wrapper.scrollHeight - wrapper.offsetHeight)
		this.handlerTop = (hostRect.height - this.handlerHeight) * position
		handler.style.top = this.handlerTop + 'px'
	}

	onScroll(ev: any) {
		this.refreshOffset()
	}

	onDrag(position: number) {
		let wrapper = <HTMLElement> this.contentWrapper.nativeElement
		wrapper.scrollTop = position * (wrapper.scrollHeight - wrapper.offsetHeight)
	}

	onTap(position: number) {
		let wrapper = <HTMLElement> this.contentWrapper.nativeElement
		wrapper.scrollTop = position * (wrapper.scrollHeight - wrapper.offsetHeight)
	}

	@HostListener('window:resize')
	onResize() {
		let newHeight = window.innerHeight
		if (newHeight < this.previousSize) {
			this.needsShrink = true
		}

		this.previousSize = newHeight
		this.refresh()
	}

	/**
	 * This is the only implementation that we are actually using from nanoScrollerJS
	 * @returns {number}
	 */
	getNativeBarWidth() {
		let outer = document.createElement('div')
		let outerStyle = outer.style
		outerStyle.position = 'absolute'
		outerStyle.width = '100px'
		outerStyle.height = '100px'
		outerStyle.overflow = 'scroll'
		outerStyle.top = '-9999px'
		document.body.appendChild(outer)
		let scrollbarWidth = outer.offsetWidth - outer.clientWidth
		document.body.removeChild(outer)
		return scrollbarWidth
	}
}
