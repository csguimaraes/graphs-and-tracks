import { Component } from '@angular/core'
import { AuthService } from './shared/auth.service'

@Component({
	selector: 'gt-app',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	fullscreen = false
	
	constructor(public auth: AuthService) {
		window['fs'] = this.tryFullscreenForMobile
		window['fs-out'] = this.exitFullscreen
		
		document.body.addEventListener('touchmove', function(event) {
			if (event.preventDefault) {
				event.preventDefault()
			}
		})
		
		this.checkForMobile()
	}
		
	toggleFullscreen() {
		this.fullscreen = !this.fullscreen
		let el: any
		let rfs: any
		
		if (this.fullscreen) {
			el = document.documentElement
			rfs = el['requestFullscreen']
				|| el['webkitRequestFullScreen']
				|| el['mozRequestFullScreen']
				|| el['msRequestFullscreen']
		} else {
			el = document
			rfs = el['exitFullscreen']
				|| el['webkitExitFullscreen']
				|| el['mozCancelFullScreen']
				|| el['msExitFullscreen']
		}
		
		if (rfs) {
			rfs.call(el)
		}
	}
	
	checkForMobile = () => {
		let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
		if (isMobile && window.innerWidth < 1024) {
			document.body.classList.add('mobile')
		}
	}
	
	isIos() {
		return /iP/.test(navigator.userAgent)
	}
	
	isIphone() {
		return /iPhone/.test(navigator.userAgent)
	}
	
	isSafari() {
		return /safari/i.test(navigator.userAgent)
	}
	
	tryFullscreenForMobile = () => {
		let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
		if (isMobile && window.innerWidth < 1024) {
			document.body.classList.add('mobile')
			document.body.classList.add('no-toolbar')
			if (this.fullscreen === false) {
				this.toggleFullscreen()
			}
		}
	}
	
	exitFullscreen = () => {
		if (this.fullscreen === true) {
			document.body.classList.remove('no-toolbar')
		}
		
		/*
		NOTE: Disabled for now
		document.body.classList.remove('mobile')
		if (this.fullscreen === true) {
			this.toggleFullscreen()
		}
	    */
	}
}
