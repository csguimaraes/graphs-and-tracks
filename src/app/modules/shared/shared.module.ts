import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpModule } from '@angular/http'

import { MaterialModule } from '@angular/material'

import { IconComponent } from './icon/icon.component'
import { ButtonComponent } from './button/button.component'
import { LoginDialogComponent } from './login-dialog/login-dialog.component'

const SHARED_MODULES = [
	HttpModule,
	CommonModule,
]

const SHARED_COMPONENTS = [
	IconComponent,
	ButtonComponent,
	LoginDialogComponent
]

const SHARED_PROVIDERS = [
	HttpModule
]

@NgModule({
	imports: [
		...SHARED_MODULES,
		MaterialModule.forRoot(),
	],
	declarations: [
		...SHARED_COMPONENTS,
	],
	providers: [
		...SHARED_PROVIDERS,
	],
	exports: [
		...SHARED_MODULES,
		...SHARED_COMPONENTS,
		MaterialModule,
	],
	entryComponents: [
		LoginDialogComponent
	]
})
export class SharedModule {
}
