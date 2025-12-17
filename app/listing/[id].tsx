import Colors from "@/constants/Colors"
import { defaultStyles } from "@/constants/Style"
import { Wishlist } from "@/interface/Wishlist"
import { WishlistHandle } from "@/utils/Function"
import { AntDesign, Ionicons } from "@expo/vector-icons"
import {
	router,
	useLocalSearchParams,
	useNavigation
} from "expo-router"
import React, {
	useEffect,
	useLayoutEffect,
	useState,
} from "react"
import {
	Dimensions,
	Image,
	Share,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native"
import Animated, {
	SlideInDown,
	interpolate,
	useAnimatedRef,
	useAnimatedStyle,
	useScrollViewOffset,
} from "react-native-reanimated"
import Carousel from "react-native-reanimated-carousel"
const { width } = Dimensions.get("window")
const IMG_HEIGHT = 340

const DetailsPage = () => {
	const { id: room_id } = useLocalSearchParams()
	const [homeStay, setHomeStay] = useState<any>()
	const navigation = useNavigation()
	const scrollRef = useAnimatedRef<Animated.ScrollView>()
	const [type, setType] = useState<string>()

	const getRoomById = async (id: string) => {
		try {
			// const res = await RoomAPI.getRoomById(id)
			// setHomeStay(res?.data.data.room)
			setHomeStay({
					_id: "1",
					name: "Xuân Thắng",
					summary: "Phòng rộng view biển",
					transit: "transit",
					house_rules: "house rules",
					thumbnail_urls: [],
					host: {},
					street: "Số 1 VVN",
					smart_location: "Số 1 VVN",
					country: "VN",
					// latitude?: number
					// longitude?: number
					room_type: "SUPER",
					bathRooms: 2,
					bedRooms: 2,
					beds: 2,
					price: 110,
					weekly_price: 120,
					review: "5 sao ",
					// created_at?: Date
					bookedDate: []
			})
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		getRoomById(room_id as string)
		handleWishlist()
	}, [])

	const shareRoom = async () => {
		try {
			await Share.share({
				title: homeStay?.name || "",
				url: homeStay?.thumbnail_urls?.[0] || "",
			})
		} catch (err) {
			console.log(err)
		}
	}

	const handleLoveButtonClick = async () => {
		console.log("click on: ", room_id)
		console.log("type: ", type)
		if (type == "no") {
			// call api add
			await WishlistHandle.addToWishList(room_id as string)
			//remove list love
			setType("yes")
		} else {
			// call api remove
			await WishlistHandle.removeFromWishList(
				room_id as string
			)
			setType("no")
		}
	}

	const handleWishlist = async () => {
		const res: Wishlist[] =
			await WishlistHandle.getWishList()
		const idList = res.map((x) => x.room._id)
		const checkExit = idList.includes(room_id as string)
			? "yes"
			: "no"
		console.log("check exit: ", checkExit)
		setType(checkExit)
	}

	useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: "",
			headerTransparent: true,

			headerBackground: () => (
				<Animated.View
					style={[headerAnimatedStyle, styles.header]}
				></Animated.View>
			),
			headerRight: () => (
				<View style={styles.bar}>
					<TouchableOpacity
						style={styles.roundButton}
						onPress={shareRoom}
					>
						<Ionicons
							name='share-outline'
							size={22}
							color={"#000"}
						/>
					</TouchableOpacity>
				</View>
			),
			headerLeft: () => (
				<TouchableOpacity
					style={styles.roundButton}
					onPress={() => navigation.goBack()}
				>
					<Ionicons
						name='chevron-back'
						size={24}
						color={"#000"}
					/>
				</TouchableOpacity>
			),
		})
	}, [])

	const scrollOffset = useScrollViewOffset(scrollRef)

	const headerAnimatedStyle = useAnimatedStyle(() => {
		return {
			opacity: interpolate(
				scrollOffset.value,
				[0, IMG_HEIGHT / 1.5],
				[0, 1]
			),
		}
	}, [])

	return (
		<View style={styles.container}>
			<Animated.ScrollView
				contentContainerStyle={{ paddingBottom: 100 }}
				ref={scrollRef}
				scrollEventThrottle={16}
			>
				<Carousel
					loop
					width={width}
					height={340}
					autoPlay={true}
					data={homeStay?.thumbnail_urls as any}
					scrollAnimationDuration={1000}
					renderItem={({ index }) => {
						return (
							<View style={{ flex: 1, height: 500 }}>
								<Image
									source={{
										uri:
											homeStay?.thumbnail_urls?.[index] ||
											"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3N_sAjazDv75OEWZMYE-6e2xBhsXwoNhthjB0zbCKPA&s",
									}}
									style={[styles.image]}
									resizeMode='cover'
								/>
							</View>
						)
					}}
				/>

				<View style={styles.infoContainer}>
					<Text style={styles.name}>{homeStay?.name}</Text>

					<Text style={styles.location}>
						{homeStay?.room_type} in{" "}
						{homeStay?.smart_location}
					</Text>
					<Text style={styles.rooms}>
						{homeStay?.bedRooms} bedrooms · {homeStay?.beds}{" "}
						bed · {homeStay?.bathRooms} bathrooms
					</Text>
					<View
						style={{
							flexDirection: "row",
							gap: 4,
							alignItems: "center",
						}}
					>
						<Ionicons name='star' size={16} />
						<TouchableOpacity
							onPress={handleLoveButtonClick}
							style={styles.roundButton}
						>
							{type == "yes" ? (
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
					</View>
					<View style={styles.divider} />

					<View style={styles.hostView}>
						<TouchableOpacity
							onPress={() =>
								router.push(`/host/${homeStay?.host?._id}`)
							}
						>
							<Image
								source={{
									uri: "https://avatar.iran.liara.run/public",
								}}
								width={50}
								height={50}
							/>
						</TouchableOpacity>

						<View>
							<Text
								style={{ fontSize: 14, fontFamily: "mon" }}
							>
								Hosted by {homeStay?.host?.name}
							</Text>
							<Text
								onPress={() =>
									console.log(homeStay?.host?.created_at)
								}
								style={{
									fontSize: 14,
									fontFamily: "mon-sb",
								}}
							>
								Host since{" "}
								{/* {UtilFunction.formatToHostSince(
									homeStay?.host?.created_at as Date
								)} */}
							</Text>
						</View>
					</View>

					<View style={styles.divider} />

					<View style={styles.detail}>
						<Ionicons name='thumbs-up-outline' size={24} />
						<View>
							<Text
								style={{
									fontFamily: "mon-b",
									fontSize: 16,
								}}
							>
								Summary
							</Text>
							<Text style={styles.description}>
								{homeStay?.summary}
							</Text>
						</View>
					</View>

					<View style={{ ...styles.detail, marginTop: 12 }}>
						<Ionicons name='car-outline' size={24} />
						<View>
							<Text
								style={{
									fontFamily: "mon-b",
									fontSize: 16,
								}}
							>
								Transit
							</Text>
							<Text style={styles.description}>
								{homeStay?.transit}
							</Text>
						</View>
					</View>

					<View style={{ ...styles.detail, marginTop: 12 }}>
						<Ionicons name='diamond-outline' size={24} />
						<View>
							<Text
								style={{
									fontFamily: "mon-b",
									fontSize: 16,
								}}
							>
								Amenities
							</Text>
						</View>
					</View>
				</View>
			</Animated.ScrollView>

			<Animated.View
				style={defaultStyles.footer}
				entering={SlideInDown.delay(200)}
			>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<TouchableOpacity style={styles.footerText}>
						<Text style={styles.footerPrice}>
							€{homeStay?.price}
						</Text>
						<Text>night</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() =>
							router.push(`/reservation/${homeStay?._id}`)
						}
						style={[
							defaultStyles.btn,
							{ paddingRight: 20, paddingLeft: 20 },
						]}
					>
						<Text style={defaultStyles.btnText}>
							Reserve
						</Text>
					</TouchableOpacity>
				</View>
			</Animated.View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
	},
	image: {
		height: IMG_HEIGHT,
		width: width,
	},
	infoContainer: {
		padding: 24,
		backgroundColor: "#fff",
	},
	name: {
		fontSize: 26,
		fontFamily: "mon-sb",
	},
	location: {
		fontSize: 18,
		marginTop: 10,
		fontFamily: "mon-sb",
	},
	rooms: {
		fontSize: 16,
		color: Colors.grey,
		marginVertical: 4,
		fontFamily: "mon",
	},
	ratings: {
		fontSize: 16,
		fontFamily: "mon-sb",
	},
	divider: {
		height: StyleSheet.hairlineWidth,
		backgroundColor: Colors.grey,
		marginVertical: 16,
	},
	host: {
		width: 50,
		height: 50,
		borderRadius: 50,
		backgroundColor: Colors.grey,
	},
	hostView: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	footerText: {
		height: "100%",
		justifyContent: "center",
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	footerPrice: {
		fontSize: 18,
		fontFamily: "mon-sb",
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
	bar: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 10,
	},
	header: {
		backgroundColor: "#fff",
		height: 100,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderColor: Colors.grey,
	},
	description: {
		fontSize: 15,
		maxWidth: "90%",
		fontFamily: "mon",
		marginTop: 4,
		color: "black",
		borderWidth: 1,
		borderColor: "#e2e8f0",
		borderRadius: 20,
		padding: 14,
	},
	detail: {
		flexDirection: "row",
		gap: 12,
		alignItems: "flex-start",
	},
})

export default DetailsPage

//href={`/host/${homeStay?.host?._id}`}
