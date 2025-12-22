import { InternetException } from "@/assets/data/api"
import { ApiRes } from "@/interface/API"
import { Room } from "@/interface/Room"
import { SearchOptions } from "@/interface/SearchOptions"
import { axiosClient } from "./AxiosClient"

const RoomPublicApi = "/api/public/rooms"

export const RoomAPI = {
	listRooms: async (
		getRoomCondition: SearchOptions | null
	) => {
		try {
			const route = `${RoomPublicApi}`
			const res = await axiosClient.get(route)
			return res.data as ApiRes<Room[]>
		} catch (error) {
			console.error(error)
			return InternetException
		}
	},
	getRoomById: async (id: number) => {
		try {
			const route = `${RoomPublicApi}/${id}`
			const res = await axiosClient.get(route)
			return res.data as ApiRes<Room>
		} catch (error) {
			console.log(error)
			return InternetException
		}
	},
	reservation: async (
		user_id: string,
		room_id: string,
		start_date: string,
		end_date: string,
		token: string
	) => {
		const result = await axiosClient.post(
			"/booking/bookRoom",
			{
				user_id,
				room_id,
				start_date,
				end_date,
			},
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		)

		if (result.status === 201) return true
		else return false
	},
	getReservationRoomByUserId: async (
		user_id: string,
		token: string
	) => {
		try {
			const url = `/booking/getTrip?user_id=${user_id}`
			const response = await axiosClient.get(url, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})

			if (response.status === 200) {
				return response.data.data
			}
		} catch (error) {
			console.log(
				"error at get reservation by user_id ",
				error
			)
		}
	},
}

/**
 * GET /booking/getTrip (user_id) --> get trips of user by id
 *
 *
 *
 *
 *
 */
