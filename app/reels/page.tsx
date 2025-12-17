import React, { useState, useRef, useCallback } from "react"
import {
	View,
	Text,
	Dimensions,
	FlatList,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Stack } from "expo-router"
import VideoItem from "@/components/VideoItem"

const videoData = [
	{
		id: 1,
		uri: "https://firebasestorage.googleapis.com/v0/b/airbnb-1c2db.appspot.com/o/video%201.mp4?alt=media&token=800a3caa-b5d2-4346-bc2c-eab3bba2797f",
		room_id: "6638512222b931bfd0b90490",
	},
	{
		id: 2,
		uri: "https://firebasestorage.googleapis.com/v0/b/airbnb-1c2db.appspot.com/o/video%202.mp4?alt=media&token=80b48f58-0ba7-4adf-b223-216230400456",
		room_id: "66359c142516b6d56dc6f51b",
	},
	{
		id: 3,
		uri: "https://firebasestorage.googleapis.com/v0/b/airbnb-1c2db.appspot.com/o/video%203.mp4?alt=media&token=43596091-6421-4311-a85a-25d3c287eb3c",
		room_id: "66359df42516b6d56dc6f51f",
	},
	{
		id: 4,
		uri: "https://firebasestorage.googleapis.com/v0/b/airbnb-1c2db.appspot.com/o/video%204.mp4?alt=media&token=75722959-826f-4c88-b5b4-c90f86971cd4",
		room_id: "66384dc018210d43acc403e0",
	},
	{
		id: 5,
		uri: "https://firebasestorage.googleapis.com/v0/b/airbnb-1c2db.appspot.com/o/video%205.mp4?alt=media&token=459a1378-bdc0-4000-ab82-6260ddc2ff32",
		room_id: "663852ac22b931bfd0b9049c",
	},
]

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } =
	Dimensions.get("window")

const Page = () => {
	const [activeVideoIndex, setActiveVideoIndex] =
		useState(0)
	const viewabilityConfig = useRef({
		itemVisiblePercentThreshold: 50,
	}).current

	const onViewableItemsChanged = useCallback(
		({ viewableItems }: any) => {
			if (viewableItems.length > 0) {
				setActiveVideoIndex(viewableItems[0].index)
			}
		},
		[]
	)
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Stack.Screen
				options={{
					header: () => <></>,
				}}
			/>
			<FlatList
				data={videoData}
				pagingEnabled
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item, index }) => (
					<VideoItem
						video={item}
						isActive={activeVideoIndex === index}
					/>
				)}
				onViewableItemsChanged={onViewableItemsChanged}
				viewabilityConfig={viewabilityConfig}
			/>
		</SafeAreaView>
	)
}

export default Page
