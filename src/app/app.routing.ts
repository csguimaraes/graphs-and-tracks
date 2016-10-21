import { Route, RouterModule } from '@angular/router'

import * as Pages from './pages'
import * as Challenges from './challenges'
// import * as Community from './community'

const APP_ROUTES: Route[] = [
	{ path: '', redirectTo: 'welcome', pathMatch: 'full' },

	// Pages
	{ path: 'welcome', component: Pages.WelcomeComponent },
	{ path: 'settings', component: Pages.SettingsComponent },
	{ path: 'about', component: Pages.AboutComponent },

	// Challenges
	{ path: 'challenges', component: Challenges.ChallengeListComponent },

	// Comunity
	// { path: 'community', component: Community.CommunityListComponent },


	{ path: '**', component: Pages.NotFoundComponent },
]

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES)
