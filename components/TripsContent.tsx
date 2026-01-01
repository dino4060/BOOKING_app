import { TripAPI } from "@/api/TripAPI"
import Colors from "@/constants/Colors"
import { defaultStyles } from "@/constants/Style"
import {
	TripStatusList,
	TripStatusMap,
	TTrip,
	TTripStatus,
} from "@/interface/TripType"
import { getValueSecureStore } from "@/store/SecureStore"
import { formatPriceVND } from "@/utils/number.util"
import { router } from "expo-router"
import React, { useEffect, useState } from "react"
import {
	Alert,
	ListRenderItem,
	StyleSheet,
	Text,
	ToastAndroid,
	TouchableOpacity,
	View,
} from "react-native"
import { FlatList } from "react-native-gesture-handler"
import Animated from "react-native-reanimated"

interface Props {
	trips: TTrip[]
	setSyncList: (
		value: boolean | ((prev: boolean) => boolean)
	) => void
}

const TripsContent = ({ trips, setSyncList }: Props) => {
	const [filterTrips, setFilterTrips] = useState<TTrip[]>(
		[]
	)
	const [tripStatus, setTripStatus] =
		useState<TTripStatus>("UPCOMING")
	const [cancelMode, setCancelMode] = useState<
		Record<string, boolean>
	>({})

	useEffect(() => {
		setFilterTrips(filterTripStatus(trips, tripStatus))
	}, [trips, tripStatus])

	const handleCancelTrip = async (tripId: number) => {
		const token: any = await getValueSecureStore("token")

		if (token === null) {
			console.error("Token is empty")
			Alert.alert("Có lỗi", "Vui lòng đăng nhập lại")
			return
		}

		const res = await TripAPI.cancelTrip(token, tripId)

		if (res.success === false) {
			console.error("API error: ", res.message)
			Alert.alert("Có lỗi", res.message)
			return
		}

		setSyncList((prev) => !prev)
		ToastAndroid.show("Chuyến đi đã được hủy 😭", 3000)
	}

	const renderTrip: ListRenderItem<TTrip> = ({ item }) => {
		return (
			<Animated.View style={styles.listing}>
				<Animated.Image
					style={styles.image}
					src={item.room.thumbnailUrls[0]}
				/>

				<Animated.View
					style={{
						borderBottomColor: "#00000040",
						borderBottomWidth: 1,
					}}
				>
					<TouchableOpacity
						onPress={() => {
							router.push(`/listing/${item.room._id}`)
						}}
					>
						<Animated.Text
							style={{
								paddingHorizontal: 20,
								fontFamily: "mon-sb",
								fontSize: 20,
								paddingBottom: 10,
								textAlign: "left",
								marginTop: 14,
							}}
						>
							{item.room.name}
						</Animated.Text>
					</TouchableOpacity>
				</Animated.View>

				<Animated.View
					style={{
						flexDirection: "row",
						marginTop: 15,
						marginBottom: 18,
					}}
				>
					<Animated.View
						style={{
							flex: 3,
							paddingHorizontal: 20,
							paddingTop: 3,
						}}
					>
						<Text
							style={{ fontFamily: "mon", fontSize: 16 }}
						>
							{formatDate(item.startDate)}
						</Text>
						<Text
							style={{ fontFamily: "mon", fontSize: 16 }}
						>
							{formatDate(item.endDate)}
						</Text>
					</Animated.View>

					<Animated.View
						style={{
							flex: 7,
							paddingTop: 3,
							paddingLeft: 20,
							paddingRight: 10,
							borderLeftWidth: 1,
							borderLeftColor: "#00000040",
							flexDirection: "column",
						}}
					>
						<Text
							style={{ fontFamily: "mon", fontSize: 16 }}
						>
							{`Địa chỉ: ${item.room.street}`}
						</Text>

						<Text
							style={{
								fontFamily: "mon",
								fontSize: 16,
								marginTop: 6,
							}}
						>
							{`SDT: ${item.room.host?.phone}`}
						</Text>

						<Text
							style={{
								fontFamily: "mon",
								fontSize: 16,
								marginTop: 6,
							}}
						>
							{`Host: ${item.room.host?.name}`}
						</Text>

						<Text
							style={{
								fontFamily: "mon-sb",
								fontSize: 20,
								marginTop: 6,
							}}
						>
							{formatPriceVND(item.total)}
						</Text>
					</Animated.View>
				</Animated.View>

				{tripStatus === "UPCOMING" &&
					!cancelMode[item._id] && (
						<Animated.View>
							<TouchableOpacity
								onPress={() => {
									setCancelMode((prev) => ({
										...prev,
										[item._id]: true,
									}))
								}}
							>
								<Animated.Text
									style={{
										paddingHorizontal: 20,
										fontFamily: "mon",
										fontSize: 14,
										textAlign: "center",
										color: Colors.white,
										backgroundColor: Colors.slate,
										borderRadius: 10,
										marginBottom: 10,
									}}
								>
									{"Hủy đặt phòng"}
								</Animated.Text>
							</TouchableOpacity>
						</Animated.View>
					)}

				{tripStatus === "UPCOMING" &&
					cancelMode[item._id] && (
						<Animated.View
							style={{
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "center",
								gap: 5,
							}}
						>
							<TouchableOpacity
								onPress={() => {
									handleCancelTrip(item._id)
								}}
							>
								<Animated.Text
									style={{
										paddingHorizontal: 20,
										fontFamily: "mon",
										fontSize: 14,
										textAlign: "center",
										color: Colors.white,
										backgroundColor: Colors.primary,
										borderRadius: 10,
										marginBottom: 10,
									}}
								>
									{"Xác nhận hủy"}
								</Animated.Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => {
									setCancelMode((prev) => ({
										...prev,
										[item._id]: false,
									}))
								}}
							>
								<Animated.Text
									style={{
										paddingHorizontal: 20,
										fontFamily: "mon",
										fontSize: 14,
										textAlign: "center",
										color: Colors.white,
										backgroundColor: Colors.slate,
										borderRadius: 10,
										marginBottom: 10,
									}}
								>
									{"Bỏ qua"}
								</Animated.Text>
							</TouchableOpacity>
						</Animated.View>
					)}
			</Animated.View>
		)
	}

	return (
		<View style={defaultStyles.container}>
			<Text style={styles.headerPage}>Your trips</Text>
			<FlatList
				renderItem={renderTrip}
				data={filterTrips}
				ListHeaderComponent={
					<View style={styles.headerContainer}>
						{/* Status filter */}
						<View style={styles.tabContainer}>
							{TripStatusList.map((status) => (
								<TouchableOpacity
									key={status}
									onPress={() => setTripStatus(status)}
									style={[
										styles.tabItem,
										tripStatus === status &&
											styles.tabItemActive,
									]}
								>
									<Text
										style={[
											styles.tabText,
											tripStatus === status
												? styles.tabTextActive
												: styles.tabTextInactive,
										]}
									>
										{/* {status.charAt(0) + status.slice(1).toLowerCase()} */}
										{TripStatusMap[status].display}
									</Text>
								</TouchableOpacity>
							))}
						</View>

						{/* Number info */}
						<Text style={styles.info}>
							Bạn có chuyến đi {filterTrips.length}{" "}
							{/* {tripStatus.toLowerCase()} */}
							{TripStatusMap[
								tripStatus
							].display.toLowerCase()}
						</Text>
					</View>
				}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	headerPage: {
		fontFamily: "damion",
		fontSize: 40,
		textAlign: "center",
		marginTop: 20,
	},
	headerTitle: {
		fontFamily: "damion",
		fontSize: 40,
		textAlign: "center",
		marginTop: 20,
	},
	headerContainer: {},
	tabContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		paddingHorizontal: 10,
		marginBottom: 10,
		gap: 5,
	},
	tabItem: {
		paddingVertical: 8,
		paddingHorizontal: 4,
	},
	tabItemActive: {
		borderBottomWidth: 2,
		borderBottomColor: Colors.dark,
	},
	tabText: {
		fontFamily: "mon-sb",
		fontSize: 14,
	},
	tabTextActive: {
		color: Colors.dark,
	},
	tabTextInactive: {
		color: Colors.grey,
	},
	listing: {
		margin: 16,
		borderRadius: 10,
		flexDirection: "column",
		alignItems: "center",
		marginVertical: 16,
		backgroundColor: Colors.white,
		elevation: 2,
	},
	image: {
		width: "100%",
		height: 200,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
	info: {
		textAlign: "center",
		fontFamily: "mon-sb",
		fontSize: 16,
		marginTop: 4,
	},
	button: {
		backgroundColor: "#dc2626",
		width: "auto",
	},
})

export default TripsContent

function formatDate(isoString: string): string {
	const date = new Date(isoString)
	const day = String(date.getUTCDate()).padStart(2, "0")
	const month = String(date.getUTCMonth() + 1).padStart(
		2,
		"0"
	) // Months are zero-based
	const year = date.getUTCFullYear()
	return `${day}/${month}/${year}`
}

function filterTripStatus(
	trips: TTrip[],
	status: TTripStatus
) {
	return trips.filter((t) => t.status === status)
}
