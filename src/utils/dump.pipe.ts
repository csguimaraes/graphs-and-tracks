import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'dump' })
export class DumpPipe implements PipeTransform {
	transform(value: any, args: any[]): string {
		return JSON.stringify(value)
	}
}
