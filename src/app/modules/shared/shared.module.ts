import { NgModule }            from '@angular/core'
import { CommonModule }        from '@angular/common'
import { HttpModule }        from '@angular/http'
import { MaterialModule } from '@angular/material'

import { IconComponent } from './icon.component'

@NgModule({
	imports: [
		HttpModule,
		CommonModule,

		MaterialModule,
	],
	declarations: [
		IconComponent,
	],
	providers: [
		HttpModule
	],
	exports: [
		HttpModule,
		CommonModule,

		MaterialModule,

		IconComponent,
	],
})
export class SharedModule {
}
