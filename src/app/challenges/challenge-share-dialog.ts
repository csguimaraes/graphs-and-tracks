import { Component, OnInit, AfterViewInit } from '@angular/core'
import { MdDialogRef } from '@angular/material'
import { Http } from '@angular/http'

const Sharer: any = require('sharer.npm.js')
// const API_KEY = 'AIzaSyDFwVfC_4Y2JT_K5JYd2XsogtDCSPOTlsI'
const OPTIONS_STORAGE_KEY = 'share-options'
export interface ChallengeShareOptions {
	email: string,
	stats: boolean
}

@Component({
	selector: 'gt-challenge-share',
	template: `
		<md-card [class.working]="creating">
			<md-card-title>Share Challenge</md-card-title>
			<md-card-content>
				<template [ngIf]="!link">
					Send this challenge to others and see if they can beat it.
					<br><br>
					<md-checkbox [(ngModel)]="options.stats">
						Allow them to send the results to my email
					</md-checkbox>
					<br>
					<md-input *ngIf="options.stats" id="mailto" maxlength="16" placeholder="Your email address" [(ngModel)]="options.email"></md-input>
				</template>
				<template [ngIf]="link">
					Here is the link for your challenge: <br>
						<pre class="selectable">{{ link }}</pre>
				</template>
			</md-card-content>
			<md-card-actions>
				<template [ngIf]="link">
					<button #twitterButton md-button md-raised-button type="button" (click)="socialShare(twitterButton)"
					class='sharer button with-icon twitter'
					data-sharer='twitter'
					data-title='Challenge accepted?'
					[attr.data-url]='link'
					>
						<md-icon svgSrc="/img/twitter.svg"></md-icon>
					</button>
					<button #facebookButton md-button md-raised-button type="button" (click)="socialShare(facebookButton)"
					class='sharer button with-icon facebook'
					data-sharer='facebook'
					data-title='Challenge accepted?'
					[attr.data-url]='link'
					>
						<md-icon svgSrc="/img/facebook.svg"></md-icon>
					</button>
					<button #gplusButton md-button md-raised-button type="button" (click)="socialShare(gplusButton)"
					class='sharer button with-icon gplus'
					data-sharer='googleplus'
					data-title='Challenge accepted?'
					[attr.data-url]='link'
					>
						<md-icon svgSrc="/img/gplus.svg"></md-icon>
					</button>
					<button md-button md-raised-button type="button" (click)="copyLink()" color="accent">
						<md-icon>content_copy</md-icon>
						Copy Link
					</button>
				</template>
				<button *ngIf="!link" md-button md-raised-button type="button" (click)="generateLink()" color="accent">
					<md-icon>{{ creating ? 'hourglass_empty' : 'link' }}</md-icon>
					{{ creating ? 'Working' : 'Create Link' }}
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
	creating = false
	options: ChallengeShareOptions
	
	constructor(public dialogRef: MdDialogRef<ChallengeShareDialogComponent>, public http: Http) {
		this.options = OPTIONS_STORAGE_KEY in localStorage ?
			<ChallengeShareOptions> JSON.parse(localStorage.getItem(OPTIONS_STORAGE_KEY)) :
			{
				stats: false,
				email: '',
			}
	}
	
	ngOnInit() {
	}
	
	ngAfterViewInit() {
	}
	
	socialShare(target: any) {
		const sharer = new Sharer(target._elementRef.nativeElement)
		sharer.share()
	}
	
	generateLink() {
		this.creating = true
		// 1479370316090|snoflake@gmail.com|Carlos Guimaraes|-6,45,1,2,3,4,5,6|the hue master'
		setTimeout(() => {
			this.creating = false
			this.link = document.location.origin + '/i?Dsdd82j'
		}, 5000)
		// this.shorten(longLink)
	}
	
	copyLink() {
		// TODO
	}
	
	/*private shorten(url: string) {
	 let headers = new Headers({ 'Content-Type': 'application/json' })
	 let options = new RequestOptions({ headers: headers })
	 
	 let params = {
	 longUrl: url,
	 key: API_KEY
	 }
	 
	 return this.http.post('https://www.googleapis.com/urlshortener/v1/url', JSON.stringify(params), options)
	 .map((response: Response) => {
	 console.log(response)
	 this.creating = false
	 let body = response.json()
	 console.log(body)
	 })
	 .subscribe(
	 data => console.info(data),
	 err => console.log(err),
	 () => console.log('Authentication Complete')
	 )
	 }*/
}
