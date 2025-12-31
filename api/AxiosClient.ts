import axios from "axios"

export const axiosClient = axios.create({
	baseURL: "http://10.190.62.55:8080", // process.env.API_BASE_URL,
})
