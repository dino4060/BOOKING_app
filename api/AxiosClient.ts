import axios from "axios"

export const axiosClient = axios.create({
	baseURL: "http://" + "10.0.229.52" + ":5000",
})
