import { axiosClient } from "./AxiosClient"

export const UserAPI = {
	login: async (email: string, password: string) => {
		try {
			const response = await axiosClient.post(
				"/auth/signIn",
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
			return response
		} catch (error) { }
	},
	register: async (
		email: string,
		name: string,
		password: string,
		phone_number: string
	) => {
		const response = await axiosClient.post(
			"/auth/signUp",
			{
				email,
				name,
				password,
				phone_number,
			},
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				},
			}
		)
		return response
	},
	forgetPassword: async (email: string) => {
		const response = await axiosClient.post(
			"/auth/forgotPassword",
			{
				email,
			},
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				},
			}
		)
		console.log(response)
		return response.data
	},
	verityOtp: async (OTP: string, email: string) => {
		const response = await axiosClient.post(
			"/auth/checkOtp",
			{
				OTP,
				email,
			},
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				},
			}
		)
		return response.data
	},

	updateUser: async (uri: string, token: string, id: string) => {
		const formData = new FormData();
		formData.append('file', { uri: uri, name: 'photo.jpg', type: 'image/jpeg' } as any);
		formData.append('id', id);
		try {
			const response = await axiosClient.post('/user/update', formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${token}`,
				},
			});
			console.log('Image upload response:', response.data);
			return response.data;
		} catch (error) {
			console.error('Image upload error:', error);
		}
	},

	updateName: async (name: string, token: string, id: string) => {
		const response = await axiosClient.post(
			"/user/updateName",
			{
				name,
				id
			},
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		)
		return response.data
	}
}
