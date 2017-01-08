import { Component, OnInit, AfterViewInit } from '@angular/core'
import { MdDialogRef } from '@angular/material'
import { Http } from '@angular/http'
import { Challenge } from '../shared/types'
import { ChallengesService } from '../shared/challenges.service'

const Sharer: any = require('sharer.npm.js')

@Component({
	selector: 'gt-challenge-share',
	template: `
		<md-card [class.working]="creating">
			<md-card-title>Share Challenge</md-card-title>
			<md-card-content>
				Share this challenge and see if someone else can solve it!
				Here is the link for your challenge: <br>
				<textarea name="link" id="link" cols="70" rows="2">{{ link }}</textarea>
			</md-card-content>
			<md-card-actions>
				<button #twitterButton md-button md-raised-button type="button" (click)="socialShare(twitterButton)"
				class='sharer button with-icon twitter'
				data-sharer='twitter'
				data-title='I created a challenge on Graphs and Tracks'
				[attr.data-url]='link'
				>
					<md-icon svgSrc="/img/twitter.svg"></md-icon>
				</button>
				<button #facebookButton md-button md-raised-button type="button" (click)="socialShare(facebookButton)"
				class='sharer button with-icon facebook'
				data-sharer='facebook'
				data-title='I created a challenge on Graphs and Tracks'
				[attr.data-url]='link'
				>
					<md-icon svgSrc="/img/facebook.svg"></md-icon>
				</button>
				<button #gplusButton md-button md-raised-button type="button" (click)="socialShare(gplusButton)"
				class='sharer button with-icon gplus'
				data-sharer='googleplus'
				data-title='I created a challenge on Graphs and Tracks'
				[attr.data-url]='link'
				>
					<md-icon svgSrc="/img/gplus.svg"></md-icon>
				</button>
				<button md-button md-raised-button type="button" (click)="copyLink()" color="accent">
					<md-icon>content_copy</md-icon>
					Copy Link
				</button>
				<button md-raised-button md-button type="button" (click)="dialogRef.close(link !== undefined)">
					Close
				</button>
			</md-card-actions>
		</md-card>
	`,
	styleUrls: ['challenge-share-dialog.scss']
})
export class ChallengeShareDialogComponent implements OnInit, AfterViewInit {
	link: string
	
	constructor(public dialogRef: MdDialogRef<ChallengeShareDialogComponent>, public http: Http, public challenges: ChallengesService) {
	}
	
	ngOnInit() {
	}
	
	ngAfterViewInit() {
	}
	
	socialShare(target: any) {
		window.ga('send', 'event', 'challenge', 'challenge-shared')
		const sharer = new Sharer(target._elementRef.nativeElement)
		sharer.share()
	}
	
	createShareableLink(challenge: Challenge) {
		let encodedChallenge = this.challenges.encodeChallenge(challenge)
		this.link = document.location.origin + '/i?' + encodedChallenge
	}

	copyLink() {
		window.ga('send', 'event', 'challenge', 'challenge-shared')
		let copyTextarea = document.querySelector('#link') as HTMLTextAreaElement
		copyTextarea.select()
		
		try {
			document.execCommand('copy')
		} catch (err) {
			console.log('Oops, unable to copy', err)
		}
	}
}
