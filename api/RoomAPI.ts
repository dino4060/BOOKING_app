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
						destination: param?.destination,
						"min-price": param?.minPrice,
						"max-price": param?.maxPrice,
					},
				}
			)
			return response.data as TApiRes<TRoom[]>
		} catch (error: any) {
			console.error(error)
			if (error.response) {
				console.error("BE error:", error.response.message)
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
				console.error("BE error:", error.response.message)
				return error.response.data as TApiResFail
			}
			return InternetException
		}
	},
}
