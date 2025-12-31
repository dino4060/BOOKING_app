import Colors from "@/constants/Colors"
import { defaultStyles } from "@/constants/Style"
import { TouchableOpacity } from "@gorhom/bottom-sheet"
import {
	Stack,
	useLocalSearchParams,
	useRouter,
} from "expo-router"
import { useEffect, useState } from "react"
import {
	Image,
	ScrollView,
	StyleSheet,
	Text,
	ToastAndroid,
	View,
} from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import Animated, {
	FadeIn,
	FadeOut,
} from "react-native-reanimated"
// @ts-ignore

import { BookingAPI } from "@/api/BookingAPI"
import { RoomAPI } from "@/api/RoomAPI"
import { TRoom } from "@/interface/RoomType"
import { getValueSecureStore } from "@/store/SecureStore"
import { formatPriceVND } from "@/utils/number.util"
import { UtilFunction } from "@/utils/utilFunction"
import { Calendar } from "react-native-calendars"
import { SafeAreaView } from "react-native-safe-area-context"

const AnimatedTouchableOpacity =
	Animated.createAnimatedComponent(TouchableOpacity)

const DetailPage = () => {
	const { id } = useLocalSearchParams()
	const [openCard, setOpenCard] = useState(1)
	const router = useRouter()
	const [homeStay, setHomeStay] = useState<TRoom>()
	const [dateRange, setDateRange] = useState({
		startDate: "",
		endDate: "",
	})
	const [bookedDates, setBookedDates] = useState<string[]>(
		[]
	)
	const [dataPrice, setDataPrice] = useState({
		numberOfDay: UtilFunction.calcDate(
			dateRange.startDate,
			dateRange.endDate
		),
		total: 0,
	})

	useEffect(() => {
		const getRoom = async (id: number) => {
			const res = await RoomAPI.getRoom(id)
			if (res.success == false) return
			setHomeStay(res.data || ({} as TRoom))
			setBookedDates(res.data.bookedDates)
		}

		getRoom(Number(id))
	}, [])

	useEffect(() => {
		if (
			!isDateXAfterDateY(
				dateRange.startDate,
				dateRange.endDate
			)
		) {
			setDataPrice(() => {
				let numberOfDay = UtilFunction.calcDate(
					dateRange.startDate,
					dateRange.endDate
				)
				const singlePrice = homeStay?.price
					? homeStay?.price / 2
					: 0

				return {
					numberOfDay: numberOfDay,
					total: Number.parseFloat(
						(numberOfDay * singlePrice).toFixed(2)
					),
				}
			})
		}
	}, [dateRange.startDate, dateRange.endDate])

	const onClearAll = () => {
		setOpenCard(0)
	}

	const handleDayPress = (date: any) => {
		const { startDate, endDate } = dateRange

		if (startDate === "") {
			setDateRange({
				startDate: date.dateString,
				endDate: "",
			})
		} else if (startDate && endDate === "") {
			if (date.dateString !== startDate) {
				if (
					checkBookedDateContainDateRange(
						bookedDates,
						startDate,
						date.dateString
					)
				) {
					ToastAndroid.show(
						"The date range include booked date",
						ToastAndroid.SHORT
					)
					setDateRange({
						startDate: "",
						endDate: "",
					})
				} else
					setDateRange({
						startDate,
						endDate: date.dateString,
					})
			}
		} else {
			setDateRange({
				startDate: date.dateString,
				endDate: "",
			})
		}
	}

	const handleBooking = async () => {
		const roomId = id as string
		const startDate = dateRange.startDate
		const endDate = dateRange.endDate
		const total = dataPrice.total
		const accessToken = await getValueSecureStore("token")

		if (accessToken === null) {
			console.error("Token is empty")
			return
		}

		const result = await BookingAPI.book(
			roomId,
			startDate,
			endDate,
			total,
			accessToken
		)

		if (result.success === false) {
			console.error("API error: ", result.message)
			return
		}

		console.info("API booking data: ", result.data)

		const message = "Chúc mừng bạn đã đặt phòng thành công"

		router.push(`(information)/${message}` as any)
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Stack.Screen
				options={{
					header: () => (
						<SafeAreaView
							style={{
								...styles.card,
								padding: 5,
								marginTop: 30,
							}}
						>
							<Text style={styles.previewText}>
								Having amazing trip in {homeStay?.name} 🔥
							</Text>
						</SafeAreaView>
					),
				}}
			></Stack.Screen>

			<ScrollView style={{ flex: 1 }}>
				<View
					style={{ ...styles.card, paddingBottom: 200 }}
				>
					<View
						style={{
							borderRadius: 14,
							padding: 20,
						}}
					>
						<Image
							source={{
								uri:
									homeStay?.thumbnailUrls?.[0] ||
									"https://placehold.jp/500x300.png",
							}}
							style={[styles.image]}
							resizeMode='cover'
						/>
					</View>

					{openCard != 1 && (
						<AnimatedTouchableOpacity
							onPress={() => setOpenCard(1)}
							style={styles.cardPreview}
							entering={FadeIn.duration(200)}
							exiting={FadeOut.duration(200)}
						>
							<Text style={styles.previewText}>When</Text>
							<Text style={styles.previewData}>
								Any week
							</Text>
						</AnimatedTouchableOpacity>
					)}

					{openCard == 1 && (
						<AnimatedTouchableOpacity
							onPress={() => setOpenCard(1)}
							style={styles.cardPreview}
							entering={FadeIn.duration(200)}
							exiting={FadeOut.duration(200)}
						>
							<Text style={styles.previewText}>
								Chi phí cho 1 đêm
							</Text>
							<Text style={styles.previewData}>
								{homeStay?.price
									? formatPriceVND(homeStay?.price / 2)
									: 0}
							</Text>
						</AnimatedTouchableOpacity>
					)}

					{openCard == 1 && (
						<Text style={styles.cardHeader}>Chọn ngày</Text>
					)}

					{openCard == 1 && (
						<Animated.View>
							<Calendar
								firstDay={0}
								style={{
									margin: 30,
									marginTop: 0,
								}}
								onDayPress={handleDayPress}
								minDate={formatDate()}
								maxDate={formatDate(1)}
								hideExtraDays={true}
								markingType='period'
								markedDates={{
									...generateMarkedDates(
										dateRange.startDate,
										dateRange.endDate
									),
									...generateDisableDate(bookedDates),
								}}
							/>
							{/* <Calendar
								onDayPress={(day) => {
									console.log("selected day", day)
								}}
							/> */}
						</Animated.View>
					)}
				</View>

				{/* Footer */}
			</ScrollView>

			<Animated.View
				style={{
					...defaultStyles.footer,
					paddingBottom: 50,
				}}
				// entering={SlideInDown.delay(200)}
			>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<TouchableOpacity
						style={styles.footerText}
						onPress={onClearAll}
					>
						<Text>
							<Text style={styles.footerPrice}>
								{`Tổng ${formatPriceVND(dataPrice.total)}`}
							</Text>
							{`  / ${dataPrice.numberOfDay} đêm`}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => handleBooking()}
						style={[
							defaultStyles.btn,
							{ paddingRight: 20, paddingLeft: 20 },
						]}
					>
						<Text style={defaultStyles.btnText}>
							Book now
						</Text>
					</TouchableOpacity>
				</View>
			</Animated.View>
		</GestureHandlerRootView>
	)
}

