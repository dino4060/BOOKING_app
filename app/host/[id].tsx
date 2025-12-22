import Colors from "@/constants/Colors"
import { Host } from "@/interface/Host"
import { Room } from "@/interface/Room"
import { Ionicons } from "@expo/vector-icons"
import {
	Link,
	Stack,
	useLocalSearchParams,
	useNavigation,
} from "expo-router"
// import {
// 	addDoc,
// 	collection,
// 	doc,
// 	getDocs,
// 	query,
// 	setDoc,
// 	where,
// } from "firebase/firestore"
import React, { useEffect, useState } from "react"
// import { db } from "@/firebase"
import { useUserStore } from "@/store/useUserStore"
import {
	Image,
	ListRenderItem,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native"
import {
	FlatList,
	GestureHandlerRootView,
} from "react-native-gesture-handler"
import Animated, {
	FadeIn,
	FadeOut,
} from "react-native-reanimated"
import { SafeAreaView } from "react-native-safe-area-context"

const DetailPage = () => {
	const navigation = useNavigation()
	const { id: hostID } = useLocalSearchParams()
	const { user } = useUserStore()
	const [host, setHost] = useState<Host>()
	useEffect(() => {
		getHostInfor(hostID as string)
	}, [])

	const getHostInfor = async (id: string) => {
		// const res = await HostAPI.getHostInformation(id);
		// setHost(res?.data?.data as any);
	}

	const handleOnMessage = async () => {
		// const currentTimestamp = new Date(); // Get the current time
		// const roomChatsRef = collection(db, "roomChats");
		// // Query to check if a room chat already exists
		// const roomChatQuery = query(
		//   roomChatsRef,
		//   where("host_id", "==", hostID),
		//   where("user_id", "==", user._id)
		// );
		// const querySnapshot = await getDocs(roomChatQuery);
		// let roomID;
		// if (querySnapshot.empty) {
		//   // Room chat does not exist, create a new one
		//   roomID = generateId();
		//   await addDoc(roomChatsRef, {
		//     host_id: hostID,
		//     room_id: roomID,
		//     user_id: user._id,
		//     created_At: currentTimestamp,
		//     host_infor: host?.user,
		//   });
		// } else {
		//   // Room chat exists, get the existing roomID
		//   querySnapshot.forEach((doc) => {
		//     roomID = doc.id;
		//   });
		// }
		// router.push(`/message/${roomID}`);
	}

	const renderRow: ListRenderItem<Room> = ({ item }) => (
		<Link href={`/listing/${item._id}`} asChild>
			<TouchableOpacity>
				<Animated.View
					style={styles.listingItem}
					entering={FadeIn}
					exiting={FadeOut}
				>
					<Animated.Image
						source={{ uri: item.thumbnail_urls?.[0] || "" }} // Provide an empty string as a fallback if thumbnail_url is null
						style={styles.imageItem}
					/>
					<TouchableOpacity
						style={{
							position: "absolute",
							right: 30,
							top: 30,
						}}
					>
						<Ionicons
							name='heart-outline'
							size={24}
							color='#000'
						/>
					</TouchableOpacity>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
						<Text
							style={{ fontSize: 16, fontFamily: "mon-sb" }}
						>
							{item.name}
						</Text>
						<View style={{ flexDirection: "row", gap: 4 }}>
							<Ionicons name='star' size={16} />
						</View>
					</View>

					<Text
						style={{
							fontFamily: "mon",
							textAlign: "center",
						}}
					>
						{item.room_type}
					</Text>
					<View
						style={{
							flexDirection: "row",
							gap: 4,
							justifyContent: "center",
						}}
					>
						<Text style={{ fontFamily: "mon-sb" }}>
							€ {item.price}
						</Text>
						<Text style={{ fontFamily: "mon" }}>night</Text>
					</View>
				</Animated.View>
			</TouchableOpacity>
		</Link>
	)

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Stack.Screen
				options={{
					header: () => <></>,
				}}
			></Stack.Screen>
			<SafeAreaView
				style={{ flex: 1, backgroundColor: "white" }}
			>
				<View
					style={{
						flexDirection: "column",
						padding: 10,
						backgroundColor: "#fff",
					}}
				>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							gap: 5,
							borderBottomColor: "#cccccc",
							paddingBottom: 15,
							borderBottomWidth: 2,
						}}
					>
						<Image
							source={{
								uri: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/398492825_2334225390300563_2757619712327292917_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHmYr9ejngbLlwuCZGfCHKAr_6mPp2vEOev_qY-na8Q50xDO-KX72UttaZUYEbB0Dx445OAGU5MUiGtLdSOlrLl&_nc_ohc=WXviCk5_sRYQ7kNvgEA2aQn&_nc_ht=scontent.fsgn19-1.fna&oh=00_AYAj_peJeFSCTDqA5GbahdBHH7RxJljR5lhDfJ1jz_FBwg&oe=66546604",
							}}
							style={[styles.image]}
							resizeMode='cover'
						/>

						<View>
							<Text
								style={{
									fontFamily: "damion",
									fontSize: 25,
								}}
							>
								{host?.user.name}
							</Text>
						</View>
					</View>

					<View
						style={{
							flexDirection: "row",
							gap: 12,

							marginTop: 12,
							justifyContent: "center",
						}}
					>
						<TouchableOpacity>
							<View
								style={{
									flexDirection: "column",
									alignItems: "center",
									backgroundColor: "#e5e5e5",
									paddingHorizontal: 30,
									borderRadius: 10,
									gap: 10,
									paddingVertical: 15,
								}}
							>
								<Ionicons
									name='navigate-circle-outline'
									size={30}
									color='black'
								/>
								<View>
									<Text style={{ textAlign: "center" }}>
										Phone number
									</Text>
									<Text
										style={{
											color: "black",
											textAlign: "center",
										}}
									>
										{host?.user.phone}
									</Text>
								</View>
							</View>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={handleOnMessage}
							style={{
								flexDirection: "column",
								alignItems: "center",
								backgroundColor: "#e5e5e5",
								paddingHorizontal: 30,
								borderRadius: 10,
								gap: 10,
								paddingVertical: 15,
							}}
						>
							<Ionicons
								name='chatbubble-outline'
								size={30}
							/>
							<Text>Send Message</Text>
						</TouchableOpacity>
					</View>
				</View>

				<FlatList
					renderItem={renderRow}
					data={host?.hostedList}
					// ref={listRef}
					ListHeaderComponent={
						<Text style={styles.info}>
							{host?.hostedList?.length == 0
								? "Waiting for many special room from " +
								  host.user.name
								: "many"}
						</Text>
					}
				/>
			</SafeAreaView>
		</GestureHandlerRootView>
	)
}

export default DetailPage

const styles = StyleSheet.create({
	listing: {
		flexDirection: "row",
	},
	listingItem: {
		padding: 16,
		gap: 10,
		marginVertical: 16,
	},
	image: {
		width: 50,
		height: 50,
		borderRadius: 50,
	},
	imageItem: {
		width: "100%",
		height: 300,
		borderRadius: 10,
	},
	info: {
		textAlign: "center",
		fontFamily: "mon-sb",
		fontSize: 16,
		marginTop: 4,
	},
	roundButton: {
		width: 40,
		height: 40,
		borderRadius: 50,
		backgroundColor: "white",
		alignItems: "center",
		justifyContent: "center",
		color: Colors.primary,
	},
})

function generateId(length = 24) {
	const characters = "0123456789abcdef"
	let result = ""
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(
			Math.random() * characters.length
		)
		result += characters[randomIndex]
	}
	return result
}
