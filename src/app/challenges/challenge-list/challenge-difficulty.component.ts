import { Component, Input, OnChanges } from '@angular/core'
import { CHALLENGE_DIFFICULTY } from '../../shared/types'

@Component({
	selector: 'gt-challenge-difficulty',
	styles: [`
		:host {
			text-align: center;
			opacity: .8;
			display: inline-block;
			line-height: 20px;
		}
	  	
		:host md-icon {
			width: auto;
			height: auto;
			font-size: 16px !important;
			line-height: 15px;
			vertical-align: text-top;
		}
		
		.name {
			font-weight: bold;
			display: block;
		}
		
		.easy { color: green; }
		.medium { color: darkorange; }
		.hard { color: crimson; }
	`],
	template: `
	<b class="difficulty {{ passive ? '' : (name | lowercase) }}" [class.with-name]="full"
	title="Challenge Difficulty: {{ name | uppercase }}">
		<span *ngIf="full" class="name">{{ name }}</span>
		<template [ngIf]="level === levels.EASY">
			<md-icon>star</md-icon>
			<md-icon>star_border</md-icon>
			<md-icon>star_border</md-icon>
		</template>
		<template [ngIf]="level === levels.INTERMEDIATE">
			<md-icon>star</md-icon>
			<md-icon>star</md-icon>
			<md-icon>star_border</md-icon>
		</template>
		<template [ngIf]="level === levels.HARD">
			<md-icon>star</md-icon>
			<md-icon>star</md-icon>
			<md-icon>star</md-icon>
		</template>
	</b>
	`
})
export class ChallengeDifficultyComponent implements OnChanges {
	@Input() level: CHALLENGE_DIFFICULTY
	@Input() full: boolean
	@Input() passive: boolean

	levels = CHALLENGE_DIFFICULTY
	name: string

	ngOnChanges() {
		switch (this.level) {
			case CHALLENGE_DIFFICULTY.EASY:
				this.name = 'Easy'
				break

			case CHALLENGE_DIFFICULTY.INTERMEDIATE:
				this.name = 'Medium'
				break

			case CHALLENGE_DIFFICULTY.HARD:
				this.name = 'Hard'
				break
		}
	}
}
