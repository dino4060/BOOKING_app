import { RoomAPI } from "@/api/RoomAPI"
import ExploreHeader from "@/components/ExploreHeader"
import ListingContent from "@/components/ListingContent"
import ListingMap from "@/components/ListingMap"
import { SearchOptions } from "@/interface/SearchOptions"
import { useHomestayStore } from "@/store/useHomestayStore"
import { Stack } from "expo-router"
import { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"

const HomePage = () => {
	const [category, setCategory] =
		useState<string>("Tiny homes")

	const onDataChanged = (category: string) => {
		setCategory(category)
	}

	// useEffect(() => {
	// 	const roomQuery = {
	// 		room_type: category,
	// 	} as any
	// 	getInitialRoom(roomQuery)
	// }, [category])

	const { homeStayList, updateHomestayList } =
		useHomestayStore()

	useEffect(() => {
		getRooms()
	}, [])

	const getRooms = async (
		roomQuery: SearchOptions = {} as any
	) => {
		const res = (await RoomAPI.listRooms(roomQuery)) || []
		if (res.success == false) return
		updateHomestayList(res.data || [])
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<View
				style={{
					flex: 1,
					marginTop: 180,
					backgroundColor: "#fff",
				}}
			>
				<Stack.Screen
					options={{
						header: () => (
							<ExploreHeader
								onCategoryChanged={onDataChanged}
							/>
						),
					}}
				/>

				<ListingMap listings={homeStayList} />

				<ListingContent
					listings={homeStayList}
					category={category}
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
