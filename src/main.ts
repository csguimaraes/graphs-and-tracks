import { enableProdMode, provide, PLATFORM_DIRECTIVES } from '@angular/core'
import { HTTP_PROVIDERS } from '@angular/http'
import { provideRouter, RouterConfig } from '@angular/router'
import { bootstrap } from '@angular/platform-browser-dynamic'
import { MdIconRegistry, MdIcon } from '@angular2-material/icon'

import * as Components from './components'
import { ApiService } from './services'

import './public/fonts.scss'
import './public/icons.scss'
import './public/utils.scss'
import './public/main.scss'

// depending on the env mode, enable prod mode or add debugging modules
if (process.env.ENV === 'build') {
	enableProdMode()
}

const routes: RouterConfig = [
	{ path: '', component: Components.HomeComponent },
	{ path: 'about', component: Components.AboutComponent }
]

const APP_ROUTER_PROVIDERS = provideRouter(routes)
const GLOBAL_DIRECTIVES = provide(PLATFORM_DIRECTIVES, {
	useValue: [
		MdIcon
	],
	multi: true
})

bootstrap(Components.AppComponent, [
	HTTP_PROVIDERS,
	APP_ROUTER_PROVIDERS,
	GLOBAL_DIRECTIVES,
	ApiService,
	MdIconRegistry
])
	.catch(err => console.error(err))
