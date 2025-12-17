import { axiosClient } from "./AxiosClient"

export const WishlistAPI = {
	getWishListByUserId: async (
		user_id: string,
		token: string
	) => {
		try {
			const url = `/wishList/getWishList?user_id=${user_id}`
			console.log("user_id ", user_id)
			console.log("token ", token)
			const res = await axiosClient.get(url, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			console.log("status: ", res.status)
			return res.data
		} catch (error) {
			return { data: [] }
		}
	},
	addToWishlist: async (
		user_id: string,
		room_id: string,
		token: string
	) => {
		try {
			const res = await axiosClient.post(
				"/wishList/addWishList",
				{
					user_id,
					room_id,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				}
			)
			if (res.status === 201) return res
		} catch (error) {
			console.log("error at add to wishlist: ", error)
		}
	},
	removeFromWishlist: async (
		user_id: string,
		room_id: string,
		token: string
	) => {
		try {
			const url = `/wishList/removeWishList?user_id=${user_id}&room_id=${room_id}`
			console.log("url remove wishlist=>>", url)
			const res = await axiosClient.delete(url, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			})

			console.log("res at remove wishlist =>>>>", res)
		} catch (error) {
			console.log("res at call remove wishlist =>>>", error)
		}
	},
}
