import { RoomAPI } from "@/api/RoomAPI"
import ExploreHeader from "@/components/ExploreHeader"
import ListingContent from "@/components/ListingContent"
import ListingMap from "@/components/ListingMap"
import {
	DestinationList,
	TDestination,
	TRoomParam,
} from "@/interface/RoomType"
import { useHomestayStore } from "@/store/useHomestayStore"
import { Stack } from "expo-router"
import { useEffect, useState } from "react"
import { Alert, StyleSheet, View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"

const HomePage = () => {
	const {
		homeStayList,
		updateHomestayList,
		homeStayParam,
		updateHomestayParam,
	} = useHomestayStore()
	const [destination, setDestination] =
		useState<TDestination>(DestinationList[1])

	useEffect(() => {
		const listRooms = async (roomParam?: TRoomParam) => {
			const res = (await RoomAPI.listRooms(roomParam)) || []
			if (res.success === false) {
				console.error("API error: ", res.message)
				Alert.alert("Có lỗi", res.message)
				return
			}
			updateHomestayList(res.data)
		}

		console.info(homeStayParam)

		listRooms({
			// destination: destination.name,
			...homeStayParam,
		})
	}, [homeStayParam])

	useEffect(() => {
		updateHomestayParam({
			...homeStayParam,
			destination: destination.name,
		})
	}, [destination])

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<View
				style={{
					flex: 1,
					marginTop: 165,
					backgroundColor: "#fff",
				}}
			>
				<Stack.Screen
					options={{
						header: () => (
							<ExploreHeader
								destination={destination}
								setDestination={setDestination}
							/>
						),
					}}
				/>

				<ListingMap
					listings={homeStayList}
					destination={destination}
				/>

				<ListingContent
					listings={homeStayList}
					destination={destination}
				/>
			</View>
		</GestureHandlerRootView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 200,
	},
	contentContainer: {
		backgroundColor: "white",
	},
	itemContainer: {
		padding: 6,
		margin: 6,
		backgroundColor: "#eee",
	},
})

export default HomePage
