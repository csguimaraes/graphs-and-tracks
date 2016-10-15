import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { values } from 'lodash'

import * as Pages from './index'
import { SharedModule } from 'app/modules'

const PAGES_COMPONENTS = <any[]> values(Pages)
const PAGES_ROUTES: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: Pages.HomeComponent },
	{ path: 'settings', component: Pages.SettingsComponent },
	{ path: 'about', component: Pages.AboutComponent },
	{ path: '**', component: Pages.NotFoundComponent },
]

@NgModule({
	imports: [
		RouterModule.forChild(PAGES_ROUTES),
		SharedModule
	],
	declarations: [
		...PAGES_COMPONENTS
	]
})
export class PagesModule { }
