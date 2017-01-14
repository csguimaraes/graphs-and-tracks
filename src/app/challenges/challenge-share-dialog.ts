import { Component, OnInit, AfterViewInit } from '@angular/core'
import { MdDialogRef } from '@angular/material'
import { Http } from '@angular/http'
import { Challenge } from '../shared/types'
import { ChallengesService } from '../shared/challenges.service'

const Sharer: any = require('sharer.npm.js')

@Component({
	selector: 'gt-challenge-share',
	templateUrl: 'challenge-share-dialog.html',
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
