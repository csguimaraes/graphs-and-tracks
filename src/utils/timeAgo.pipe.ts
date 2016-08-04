import { Pipe, PipeTransform } from '@angular/core'
import * as moment from 'moment'

@Pipe({ name: 'ago' })
export class TimeAgoPipe implements PipeTransform {
	transform(value: string, args: any[]): string {
		// TODO: edit moment localization strings
		let timeAgo = moment(value).fromNow()
		if (timeAgo === 'a few seconds ago') {
			timeAgo = 'just now'
		}
		return timeAgo
	}
}
