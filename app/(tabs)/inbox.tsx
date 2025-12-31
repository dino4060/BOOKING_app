import { defaultStyles } from "@/constants/Style"
// import { db } from "@/firebase"
// import {
// 	collection,
// 	getDocs,
// 	query,
// 	where,
// } from "firebase/firestore"

import { useUserStore } from "@/store/useUserStore"
import {
	Link,
	router,
	Stack,
	useFocusEffect,
} from "expo-router"
import { useCallback, useState } from "react"
import {
	FlatList,
	ListRenderItem,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native"
import Animated, {
	FadeInRight,
	FadeOutLeft,
} from "react-native-reanimated"
import { SafeAreaView } from "react-native-safe-area-context"

const Inbox = () => {
	const { user } = useUserStore()
	const [roomChat, setRoomChat] = useState<any>([])
	const renderRow: ListRenderItem<any> = ({ item }) => (
		<Link href={`/message/${item.room_id}`} asChild>
			<TouchableOpacity>
				<Animated.View
					style={styles.listing}
					entering={FadeInRight}
					exiting={FadeOutLeft}
				>
					<View
						style={{
							backgroundColor: "red",
							width: 50,
							height: 50,
							borderRadius: 10,
						}}
					></View>
					<View
						style={{
							flexDirection: "column",
							justifyContent: "flex-start",
						}}
					>
						<Text
							style={{
								fontFamily: "mon-sb",
								fontSize: 16,
							}}
						>
							{item.host_infor.name}
						</Text>
					</View>
				</Animated.View>
			</TouchableOpacity>
		</Link>
	)

	const getData = async () => {
		// const userID = user._id
		// try {
		// 	const q = query(
		// 		collection(db, "roomChats"),
		// 		where("user_id", "==", userID)
		// 	)
		// 	const querySnapshot = await getDocs(q)
		// 	const list = querySnapshot.docs.map((doc) =>
		// 		doc.data()
		// 	)
		// 	setRoomChat(list)
		// } catch (error) {
		// 	console.log(error)
		// }
	}

	useFocusEffect(
		useCallback(() => {
			if (user.isLogin === false) {
				router.push("/login")
			}
			getData()
		}, [user])
	)

	return (
		<SafeAreaView style={defaultStyles.container}>
			<Stack.Screen
				options={{
					header: () => <></>,
				}}
			></Stack.Screen>
			<Text
				style={{
					fontFamily: "damion",
					fontSize: 40,
					textAlign: "center",
					marginTop: 20,
				}}
			>
				Your inbox
			</Text>
			<FlatList
				renderItem={renderRow}
				data={roomChat}
				// ref={listRef}
				ListHeaderComponent={
					<Text style={styles.info}>{roomChat.length}</Text>
				}
			/>
		</SafeAreaView>
	)
}
export default Inbox

const styles = StyleSheet.create({
	listing: {
		backgroundColor: "#ccc",
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		padding: 10,
		marginHorizontal: 15,
		marginVertical: 5,
		borderRadius: 10,
	},
	image: {
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
})
