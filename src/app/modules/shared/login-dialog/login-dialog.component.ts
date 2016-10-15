import { Component } from '@angular/core'
import { MdDialogRef } from '@angular/material'

@Component({
	selector: 'gt-login-dialog',
	styleUrls: ['./login-dialog.component.scss'],
	templateUrl: './login-dialog.component.html'
})
export class LoginDialogComponent {
	constructor(public dialogRef: MdDialogRef<LoginDialogComponent>) {
	}
}
