import { InternetException } from "@/assets/data/default"
import { TApiRes, TApiResFail } from "@/interface/Base"
import { TRoom, TRoomParam } from "@/interface/RoomType"
import { axiosClient } from "./AxiosClient"

export const RoomAPI = {
	listRooms: async (param?: TRoomParam) => {
		try {
			const response = await axiosClient.get(
				"/api/public/rooms",
				{
					params: {
						destination: param?.destination || undefined,

						"min-price": param?.minPrice || undefined,
						"max-price": param?.maxPrice || undefined,

						bedrooms: param?.bedRooms || undefined,
						beds: param?.beds || undefined,
						"is-couple-bed":
							param?.isCoupleBed ?? undefined,
						bathrooms: param?.bathRooms || undefined,
						"is-private-bathrooms":
							param?.isPrivateBathrooms ?? undefined,

						"start-date": param?.startDate || undefined,
						"end-date": param?.endDate || undefined,
					},
				}
			)
			return response.data as TApiRes<TRoom[]>
		} catch (error: any) {
			console.error(error)
			if (error.response) {
				return error.response.data as TApiResFail
			}
			return InternetException
		}
	},
	getRoom: async (id: number) => {
		try {
			const response = await axiosClient.get(
				`/api/public/rooms/${id}`
			)
			return response.data as TApiRes<TRoom>
		} catch (error: any) {
			console.error(error)
			if (error.response) {
				return error.response.data as TApiResFail
			}
			return InternetException
		}
	},
}
