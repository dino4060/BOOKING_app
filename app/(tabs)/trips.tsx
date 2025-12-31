import { TripAPI } from "@/api/TripAPI"
import TripsContent from "@/components/TripsContent"
import { TTrip } from "@/interface/TripType"
import { getValueSecureStore } from "@/store/SecureStore"
import { useUserStore } from "@/store/useUserStore"
import { router, Stack } from "expo-router"
import React, { useEffect, useState } from "react"
import { View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"

const Trips = () => {
	const user = useUserStore((state) => state.user)
	const [trips, setTrips] = useState<TTrip[]>([])
	const [syncList, setSyncList] = useState<boolean>(false)

	useEffect(() => {
		if (user.isLogin === false) {
			router.push("/login")
		}

		const getTripsByUserId = async () => {
			const token: any = await getValueSecureStore("token")

			if (token === null) {
				console.error("Token is empty")
				return
			}

			const res = await TripAPI.listTrips(token)

			if (res.success === false) {
				console.error("API error: ", res.message)
				return
			}

			setTrips(res.data)
		}

		getTripsByUserId()
	}, [user, syncList])

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaView style={{ flex: 1 }}>
				<Stack.Screen
					options={{
						header: () => <View></View>,
					}}
				></Stack.Screen>

				<TripsContent
					trips={trips}
					setSyncList={setSyncList}
				/>
			</SafeAreaView>
		</GestureHandlerRootView>
	)
}

export default Trips
