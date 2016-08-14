import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'home', component: HomeComponent }
/**
	Some useful samples
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
];

export const appRoutingProviders: any[] = [
	// NOTE: Router dependencies may be placed here later on (e.g auth provider)
];

export const routing = RouterModule.forRoot(appRoutes);


