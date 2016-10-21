export interface User {
	id: string
	username: string
	avatarUrl: string
	settings: UserSettings
}

export interface UserSettings {
	effects: boolean
	animationDuration: number
}


export interface AppLink {
	icon: string
	name: string
	subtitle?: string
	route: string
}
