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

	useEffect(() => {
		const getRoomCondition: SearchOptions = {
			room_type: category,
		} as any
		getInitialRoom(getRoomCondition)
	}, [category])

	const { homeStayList, updateHomestayList } = useHomestayStore()

	useEffect(() => {
		getInitialRoom()
	}, [])

	const getInitialRoom = async (
		getRoomCondition: SearchOptions = {} as any
	) => {
		// const res = await RoomAPI.getRoom(getRoomCondition)
		const res = {rooms: [{
			_id: "1",
			name: "Đình Lân",
			summary: "Best seller",
			transit: "transit",
			house_rules: "house rules",
			price: 110,
			bookedDate: ['2025/1/2']},
		{
			_id: "1",
			name: "Đình Lân",
			summary: "Best seller",
			transit: "transit",
			house_rules: "house rules",
			price: 120,
			bookedDate: ['2025/1/2']},
		{
			_id: "1",
			name: "Đình Lân",
			summary: "Best seller",
			transit: "transit",
			house_rules: "house rules",
			price: 130,
			bookedDate: ['2025/1/2']},
		{
			_id: "1",
			name: "Đình Lân",
			summary: "Best seller",
			transit: "transit",
			house_rules: "house rules",
			price: 140,
			bookedDate: ['2025/1/2']}]}
		updateHomestayList(res?.rooms || [])
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<View
				style={{
					flex: 1,
					marginTop: 150,
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
				<ListingBottomSheet
					listing={homeStayList}
					category={category}
				/>
			</View>
		</GestureHandlerRootView>
	)
}

export default HomePage
