import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { MdIconModule } from '@angular2-material/icon'
import { MdToolbarModule } from '@angular2-material/toolbar'
import { MdCardModule } from '@angular2-material/card'
import { MdGridListModule } from '@angular2-material/grid-list'
import { MdListModule } from '@angular2-material/list'
import { MdMenuModule } from '@angular2-material/menu'

import { AppComponent } from './app.component'
import { APP_ROUTING, APP_ROUTING_PROVIDERS } from './app.routing'

import { ChallengesService } from './shared/challenges.service'
import { AuthService } from './shared/auth.service'

import { DumpPipe } from './shared/dump.pipe'

import { HomeComponent } from './home/home.component'
import { ChallengeComponent } from './challenges/challenge/challenge.component'
import { ChallengeEditorComponent } from './challenges/challenge-editor/challenge-editor.component'
import { ChallengeListComponent } from './challenges/challenge-list/challenge-list.component'
import { TrackPanelComponent } from './shared/track-panel/track-panel.component'
import { GraphsPanelComponent } from './shared/graphs-panel/graphs-panel.component'
import { ScaleComponent } from './shared/scale/scale.component'
import { TrackComponent } from './shared/track/track.component'
import { SliderDirective } from './shared/slider.directive'
import { AboutComponent } from './about/about.component'
import { ChallengeListItemComponent } from './challenges/challenge-list/challenge-list-item/challenge-list-item.component'
import { EditorComponent } from './editor/editor.component'
import { SlimScrollComponent } from './shared/slim-scroll/slim-scroll.component'
import { ChallengeDifficultyComponent } from './challenges/challenge-list/challenge-difficulty.component'

@NgModule({
	imports: [
		BrowserModule,

		// Material 2
		MdIconModule.forRoot(),
		MdToolbarModule.forRoot(),
		MdCardModule.forRoot(),
		MdGridListModule.forRoot(),
		MdListModule.forRoot(),
		MdMenuModule.forRoot(),

		APP_ROUTING
	],
	declarations: [
		AppComponent,
		HomeComponent,
		AboutComponent,

		ChallengeListComponent,
		ChallengeListItemComponent,
		ChallengeDifficultyComponent,

		TrackComponent,

		ChallengeComponent,
		ChallengeEditorComponent,
		TrackPanelComponent,
		GraphsPanelComponent,

		EditorComponent,

		SliderDirective,
		SlimScrollComponent,
		ScaleComponent,

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
