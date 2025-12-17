import { axiosClient } from "./AxiosClient"

export const HostAPI = {
	getHostInformation: async (id: string) => {
		const result = await axiosClient.get(
			`/user/host?user_id=${id}`
		)
		if (result.status === 200) return result
	},
}
