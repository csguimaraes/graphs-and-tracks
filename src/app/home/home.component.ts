import { Component, HostListener, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
	selector: 'gt-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	constructor(private router: Router) {
	}
	
	ngOnInit(): void {
		if (window['fs-out']) {
			window['fs-out']()
		}
	}

	@HostListener('window:keydown', ['$event'])
	onKeydown(ev: KeyboardEvent) {
		if (ev.which === 39  || ev.which === 13) {
			this.router.navigateByUrl(`/challenges/tutorial`)
		}
	}
	
	debug = () => {
		let msg = `Screen width: ${window.innerWidth}\nUser agent: ${navigator.userAgent}`
		alert(msg)
	}
}