function checkBookedDateContainDateRange(
	bookedDate: string[],
	startDateString: string,
	endDateString: string
) {
	let startDate = new Date(startDateString)
	let endDate = new Date(endDateString)

	for (let i = 0; i < bookedDate.length; i++) {
		let date = new Date(bookedDate[i])
		if (date >= startDate && date <= endDate) {
			return true // At least one booked date falls within the range
		}
	}
	return false // No booked date falls within the range
}

function isDateXAfterDateY(dateX: string, dateY: string) {
	const x = new Date(dateX)
	const y = new Date(dateY)

	return x > y
}

function formatDate(plusYear = 0): string {
	const today: Date = new Date()
	const year: number = today.getFullYear()
	const month: number = today.getMonth() + 1 // January is 0
	const day: number = today.getDate()

	const formattedYear = year + plusYear
	// Padding single digits with leading zeros
	const formattedMonth: string =
		month < 10 ? `0${month}` : `${month}`
	const formattedDay: string =
		day < 10 ? `0${day}` : `${day}`

	// Combining the components into the desired format
	const formattedDate: string = `${formattedYear}-${formattedMonth}-${formattedDay}`

	return formattedDate
}

function generateDisableDate(dateList: string[]) {
	let result: { [k: string]: any } = {}
	dateList.forEach((date) => {
		result[date] = {
			disabled: true,
			disableTouchEvent: true,
		}
	})
	return result
}

