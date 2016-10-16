import { NgModule } from '@angular/core'
import { CommonModule as AngularCommonModule } from '@angular/common'
import { HttpModule } from '@angular/http'
import { MaterialModule } from '@angular/material'

import { filterExports } from './helpers'

import * as CommonExports from './index'
const COMMON_COMPONENTS = filterExports(CommonExports, 'component')
const COMMON_DIRECTIVES = filterExports(CommonExports, 'directive')

const COMMON_MODULES = [
	HttpModule,
	AngularCommonModule,
]

const COMMON_PROVIDERS = [
	HttpModule
]

@NgModule({
	imports: [
		...COMMON_MODULES,
		MaterialModule.forRoot(),
	],
	declarations: [
		...COMMON_COMPONENTS,
		...COMMON_DIRECTIVES,
	],
	providers: [
		...COMMON_PROVIDERS,
	],
	exports: [
		...COMMON_MODULES,
		...COMMON_COMPONENTS,
		...COMMON_DIRECTIVES,
		MaterialModule,
	],
	entryComponents: [
		// TODO: move it to somewhere else?
		CommonExports.LoginDialogComponent
	]
})
export class CommonModule {
}
