import { User } from "./UserType"

export type TRoom = {
	_id: number
	id: number
	isDeleted: boolean
	createdAt: string
	updatedAt: string
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
	destination: string
	thumbnailUrls: string[]
	bookedDates: string[]
	amenities: string[]

	transit?: string | null
	houseRules?: string | null
	host?: User | null
	weeklyPrice?: number | null
}

export type TRoomShort = Omit<
	TRoom,
	"bookedDates" | "amenities"
>

export type TRoomParam = Partial<
	Pick<
		TRoom,
		| "destination"
		| "bedRooms"
		| "beds"
		| "isCoupleBed"
		| "bathRooms"
		| "isPrivateBathrooms"
	>
> & {
	minPrice?: number
	maxPrice?: number
	startDate?: string // Format: YYYY-MM-DD
	endDate?: string // Format: YYYY-MM-DD
}

export type TDestination = {
	name: string
	icon: string
	coordinates: {
		latitude: number
		longitude: number
	}
}

export const DestinationList: TDestination[] = [
	{
		name: "Cần Thơ",
		icon: "waves",
		coordinates: {
			latitude: 9.9333,
			longitude: 105.7833,
		},
	},
	{
		name: "Đà Lạt",
		icon: "local-florist",
		coordinates: {
			latitude: 11.8404,
			longitude: 108.4583,
		},
	},
	{
		name: "Nha Trang",
		icon: "beach-access",
		coordinates: {
			latitude: 12.1451,
			longitude: 109.1943,
		},
	},
	{
		name: "Đà Nẵng",
		icon: "location-city",
		coordinates: {
			latitude: 15.9971,
			longitude: 108.2062,
		},
	},
	{
		name: "Huế",
		icon: "fort",
		coordinates: {
			latitude: 16.4137,
			longitude: 107.5909,
		},
	},
	{
		name: "Hạ Long",
		icon: "sailing",
		coordinates: {
			latitude: 20.9001,
			longitude: 107.0733,
		},
	},
]