function generateMarkedDates(
	startDateString: string,
	endDateString: string
) {
	if (startDateString == "" || endDateString == "")
		return {}

	let markedDates: any = {}

	let startDate = new Date(startDateString)
	let endDate = new Date(endDateString)

	// If start date is greater than end date, return empty markedDates object
	if (startDate > endDate) {
		return markedDates
	}

	// Add starting day
	markedDates[startDateString] = {
		startingDay: true,
		color: "#FF385C",
	}

	// Add days between start and end date
	let currentDate = new Date(startDate)
	while (currentDate < endDate) {
		currentDate.setDate(currentDate.getDate() + 1)
		let dateString = currentDate.toISOString().slice(0, 10)
		markedDates[dateString] = {
			marked: true,
			color: "#FF385C",
			dotColor: "transparent",
		}
	}

	// Add ending day
	markedDates[endDateString] = {
		endingDay: true,
		color: "#FF385C",
		dotColor: "transparent",
	}

	return {
		...markedDates,
	}
}

const styles = StyleSheet.create({
	header: {
		backgroundColor: "#fff",
		height: 100,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderColor: Colors.grey,
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
	container: {
		flex: 1,
		backgroundColor: "white",
	},
	card: {
		backgroundColor: "#fff",
		borderRadius: 14,
		margin: 10,
		elevation: 4,
		shadowColor: "#000",
		shadowOpacity: 0.3,
		shadowRadius: 4,
		shadowOffset: {
			width: 2,
			height: 2,
		},
		// gap: 20,
	},
	cardHeader: {
		fontFamily: "mon-b",
		fontSize: 24,
		paddingTop: 20,
		paddingLeft: 20,
	},
	cardBody: {
		paddingHorizontal: 20,
		paddingBottom: 20,
	},
	cardPreview: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 20,
		paddingTop: 0,
		paddingBottom: 10,
	},

	searchSection: {
		height: 50,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#ABABAB",
		borderRadius: 8,
		marginBottom: 16,
	},
	searchIcon: {
		padding: 10,
	},
	inputField: {
		flex: 1,
		padding: 10,
		backgroundColor: "#fff",
	},
	placesContainer: {
		flexDirection: "row",
		gap: 25,
	},
	place: {
		width: 100,
		height: 100,
		borderRadius: 10,
	},
	placeSelected: {
		borderColor: Colors.grey,
		borderWidth: 2,
		borderRadius: 10,
		width: 100,
		height: 100,
	},
	previewText: {
		fontFamily: "mon-sb",
		fontSize: 14,
		color: Colors.grey,
		textAlign: "center",
	},
	previewData: {
		fontFamily: "mon-sb",
		fontSize: 14,
		color: Colors.dark,
	},

	guestItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 16,
	},
	image: {
		width: "100%",
		height: 300,
		borderRadius: 10,
	},
	itemBorder: {
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: Colors.grey,
	},
})
export default DetailPage
