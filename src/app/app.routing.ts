import { Routes, RouterModule } from '@angular/router'
import { HomeComponent } from './home/home.component'

import { ChallengeListComponent } from './challenges/challenge-list/challenge-list.component'
import { ChallengeComponent } from './challenges/challenge/challenge.component'
import { AboutComponent } from './about/about.component'
import { EditorComponent } from './editor/editor.component'

const APP_ROUTES: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'challenges', component: ChallengeListComponent },
	{ path: 'challenges/:id', component: ChallengeComponent },
	{ path: 'editor', component: EditorComponent },
	{ path: 'about', component: AboutComponent },
/** Some useful samples
	{
	 path: 'heroes',
	 component: HeroListComponent,
	 data: {
		 title: 'Heroes List'
	 }
	},
	{ path: 'hero/:id', component: HeroDetailComponent },
	{ path: '**', component: PageNotFoundComponent }
 */
]

export const APP_ROUTING_PROVIDERS: any[] = [
	// NOTE: Router dependencies may be placed here later on (e.g auth provider)
]

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true })


