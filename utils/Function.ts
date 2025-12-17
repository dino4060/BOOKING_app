import { UserAPI } from "@/api/UserAPI"
import { WishlistAPI } from "@/api/WishlistAPI"
import {
	getValueSecureStore,
	saveValueSecureStore,
} from "@/store/SecureStore"
import { User } from "@/store/useUserStore"

export const WishlistHandle = {
	addToWishList: async (room_id: string) => {
		const token = await getValueSecureStore("token")
		const _id = await getValueSecureStore("id")
		const res = await WishlistAPI.addToWishlist(
			_id as string,
			room_id,
			token as string
		)
	},
	getWishList: async () => {
		const token = await getValueSecureStore("token")
		const _id = await getValueSecureStore("id")

		const res = await WishlistAPI.getWishListByUserId(
			_id as string,
			token as string
		)

		return res.data
	},
	removeFromWishList: async (room_id: string) => {
		const token = await getValueSecureStore("token")
		const _id = await getValueSecureStore("id")
		await WishlistAPI.removeFromWishlist(
			_id as string,
			room_id,
			token as string
		)
	},
}

export const AuthHandle = {
	login: async (email_: string, password: string) => {
		try {
			const res = await UserAPI.login(email_, password)

			if (res?.status !== 200) return null

			const { _id, name, email, phone_number, created_at, profile_image } =
				res?.data?.data

			const user: User = {
				_id,
				token: res.data.token,
				username: name,
				email,
				phoneNumber: phone_number,
				isLogin: true,
				profile_image: profile_image,
				created_at,
			}

			await saveValueSecureStore("token", res.data.token)
			await saveValueSecureStore("id", _id)
			return user
		} catch (error) {
			console.log(error)
			return null
		}
	},
}
