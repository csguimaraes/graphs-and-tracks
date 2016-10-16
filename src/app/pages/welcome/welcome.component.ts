import { Component } from '@angular/core'

// TODO: is duplicated
export interface AppLink {
	icon: string
	name: string
	subtitle?: string
	route: string
}

@Component({
	selector: 'gt-home',
	styleUrls: ['./welcome.component.scss'],
	templateUrl: './welcome.component.html'
})
export class WelcomeComponent {
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




