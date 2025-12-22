import { AltPhoto } from "@/assets/data/api"
import Colors from "@/constants/Colors"
import { Room } from "@/interface/Room"
import { Wishlist } from "@/interface/Wishlist"
import { WishlistHandle } from "@/utils/Function"
import { formatPriceVND } from "@/utils/number.util"
import { Ionicons } from "@expo/vector-icons"
import AntDesign from "@expo/vector-icons/AntDesign"
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
	listings: any[]
	// refresh: number
	category: string
}

const ListingContent = ({
	listings: roomItems,
	category,
}: Props) => {
	const [loading, setLoading] = useState<boolean>(false)
	const [listLove, setListLove] = useState<any>([])

	useEffect(() => {
		setLoading(true)

		setTimeout(() => {
			setLoading(false)
		}, 200)
	}, [category])

	useFocusEffect(
		useCallback(() => {
			handleWishlist()
		}, [])
	)
	const handleLoveButtonClick = async (room_id: string) => {
		// get state of this button
		console.log("click on: ", room_id)
		const checkType = listLove.includes(room_id)
			? "remove"
			: "add"
		if (checkType === "add") {
			// call api add
			await WishlistHandle.addToWishList(room_id)
			//remove list love
			setListLove((pre: string[]) => [...pre, room_id])
		} else {
			// call api remove
			await WishlistHandle.removeFromWishList(room_id)
			//reload list love
			let newList = [...listLove]
			newList = newList.filter((x: string) => x != room_id)
			setListLove(newList)
		}
	}

	const handleWishlist = async () => {
		const res: Wishlist[] =
			await WishlistHandle.getWishList()
		const idList = res.map((x) => x.room._id)
		setListLove(idList)
	}

	const renderRoomItem: ListRenderItem<Room> = ({
		item,
	}) => (
		<Link href={`/listing/${item._id}`} asChild>
			<TouchableOpacity>
				<Animated.View
					style={styles.listing}
					entering={FadeInRight}
					exiting={FadeOutLeft}
				>
					<Animated.Image
						source={{
							uri: item.thumbnailUrls?.[0] || AltPhoto,
						}}
						style={styles.image}
					/>
					<TouchableOpacity
						onPress={() =>
							handleLoveButtonClick(String(item._id))
						}
						style={{
							position: "absolute",
							right: 30,
							top: 30,
						}}
					>
						{listLove.includes(item._id) ? (
							<AntDesign
								name='heart'
								size={24}
								color={Colors.primary}
							/>
						) : (
							<Ionicons
								name='heart-outline'
								size={24}
								color='#000'
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
							{item.name}
						</Text>
						<View style={{ flexDirection: "row", gap: 4 }}>
							<Ionicons name='star' size={16} />
						</View>
					</View>
					<Text style={{ fontFamily: "mon" }}>
						{item.roomType}
					</Text>
					<View style={{ flexDirection: "row", gap: 4 }}>
						<Text style={{ fontFamily: "mon-sb" }}>
							{formatPriceVND(item.price)}
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
							{roomItems.length} homes
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
		marginVertical: 16,
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
		marginBottom: 20,
	},
	reelsText: {
		textAlign: "center",
		fontFamily: "damion",
		color: Colors.white,
		fontSize: 25,
	},
})

export default ListingContent
