import { User } from "./Host"

export type Room = {
	// Required fields
	_id: number
	id: number
	isDeleted: boolean
	name: string
	highlight: string
	detail: string
	street: string
	country: string
	latitude: number
	longitude: number
	roomType: string
	bathRooms: number
	isPrivateBathrooms: boolean
	bedRooms: number
	beds: number
	isCoupleBed: boolean
	price: number
	reviewStars: number
	thumbnailUrls: string[]
	bookedDates: string[]
	amenities: string[]

	// Optional/Nullable fields
	createdAt?: string | null
	updatedAt?: string | null
	transit?: string | null
	houseRules?: string | null
	host?: User | null
	smartLocation?: string | null
	weeklyPrice?: number | null
}
