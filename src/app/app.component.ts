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
				|| el['mozExitFullScreen']
				|| el['msExitFullscreen']
		}
		
		if (rfs) {
			rfs.call(el)
		}
	}
	
	tryFullscreenForMobile = () => {
		let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
		if (isMobile && window.innerWidth < 1024) {
			document.body.classList.add('mobile')
			if (this.fullscreen === false) {
				this.toggleFullscreen()
			}
		}
	}
}
