import { NgModule, ApplicationRef } from '@angular/core'
import { RouterModule } from '@angular/router'
import { BrowserModule } from '@angular/platform-browser'

import { MaterialModule } from '@angular/material'

import { createNewHosts, createInputTransfer, removeNgStyles } from '@angularclass/hmr'

import { AppComponent } from './app.component'
import { AppState, StoreType } from './app.state'

import { PagesModule, SharedModule } from 'app/modules'

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot([]),
		MaterialModule.forRoot(),

		SharedModule,
		PagesModule,
	],
	providers: [
		AppState,
	],
	bootstrap: [
		AppComponent,
	],
})
export class AppModule {
	constructor(public appRef: ApplicationRef, public appState: AppState) {}

	hmrOnInit(store: StoreType) {
		if (!store || !store.state) {
			return
		}

		console.log('HMR store', JSON.stringify(store, null, 2))

		// set state
		this.appState._state = store.state
		// set input values
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
		// save state
		const state = this.appState._state
		store.state = state
		// recreate root elements
		store.disposeOldHosts = createNewHosts(cmpLocation)
		// save input values
		store.restoreInputValues  = createInputTransfer()
		// remove styles
		removeNgStyles()
	}

	hmrAfterDestroy(store: StoreType) {
		// display new elements
		store.disposeOldHosts()
		delete store.disposeOldHosts
	}
}
