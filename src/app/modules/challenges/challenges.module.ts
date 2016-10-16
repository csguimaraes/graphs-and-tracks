import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { CommonModule, filterExports } from 'app'

import * as ModuleExports from './index'

const MODULE_COMPONENTS = filterExports(ModuleExports, 'component')
const MODULE_ROUTES: Routes = [
	{ path: 'challenges', component: ModuleExports.ChallengeListComponent }
]

@NgModule({
	imports: [
		RouterModule.forChild(MODULE_ROUTES),
		CommonModule
	],
	declarations: [
		...MODULE_COMPONENTS
	]
})
export class ChallengesModule {
}
