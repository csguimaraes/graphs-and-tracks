import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { values } from 'lodash'

import * as Pages from './index'
import { CommonModule } from 'main'

const PAGES_COMPONENTS = <any[]> values(Pages)
const PAGES_ROUTES: Routes = [

]

@NgModule({
	imports: [
		RouterModule.forChild(PAGES_ROUTES),
		CommonModule
	],
	declarations: [
		...PAGES_COMPONENTS
	]
})
export class PagesModule { }
