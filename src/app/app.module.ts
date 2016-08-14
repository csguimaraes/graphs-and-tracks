import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { MdIconModule } from '@angular2-material/icon'

import { AppComponent }       from './app.component'
import { routing, appRoutingProviders } from './app.routes'

import { HomeComponent }    from './home/home.component'

@NgModule({
	imports: [
		BrowserModule,
		MdIconModule,
		routing
	],
	declarations: [

		AppComponent,
		HomeComponent
		// HighlightDirective
	],
	providers: [
		appRoutingProviders
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {
}
