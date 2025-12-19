import { ROOM_DATA } from "@/assets/data/room"
import ExploreHeader from "@/components/ExploreHeader"
import ListingBottomSheet from "@/components/ListingBottomSheet"
import ListingMap from "@/components/ListingMap"
import { SearchOptions } from "@/interface/SearchOptions"
import { useHomestayStore } from "@/store/useHomestayStore"
import { Stack } from "expo-router"
import React, { useEffect, useState } from "react"
import { View } from "react-native"
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
		getInitialRoom()
	}, [])

	const getInitialRoom = async (
		roomQuery: SearchOptions = {} as any
	) => {
		// const res = await RoomAPI.getRoom(roomQuery)
		// updateHomestayList(res?.rooms || [])
		updateHomestayList(ROOM_DATA || [])
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

				{/* <ListingMap listings={homeStayList} /> */}
				<ListingBottomSheet
					listing={homeStayList}
					category={category}
				/>
			</View>
		</GestureHandlerRootView>
	)
}

export default HomePage
