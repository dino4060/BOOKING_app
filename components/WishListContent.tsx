import { WishlistAPI } from "@/api/WishlistAPI"
import Colors from "@/constants/Colors"
import { defaultStyles } from "@/constants/Style"
import { TSetState } from "@/interface/Base"
import { TLikedRoom } from "@/interface/Wishlist"
import { formatPriceVND } from "@/utils/number.util"
import { Ionicons } from "@expo/vector-icons"
import { Link } from "expo-router"
import { useRef } from "react"
import {
	Alert,
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

interface Props {
	list: TLikedRoom[]
	count: number
	likedRoomIdSet: Set<number>
	setLikedRoomIdSet: TSetState<Set<number>>
}

const WishlistContent = ({
	list: items,
	count,
	likedRoomIdSet,
	setLikedRoomIdSet,
}: Props) => {
	const isProcessLoveButton = useRef(false)
	const addLikedRoomIdSet = (roomId: number) => {
		setLikedRoomIdSet((prev) => {
			const next = new Set(prev)
			next.add(roomId)
			return next
		})
	}
	const deleteLikedRoomIdSet = (roomId: number) => {
		setLikedRoomIdSet((prev) => {
			const next = new Set(prev)
			next.delete(roomId)
			return next
		})
	}

	const handleClickLoveButton = async (
		roomIdString: string
	) => {
		if (isProcessLoveButton.current === true) return

		try {
			isProcessLoveButton.current = true

			const roomId = Number(roomIdString)
			const isLikedRoom = likedRoomIdSet.has(roomId)

			if (isLikedRoom === false) {
				addLikedRoomIdSet(roomId)
				const res = await WishlistAPI.likeRoom(roomId)

				if (res.success === false) {
					console.error("API error: ", res.message)
					Alert.alert("Có lỗi", res.message)
					deleteLikedRoomIdSet(roomId)
				}
			} else {
				deleteLikedRoomIdSet(roomId)
				const res = await WishlistAPI.unlikeRoom(roomId)

				if (res.success === false) {
					console.error("API error: ", res.message)
					Alert.alert("Có lỗi", res.message)
					addLikedRoomIdSet(roomId)
				}
			}
		} catch (error) {
			console.error("Click love button error: ", error)
		} finally {
			isProcessLoveButton.current = false
		}
	}

	const renderRow: ListRenderItem<TLikedRoom> = ({
		item,
	}) => (
		<Link href={`/listing/${item.room._id}`} asChild>
			<TouchableOpacity>
				<Animated.View
					style={styles.listing}
					entering={FadeInRight}
					exiting={FadeOutLeft}
				>
					<Animated.Image
						source={{
							uri:
								item.room.thumbnailUrls?.[0] ||
								"https://via.assets.so/img.jpg?w=400&h=150&tc=blue&bg=#cecece",
						}}
						style={styles.image}
					/>

					<TouchableOpacity
						onPress={() =>
							handleClickLoveButton(String(item.room._id))
						}
						style={{
							position: "absolute",
							right: 45,
							top: 30,
						}}
					>
						{likedRoomIdSet.has(item.room._id) ? (
							<Ionicons
								name='heart'
								size={24}
								color={Colors.primary}
							/>
						) : (
							<Ionicons
								name='heart'
								size={24}
								color={Colors.white}
							/>
						)}
					</TouchableOpacity>

					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							marginTop: 3,
						}}
					>
						<Text
							style={{
								fontSize: 16,
								fontFamily: "mon-sb",
								textAlign: "center",
								width: "75%",
							}}
						>
							{item.room.name}
						</Text>
					</View>

					<View>
						<Text
							style={{
								fontFamily: "mon",
								textAlign: "center",
							}}
						>
							{item.room.roomType}
						</Text>
					</View>

					<View>
						<View style={{ flexDirection: "row", gap: 4 }}>
							<Text style={{ fontFamily: "mon-sb" }}>
								{formatPriceVND(item.room.price)}
							</Text>
							<Text style={{ fontFamily: "mon" }}>
								/ 2 đêm
							</Text>
						</View>
					</View>

					<View
						style={{
							width: "auto",
							borderColor: "#cccccc",
							borderWidth: 1,
							borderRadius: 20,
							paddingHorizontal: 30,
							paddingVertical: 10,
							maxWidth: 350,
						}}
					>
						<Text style={{ fontFamily: "mon" }}>
							{item.room.highlight}
						</Text>
					</View>
				</Animated.View>
			</TouchableOpacity>
		</Link>
	)

	return (
		<View style={defaultStyles.container}>
			<Text
				style={{
					fontFamily: "damion",
					fontSize: 40,
					textAlign: "center",
				}}
			>
				WishList
			</Text>
			<FlatList
				renderItem={renderRow}
				data={items}
				ListHeaderComponent={
					<Text style={styles.info}>
						Bạn đã yêu thích {count} phòng
					</Text>
				}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	listing: {
		padding: 16,
		gap: 5,
		flexDirection: "column",

		alignItems: "center",
		marginVertical: 16,
	},
	image: {
		width: 350,
		height: 350,
		borderRadius: 10,
	},
	info: {
		textAlign: "center",
		fontFamily: "mon-sb",
		fontSize: 16,
		marginTop: 4,
	},
})

export default WishlistContent
