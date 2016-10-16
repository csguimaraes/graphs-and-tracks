import { transition, style, animate } from '@angular/core'
export const SWITCH_DURATION = 300

export const SWITCH_ANIMATION = [
	transition('void => toRight', [ // Entering from right
		style({ transform: 'translateX(-100%) scale(.2)', opacity: 0.0 }),
		animate(`${SWITCH_DURATION}ms ease-out`, style({ transform: 'translateX(0%) scale(1)', opacity: 1.0 }))
	]),
	transition('void => toLeft', [ // Entering from left
		style({ transform: 'translateX(100%) scale(.2)', opacity: 0.0 }),
		animate(`${SWITCH_DURATION}ms ease-out`, style({ transform: 'translateX(0%) scale(1)', opacity: 1.0 }))
	]),
	transition('toRight => void', [ // Leaving from right
		animate(`${SWITCH_DURATION}ms ease-in`, style({ transform: 'translateX(100%) scale(.6)', opacity: 0.0 }))
	]),
	transition('toLeft => void', [ // Leaving from left
		animate(`${SWITCH_DURATION}ms ease-in`, style({ transform: 'translateX(-100%) scale(.6)', opacity: 0.0 }))
	])
]
