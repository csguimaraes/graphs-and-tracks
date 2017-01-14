import { Component, OnInit, AfterViewInit } from '@angular/core'
import { MdDialogRef } from '@angular/material'

declare let d3

@Component({
	selector: 'gt-confirmation-dialog',
	template: `
		<md-card>
			<md-card-content [innerHTML]="message"></md-card-content>
			<md-card-actions>
				<button *ngIf="action" md-button md-raised-button type="button" (click)="dialogRef.close(true)" [color]="color">
					<md-icon *ngIf="icon">{{ icon }}</md-icon>
					{{ action }}
				</button>
				<button md-button type="button" (click)="dialogRef.close(false)">
					{{ action ? 'Cancel' : 'Ok' }}
				</button>
			</md-card-actions>
		</md-card>
	`
})
export class ConfirmationDialogComponent implements OnInit, AfterViewInit {
	message: string
	icon: string
	action: string
	color: string = 'accent'
	
	constructor(public dialogRef: MdDialogRef<ConfirmationDialogComponent>) { }
	
	ngOnInit() {
	}
	
	ngAfterViewInit() {
	}
}
