import { MotionData } from '../types'

export function printDataTable(data: MotionData[], type: string) {
	let w = window.open('', '', 'width=300,height=500,resizeable,scrollbars')
	w.document.write(`<h3>Motion data generated for challenge ${type}</h3>`)
	w.document.write(`
	<table border="1">
		<thead>
			<tr>
				<th>#</th>
				<th>T</th>
				<th>S</th>
				<th>V</th>
				<th>A</th>
			</tr>
		</thead>
	<tbody>
	`)


	let i = 0
	for (let d of data) {
		i++
		w.document.write(`
			<tr>
				<td>${i}</td>
				<td>${d.t.toFixed(2)}</td>
				<td>${d.s.toFixed(2)}</td>
				<td>${d.v.toFixed(2)}</td>
				<td>${d.a.toFixed(2)}</td>
			</tr>
		`)
	}

	w.document.write('</tbody></table>')
	w.document.close()
}
