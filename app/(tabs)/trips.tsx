import CommingTrip from "@/components/CommingTrip"
import { Booking } from "@/interface/Booking"
import { getValueSecureStore } from "@/store/SecureStore"
import { Stack } from "expo-router"
import React, { useEffect, useState } from "react"
import { View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
const Trips = () => {
	const [trips, setTrips] = useState<Booking | any>([])
	useEffect(() => {
		getTripsByUserId()
	}, [])

	const getTripsByUserId = async () => {
		const _id: any = await getValueSecureStore("id")
		const token: any = await getValueSecureStore("token")

		// const res = await RoomAPI.getReservationRoomByUserId(
		// 	_id,
		// 	token
		// )
		// setTrips(sortBookingsByStartDate(res))
	}
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaView style={{ flex: 1 }}>
				<Stack.Screen
					options={{
						header: () => <View></View>,
					}}
				></Stack.Screen>

				<CommingTrip trips={trips} />
			</SafeAreaView>
		</GestureHandlerRootView>
	)
}

export default Trips

function sortBookingsByStartDate(
	bookings: Booking[]
): Booking[] {
	return bookings.sort(
		(a, b) =>
			new Date(a.start_date).getTime() -
			new Date(b.start_date).getTime()
	)
}
