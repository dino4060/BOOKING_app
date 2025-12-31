import { TRoom } from "./RoomType"

export interface User {
	_id: string
	name: string
	email: string
	phone: string
	createdAt?: Date
	username?: string
	avatarUrl?: string
	isLogin: boolean
}

export interface THost {
	user: User
	hostedList: TRoom[]
}

export type TAuth = {
	accessToken: string
	currentUser: User
}
