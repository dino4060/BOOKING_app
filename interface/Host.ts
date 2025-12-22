import { Room } from "./Room"

export interface User {
	_id: string
	name: string
	email: string
	password: string
	createdAt?: Date
	phone?: string
}

export interface Host {
	user: User
	hostedList: Room[]
}
