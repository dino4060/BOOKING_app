import { DMS } from "@/interface/common"
import { axiosClient } from "./AxiosClient"

const LocationAPI = {
	searchLocation: async (where: string): Promise<DMS> => {
		const url = `https://api.opencagedata.com/geocode/v1/json?q=${where}&key=2ebbe24f878d42b09412bc893e756b18`
		try {
			const response: any = await axiosClient.get(url)
			const DMS =
				response?.data?.results?.[0]?.annotations?.DMS
			if (!DMS) {
				return {
					la: NaN,
					long: NaN,
				}
			}
			const { lat, lng } = DMS
			const latitude = dmsToDecimal(lat)
			const longitude = dmsToDecimal(lng)

			return {
				la: latitude,
				long: longitude,
			}
		} catch (error) {
			// Handle error
			console.error("Error fetching location:", error)
			throw error
		}
	},
}
export default LocationAPI

const dmsToDecimal = (dms: string) => {
	const parts = dms.split(/[^\d\w.]+/)

	const degrees = parseFloat(parts[0])
	const minutes = parseFloat(parts[1])
	const seconds = parseFloat(parts[2])
	const direction = parts[3]

	// Calculate decimal degrees
	let decimal = degrees + minutes / 60 + seconds / 3600

	if (direction === "S" || direction === "W") {
		decimal = -decimal
	}

	return decimal
}
