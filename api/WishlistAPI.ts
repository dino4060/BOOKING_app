import { InternetException } from "@/assets/data/default"
import {
	TApiResFail,
	TApiResSuccess,
	TPageData,
	TPageParam,
} from "@/interface/Base"
import {
	TLikedRoom,
	TLikedRoomParam,
} from "@/interface/WishlistType"
import { getValueSecureStore } from "@/store/SecureStore"
import { axiosClient } from "./AxiosClient"

export const WishlistAPI = {
	likeRoom: async (roomId: number) => {
		const token = await getValueSecureStore("token")

		try {
			const response = await axiosClient.post(
				`/api/wish-lists/rooms/${roomId}`,
				{},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			)
			return response.data as TApiResSuccess<{}>
		} catch (error: any) {
			if (error.response) {
				return error.response.data as TApiResFail
			}
			return InternetException
		}
	},
	unlikeRoom: async (roomId: number) => {
		const token = await getValueSecureStore("token")

		try {
			const response = await axiosClient.delete(
				`/api/wish-lists/rooms/${roomId}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			)
			return response.data as TApiResSuccess<{}>
		} catch (error: any) {
			if (error.response) {
				return error.response.data as TApiResFail
			}
			return InternetException
		}
	},
	hasLikeRoom: async (roomId: number) => {
		const token = await getValueSecureStore("token")

		try {
			const response = await axiosClient.get(
				`/api/wish-lists/rooms/${roomId}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			)
			return response.data as TApiResSuccess<boolean>
		} catch (error: any) {
			if (error.response) {
				return error.response.data as TApiResFail
			}
			return InternetException
		}
	},
	paginateRooms: async (params?: Partial<TPageParam>) => {
		const token = await getValueSecureStore("token")

		try {
			const response = await axiosClient.get(
				"/api/wish-lists/rooms",
				{
					params: {
						page: params?.page ?? 1,
						size: params?.size ?? 100,
						sort: params?.sort ?? "id",
						direction: params?.direction ?? "DESC",
					},
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			)
			return response.data as TApiResSuccess<
				TPageData<TLikedRoom>
			>
		} catch (error: any) {
			if (error.response) {
				return error.response.data as TApiResFail
			}
			return InternetException
		}
	},
	listRooms: async (param?: TLikedRoomParam) => {
		const token = await getValueSecureStore("token")

		try {
			const response = await axiosClient.get(
				"/api/wish-lists/rooms",
				{
					params: {
						"non-page": true,
						destination: param?.destination || undefined,
					},
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			)
			return response.data as TApiResSuccess<TLikedRoom[]>
		} catch (error: any) {
			if (error.response) {
				return error.response.data as TApiResFail
			}
			return InternetException
		}
	},
}
