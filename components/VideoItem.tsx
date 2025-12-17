import { VideoModel } from "@/interface/Video"
import { ResizeMode, Video } from "expo-av"
import { router } from "expo-router"
import React, { useEffect, useRef } from "react"
import {
	Dimensions,
	LogBox,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native"
LogBox.ignoreLogs(["Warning: ..."]) // Ignore log notification by message
LogBox.ignoreAllLogs() //Ignore all log notifications

type Props = {
	video: VideoModel
	isActive: boolean
}

const VideoItem = ({ video, isActive }: Props) => {
	const videoRef = useRef<Video>(null)

	useEffect(() => {
		check()
	}, [isActive])

	const check = async () => {
		try {
			const video = videoRef.current
			if (video) {
				if (isActive) {
					video.playAsync()
				} else {
					video.pauseAsync()
				}
			}
		} catch (error) {}
	}

	return (
		<View style={styles.container}>
			<TouchableOpacity
				onPress={() =>
					router.push(`/listing/${video.room_id}`)
				}
				style={{
					position: "absolute",
					paddingHorizontal: 10,
					zIndex: 10,
					bottom: "50%",
					right: 0,
					borderTopLeftRadius: 20,
					borderBottomLeftRadius: 20,
					backgroundColor: "#ffffff50",
				}}
			>
				<Text
					style={{
						fontFamily: "damion",
						fontSize: 25,
						color: "white",
					}}
				>
					View Room
				</Text>
			</TouchableOpacity>
			<Video
				volume={1}
				ref={videoRef}
				source={{ uri: video.uri }}
				style={styles.video}
				isLooping
				resizeMode={ResizeMode.COVER}
				useNativeControls={false}
				onError={(error) => {
					console.error("Error loading video:", error)
				}}
			/>
		</View>
	)
}

export default VideoItem

const styles = StyleSheet.create({
	container: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
	},
	video: {
		width: "100%",
		height: "100%",
	},
})
