import { InternetException } from "@/assets/data/default"
import { ApiRes, TApiResFail } from "@/interface/API"
import { TAuth } from "@/interface/User"
import { axiosClient } from "./AxiosClient"

export const UserAPI = {
	login: async (email: string, password: string) => {
		try {
			const response = await axiosClient.post(
				"/api/public/auth/login/email",
				{
					email,
					password,
				},
				{
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					},
				}
			)
			return response.data as ApiRes<TAuth>
		} catch (error: any) {
			if (error.response) {
				console.error("Backend error:", error.response.data)
				return error.response.data as TApiResFail
			}
			return InternetException
		}
	},
	register: async (
		name: string,
		email: string,
		phone: string,
		password: string
	) => {
		try {
			const response = await axiosClient.post(
				"/api/public/auth/register",
				{
					email,
					name,
					password,
					phone,
				},
				{
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
					},
				}
			)
			return response.data as ApiRes<TAuth>
		} catch (error: any) {
			if (error.response) {
				console.error("Backend error:", error.response.data)
				return error.response.data as TApiResFail
			}
			return InternetException
		}
	},
}
