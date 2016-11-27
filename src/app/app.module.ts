import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { MaterialModule } from '@angular/material'

import { AppComponent } from './app.component'
import { APP_ROUTING, APP_ROUTING_PROVIDERS } from './app.routing'

import { ChallengesService } from './shared/challenges.service'
import { StorageService } from './shared/storage.service'
import { AuthService } from './shared/auth.service'

import { DumpPipe } from './shared/dump.pipe'

import { HomeComponent } from './home/home.component'
import { ChallengeComponent } from './challenges/challenge/challenge.component'
import { ChallengeEditorComponent } from './challenges/challenge-editor/challenge-editor.component'
import { ChallengePracticeComponent } from './challenges/challenge-practice/challenge-practice.component'
import { ChallengeListComponent } from './challenges/challenge-list/challenge-list.component'
import { TrackPanelComponent } from './shared/track-panel/track-panel.component'
import { GraphsPanelComponent } from './shared/graphs-panel/graphs-panel.component'
import { ScaleComponent } from './shared/scale/scale.component'
import { TrackComponent } from './shared/track/track.component'
import { SliderDirective } from './shared/slider.directive'
import { AboutComponent } from './about/about.component'
import { ChallengeListItemComponent } from './challenges/challenge-list/challenge-list-item/challenge-list-item.component'
import { SlimScrollComponent } from './shared/slim-scroll/slim-scroll.component'
import { ChallengeDifficultyComponent } from './challenges/challenge-list/challenge-difficulty.component'
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component'
import { ChallengeShareDialogComponent } from './challenges/challenge-share-dialog'

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		MaterialModule.forRoot(),
		APP_ROUTING
	],
	entryComponents: [
		ConfirmationDialogComponent,
		ChallengeShareDialogComponent,
	],
	declarations: [
		AppComponent,
		HomeComponent,
		AboutComponent,

		ConfirmationDialogComponent,
		ChallengeShareDialogComponent,
		
		ChallengeListComponent,
		ChallengeListItemComponent,
		ChallengeDifficultyComponent,

		TrackComponent,

		ChallengeComponent,
		ChallengeEditorComponent,
		ChallengePracticeComponent,
		TrackPanelComponent,
		GraphsPanelComponent,

		SliderDirective,
		SlimScrollComponent,
		ScaleComponent,

		DumpPipe
	],
	providers: [
		APP_ROUTING_PROVIDERS,
		ChallengesService,
		StorageService,
		AuthService
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {
}
