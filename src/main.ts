import { enableProdMode, provide, PLATFORM_DIRECTIVES, PLATFORM_PIPES } from '@angular/core'
import { HTTP_PROVIDERS } from '@angular/http'
import { ROUTER_DIRECTIVES, provideRouter, RouterConfig } from '@angular/router'
import { bootstrap } from '@angular/platform-browser-dynamic'
import { MdIconRegistry, MdIcon } from '@angular2-material/icon'

import * as Components from './components'
import { StorageService } from './services'
import { DumpPipe, TimeAgoPipe } from './utils'

import './public/icons.scss'
import './public/utils.scss'
import './public/main.scss'
import './public/hacks.scss'


if (process.env.ENV === 'build') {
	enableProdMode()
}

const GLOBAL_DIRECTIVES = provide(PLATFORM_DIRECTIVES, {
	useValue: [
		ROUTER_DIRECTIVES,
		MdIcon
	],
	multi: true
})

const GLOBAL_PIPES = provide(PLATFORM_PIPES, {
	useValue: [
		DumpPipe,
		TimeAgoPipe
	],
	multi: true
})


const routes: RouterConfig = [
	{ path: '', component: Components.HomeComponent },
	{ path: 'challenges', component: Components.ChallengeListComponent },
	{ path: 'challenges/:id', component: Components.ChallengeViewerComponent },
	{ path: 'challenges/:id/edit', component: Components.ChallengeEditorComponent }
]
const APP_ROUTER_PROVIDERS = provideRouter(routes)

bootstrap(Components.AppComponent, [
	HTTP_PROVIDERS,
	APP_ROUTER_PROVIDERS,

	GLOBAL_DIRECTIVES,
	GLOBAL_PIPES,

	StorageService,
	MdIconRegistry
])
	.catch(err => console.error(err))
