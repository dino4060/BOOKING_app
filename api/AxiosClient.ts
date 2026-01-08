import axios from "axios"

export const axiosClient = axios.create({
	baseURL: "http://10.62.105.245:8080", // process.env.API_BASE_URL,
})
