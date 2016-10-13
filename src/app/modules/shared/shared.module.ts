import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpModule } from '@angular/http'

import { IconComponent } from './icon.component'

@NgModule({
	imports: [
		HttpModule,
		CommonModule,
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

		IconComponent,
	],
})
export class SharedModule {
}
