import { Component, ViewEncapsulation } from '@angular/core'
import { SafeHtml, DomSanitizer } from '@angular/platform-browser'

@Component({
	selector: 'gt-app',
	styleUrls: [
		'./styles/reset.scss',
		'./styles/theme.scss',
		'./styles/utils.scss',
		'./app.component.scss'
	],
	templateUrl: './app.component.html',
	encapsulation: ViewEncapsulation.None
})
export class AppComponent {
	size = 36
	test: SafeHtml = 'HELLO'

	openSidenav() {
		this.size = this.size === 24 ? 48 : 24
		this.test = this.sanitizer.bypassSecurityTrustHtml(
			'<gt-icon [size]="80">guest</gt-icon>'
		)
	}

	constructor(private sanitizer: DomSanitizer) {
	}
}
