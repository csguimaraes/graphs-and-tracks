import { Component, ViewEncapsulation, ViewContainerRef } from '@angular/core'
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material'

import { LoginDialogComponent } from 'common'

export interface AppLink {
	icon: string
	name: string
	subtitle?: string
	route: string
}

@Component({
	selector: 'gt-app',
	styleUrls: ['./root.component.scss'],
	templateUrl: './root.component.html',
	encapsulation: ViewEncapsulation.None
})
export class RootComponent {
	title = 'Graphs & Tracks'

	menuLinks: AppLink[] = [
		{ name: 'Challenges', icon: 'challenge-list', route: '/challenges' },
		{ name: 'Community', icon: 'community-online', route: '/community' },
		{ name: 'Settings', icon: 'app-settings', route: '/settings' },
		{ name: 'About', icon: 'app-about', route: '/about' }
	]



	loginDialogRef: MdDialogRef<LoginDialogComponent>
	lastCloseResult: string

	constructor(public dialog: MdDialog, public viewContainerRef: ViewContainerRef) {
	}

	openLogin() {
		let config = new MdDialogConfig()
		config.viewContainerRef = this.viewContainerRef

		this.loginDialogRef = this.dialog.open(LoginDialogComponent, config)

		this.loginDialogRef.afterClosed().subscribe(result => {
			this.lastCloseResult = result
			this.loginDialogRef = null
		})
	}
}
