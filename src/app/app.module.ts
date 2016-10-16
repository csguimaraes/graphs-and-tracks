import { NgModule, ApplicationRef } from '@angular/core'
import { RouterModule, Route } from '@angular/router'
import { BrowserModule } from '@angular/platform-browser'
import { createNewHosts, createInputTransfer } from '@angularclass/hmr'

import { CommonModule } from './modules'
import { AppState, StoreType } from './app.state'

import { RootComponent } from './root/root.component'
import * as Pages from './pages'

const APP_MODULES = [
	CommonModule
]

const APP_ROUTES: Route[] = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'welcome', component: Pages.WelcomeComponent },
	{ path: 'settings', component: Pages.SettingsComponent },
	{ path: 'about', component: Pages.AboutComponent },
	{ path: '**', component: Pages.NotFoundComponent },
]

@NgModule({
	declarations: [
		RootComponent,
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot(APP_ROUTES),

		...APP_MODULES
	],
	providers: [
		AppState,
	],
	bootstrap: [
		RootComponent,
	],
})
export class AppModule {
	constructor(public appRef: ApplicationRef, public appState: AppState) {}

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
		store.restoreInputValues  = createInputTransfer()
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
