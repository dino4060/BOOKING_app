import Colors from "@/constants/Colors"
import { defaultStyles } from "@/constants/Style"
import { Room } from "@/interface/Room"
import { Wishlist } from "@/interface/Wishlist"
import { WishlistHandle } from "@/utils/Function"
import { Ionicons } from "@expo/vector-icons"
import AntDesign from "@expo/vector-icons/AntDesign"
import {
	BottomSheetFlatListMethods
} from "@gorhom/bottom-sheet"
import { Link, useFocusEffect } from "expo-router"
import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react"
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
interface Props {
	listings: any[]
	// refresh: number
	category: string
}

const Listings = ({ listings: items, category }: Props) => {
	const listRef = useRef<BottomSheetFlatListMethods>(null)
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

	const renderRow: ListRenderItem<Room> = ({ item }) => (
		<Link href={`/listing/${item._id}`} asChild>
			<TouchableOpacity>
				<Animated.View
					style={styles.listing}
					entering={FadeInRight}
					exiting={FadeOutLeft}
				>
					<Animated.Image
						source={{
							uri:
								item.thumbnail_urls?.[0] ||
								"https://random.imagecdn.app/500/500",
						}} // Provide an empty string as a fallback if thumbnail_url is null
						style={styles.image}
					/>
					<TouchableOpacity
						onPress={() => handleLoveButtonClick(item._id)}
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
						{item.room_type}
					</Text>
					<View style={{ flexDirection: "row", gap: 4 }}>
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
		<View style={defaultStyles.container}>
			<FlatList
				renderItem={renderRow}
				data={loading ? [] : items}
				// ref={listRef}
				ListHeaderComponent={
					<Text style={styles.info}>
						{items.length} homes
					</Text>
				}
			/>
		</View>
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
})

export default Listings
