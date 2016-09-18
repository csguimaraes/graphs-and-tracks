import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { MdIconModule } from '@angular2-material/icon'
import { MdToolbarModule } from '@angular2-material/toolbar'
import { MdCardModule } from '@angular2-material/card'
import { MdGridListModule } from '@angular2-material/grid-list'
import { MdListModule } from '@angular2-material/list'

import { AppComponent } from './app.component'
import { APP_ROUTING, APP_ROUTING_PROVIDERS } from './app.routing'

import { ChallengesService } from './shared/challenges.service'
import { AuthService } from './shared/auth.service'

import { DumpPipe } from './shared/dump.pipe'

import { HomeComponent } from './home/home.component'
import { ChallengeComponent } from './challenges/challenge/challenge.component'
import { ChallengeListComponent } from './challenges/challenge-list/challenge-list.component'
import { TrackPanelComponent } from './shared/track-panel/track-panel.component'
import { GraphsComponent } from './shared/graphs/graphs.component'
import { ScaleComponent } from './shared/scale/scale.component'
import { TrackComponent } from './shared/track/track.component'
import { SliderDirective } from './shared/slider.directive'

@NgModule({
	imports: [
		BrowserModule,

		// Material 2
		MdIconModule.forRoot(),
		MdToolbarModule.forRoot(),
		MdCardModule.forRoot(),
		MdGridListModule.forRoot(),
		MdListModule.forRoot(),

		APP_ROUTING
	],
	declarations: [
		AppComponent,
		HomeComponent,

		ChallengeListComponent,
		ChallengeComponent,
		TrackPanelComponent,
		GraphsComponent,

		SliderDirective,
		ScaleComponent,
		TrackComponent,

		DumpPipe
	],
	providers: [
		APP_ROUTING_PROVIDERS,
		ChallengesService,
		AuthService
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {
}
