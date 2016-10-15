import { Component } from '@angular/core'
import { AppLink } from 'app/app.component'

@Component({
	selector: 'gt-home',
	styleUrls: ['./home.component.scss'],
	templateUrl: './home.component.html'
})
export class HomeComponent {
	homeLinks: AppLink[] = [
		{
			name: 'First time here?',
			subtitle: 'Use this tutorial to learn how the program works',
			icon: 'challenge-tutorial',
			route: '/challenges/tutorial'
		},
		{
			name: 'Practice',
			subtitle: 'Get comfortable with using the program',
			icon: 'challenge-practice',
			route: '/challenges/editor'
		},
		{
			name: 'Challenge List',
			subtitle: 'Browse all the available challenges',
			icon: 'challenge-list',
			route: '/challenges'
		},
	]
}




