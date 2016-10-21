import { NgModule, ApplicationRef } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpModule } from '@angular/http'
import { MaterialModule } from '@angular/material'


import { filterExports } from './shared/helpers'
import { createNewHosts, createInputTransfer } from '@angularclass/hmr'

import { AppState, StoreType } from './app.state'
import { APP_ROUTING } from './app.routing'

import { RootComponent } from './root/root.component'

import * as Pages from './pages'
import * as Challenges from './challenges'
import * as SharedExports from './shared'

const PAGES_COMPONENTS = filterExports(Pages, 'component')
const CHALLENGE_COMPONENTS = filterExports(Challenges, 'component')

const SHARED_COMPONENTS = filterExports(SharedExports, 'component')
const SHARED_DIRECTIVES = filterExports(SharedExports, 'directive')

@NgModule({
	declarations: [
		RootComponent,
		...PAGES_COMPONENTS,
		...CHALLENGE_COMPONENTS,

		...SHARED_COMPONENTS,
		...SHARED_DIRECTIVES,
	],
	imports: [
		BrowserModule,
		HttpModule,
		MaterialModule.forRoot(),

		APP_ROUTING
	],
	providers: [
		AppState,
	],
	bootstrap: [
		RootComponent,
	],
	entryComponents: [
		SharedExports.LoginDialogComponent
	]
})
export class AppModule {
	constructor(public appRef: ApplicationRef, public appState: AppState) {
	}

	hmrOnInit(store: StoreType) {
		if (!store || !store.state) {
			return
		}

		console.log('HMR store', JSON.stringify(store, null, 2))

		this.appState._state = store.state
		if ('restoreInputValues' in store) {
			let restoreInputValues = store.restoreInputValues
			setTimeout(restoreInputValues)
		}

		this.appRef.tick()
		delete store.state
		delete store.restoreInputValues
	}

	hmrOnDestroy(store: StoreType) {
		const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement)
		const state = this.appState._state
		store.state = state
		store.disposeOldHosts = createNewHosts(cmpLocation)
		store.restoreInputValues = createInputTransfer()
		this.removeStyles()
	}

	hmrAfterDestroy(store: StoreType) {
		store.disposeOldHosts()
		delete store.disposeOldHosts
	}

	removeStyles() {
		let styles = Array.prototype.slice.call(document.head.querySelectorAll('style'), 0)
		// styles = styles.filter((style) => style.innerText.indexOf('_ng') !== -1)
		styles.map(el => el.remove())
	}
}
