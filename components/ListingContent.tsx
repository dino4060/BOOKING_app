import { WishlistAPI } from "@/api/WishlistAPI"
import { HostAvatarUrl } from "@/assets/data/default"
import Colors from "@/constants/Colors"
import { TDestination, TRoom } from "@/interface/RoomType"
import { useHomestayStore } from "@/store/useHomestayStore"
import { useUserStore } from "@/store/useUserStore"
import { formatPriceVND } from "@/utils/number.util"
import { Ionicons } from "@expo/vector-icons"
import BottomSheet, {
	BottomSheetFlatList,
} from "@gorhom/bottom-sheet"
import { Link, router, useFocusEffect } from "expo-router"
import React, {
	Fragment,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react"
import {
	Alert,
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
	listings: TRoom[]
	destination: TDestination
}

const ListingContent = ({
	listings: roomItems,
	destination,
}: Props) => {
	const user = useUserStore((state) => state.user)
	const [loading, setLoading] = useState<boolean>(false)
	const [likedRoomIdSet, setLikedRoomIdSet] = useState<
		Set<number>
	>(new Set())
	const isProcessLoveButton = useRef(false)
	const { homeStayParam } = useHomestayStore()

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

	useEffect(() => {
		setLoading(true)

		setTimeout(() => {
			setLoading(false)
		}, 200)
	}, [destination])

	useFocusEffect(
		useCallback(() => {
			if (user.isLogin === false) {
				setLikedRoomIdSet(new Set())
				return
			}

			const listLikedRoomIds = async () => {
				const res = await WishlistAPI.listRooms({
					destination: homeStayParam.destination,
				})
				if (res.success === false) {
					console.error("API error: ", res.message)
					Alert.alert("Có lỗi", res.message)
					return
				}
				setLikedRoomIdSet(
					new Set(
						res.data.map((likedRoom) => likedRoom.room._id)
					)
				)
			}
			listLikedRoomIds()
		}, [user, homeStayParam])
	)

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

	const renderRoomItem: ListRenderItem<TRoom> = ({
		item: room,
	}) => (
		<Link href={`/listing/${room._id}`} asChild>
			<TouchableOpacity>
				<Animated.View
					style={styles.listing}
					entering={FadeInRight}
					exiting={FadeOutLeft}
				>
					<Animated.Image
						source={{
							uri: room.thumbnailUrls?.[0] || HostAvatarUrl,
						}}
						style={styles.image}
					/>

					<TouchableOpacity
						onPress={() =>
							handleClickLoveButton(String(room._id))
						}
						style={{
							position: "absolute",
							right: 30,
							top: 30,
						}}
					>
						{likedRoomIdSet.has(room._id) ? (
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
						}}
					>
						<Text
							style={{ fontSize: 16, fontFamily: "mon-sb" }}
						>
							{room.name}
						</Text>
						<View style={{ flexDirection: "row", gap: 4 }}>
							<Ionicons name='star' size={16} />
						</View>
					</View>

					<Text style={{ fontFamily: "mon" }}>
						{room.roomType}
					</Text>

					<View style={{ flexDirection: "row", gap: 4 }}>
						<Text style={{ fontFamily: "mon-sb" }}>
							{formatPriceVND(room.price)}
						</Text>
						<Text style={{ fontFamily: "mon" }}>2 đêm</Text>
					</View>
				</Animated.View>
			</TouchableOpacity>
		</Link>
	)

	// hooks
	const sheetRef = useRef<BottomSheet>(null)

	const snapPoints = useMemo(
		() => ["10%", "50%", "95%"],
		[]
	)

	return (
		<BottomSheet
			index={1}
			ref={sheetRef}
			snapPoints={snapPoints}
			enableDynamicSizing={false}
		>
			<BottomSheetFlatList
				data={roomItems}
				keyExtractor={(i: any) => i._id}
				renderItem={renderRoomItem}
				ListHeaderComponent={
					<Fragment>
						<TouchableOpacity
							onPress={() => router.push("/reels/page")}
							style={styles.reelsButton}
						>
							<Text style={styles.reelsText}>Reels</Text>
						</TouchableOpacity>

						<Text style={styles.info}>
							Tìm được {roomItems.length} nơi lưu trú
						</Text>
					</Fragment>
				}
			/>
		</BottomSheet>
	)
}

const styles = StyleSheet.create({
	listing: {
		padding: 16,
		gap: 10,
		marginBottom: 26,
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
		marginBottom: 5,
	},
	container: {
		flex: 1,
		backgroundColor: Colors.grey,
	},
	contentContainer: {
		flex: 1,
		padding: 36,
		alignItems: "center",
	},
	reelsButton: {
		paddingHorizontal: 10,
		backgroundColor: Colors.primary,
		width: 100,
		borderTopRightRadius: 15,
		borderBottomRightRadius: 15,
		marginBottom: 5,
	},
	reelsText: {
		textAlign: "center",
		fontFamily: "damion",
		color: Colors.white,
		fontSize: 25,
	},
})

export default ListingContent
