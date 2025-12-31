import Colors from "@/constants/Colors"
import { defaultStyles } from "@/constants/Style"
import { TSetState } from "@/interface/Base"
import { useHomestayStore } from "@/store/useHomestayStore"
import { formatPriceVND } from "@/utils/number.util"
import { Ionicons } from "@expo/vector-icons"
import { TouchableOpacity } from "@gorhom/bottom-sheet"
import { BlurView } from "expo-blur"
import { useRouter } from "expo-router"
import moment from "moment"
import { Fragment, useEffect, useState } from "react"
import {
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native"
import CalendarPicker from "react-native-calendar-picker"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import Animated, {
	SlideInDown,
} from "react-native-reanimated"

const Page = () => {
	const [openCard, setOpenCard] = useState<
		| "TIME"
		| "AMENITIES"
		| "PRICE"
		| "SORT"
		| "DESTINATION"
		| "SPECIFICATION"
	>("TIME")
	const router = useRouter()
	const today = new Date().toISOString().substring(0, 10)
	const { homeStayParam, updateHomestayParam } =
		useHomestayStore()

	// TIME
	const [startDate, setStartDate] = useState<
		string | undefined
	>(undefined)
	const [endDate, setEndDate] = useState<
		string | undefined
	>(undefined)

	// PRICE
	const [minPrice, setMinPrice] = useState<
		number | undefined
	>(undefined)
	const [maxPrice, setMaxPrice] = useState<
		number | undefined
	>(undefined)
	const [priceFeedback, setPriceFeedback] =
		useState<string>("")

	// SPECIFICATION
	const [bedRooms, setBedRooms] = useState<
		number | undefined
	>(undefined)
	const [beds, setBeds] = useState<number | undefined>(
		undefined
	)
	const [isCoupleBed, setIsCoupleBed] = useState<
		boolean | undefined
	>(undefined)
	const [bathRooms, setBathRooms] = useState<
		number | undefined
	>(undefined)
	const [isPrivateBathrooms, setIsPrivateBathrooms] =
		useState<boolean | undefined>(undefined)

	// DESTINATION
	const [destination, setDestination] =
		useState<string>("Đà Lạt")

	useEffect(() => {
		setStartDate(homeStayParam.startDate || undefined)
		setEndDate(homeStayParam.endDate || undefined)

		setMinPrice(homeStayParam.minPrice || undefined)
		setMaxPrice(homeStayParam.maxPrice || undefined)

		setBedRooms(homeStayParam.bedRooms || undefined)
		setBeds(homeStayParam.beds || undefined)
		setIsCoupleBed(homeStayParam.isCoupleBed ?? undefined)
		setBathRooms(homeStayParam.bathRooms || undefined)
		setIsPrivateBathrooms(
			homeStayParam.isPrivateBathrooms ?? undefined
		)
	}, [homeStayParam])

	const onClearAll = () => {
		setOpenCard("TIME")

		setStartDate(undefined)
		setEndDate(undefined)

		setMinPrice(undefined)
		setMaxPrice(undefined)
		setPriceFeedback("")

		setBedRooms(undefined)
		setBeds(undefined)
		setIsCoupleBed(undefined)
		setBathRooms(undefined)
		setIsPrivateBathrooms(undefined)
	}

	const onSearch = async () => {
		const { destination } = homeStayParam
		updateHomestayParam({
			destination,

			startDate,
			endDate,

			minPrice,
			maxPrice,

			bedRooms,
			beds,
			isCoupleBed,
			bathRooms,
			isPrivateBathrooms,
		})
		router.back()
	}

	const formatDateDisplay = (
		dateStr: string | undefined
	) => {
		if (!dateStr) return ""
		// Convert YYYY/MM/DD to DD/MM/YYYY
		const parts = dateStr.split("/")
		if (parts.length === 3) {
			return `${parts[2]}/${parts[1]}/${parts[0]}`
		}
		return dateStr
	}

	const getTimePreview = () => {
		if (!startDate && !endDate) return "Không giới hạn"
		if (startDate && endDate) {
			return `${formatDateDisplay(
				startDate
			)} - ${formatDateDisplay(endDate)}`
		}
		if (startDate)
			return `Từ ${formatDateDisplay(startDate)}`
		if (endDate) return `Đến ${formatDateDisplay(endDate)}`
		return "Không giới hạn"
	}

	const getSpecificationPreview = () => {
		const specs = []
		if (bedRooms !== undefined)
			specs.push(`${bedRooms} phòng ngủ`)
		if (beds !== undefined) specs.push(`${beds} giường`)
		if (isCoupleBed !== undefined)
			specs.push(isCoupleBed ? "Giường đôi" : "Giường đơn")
		if (bathRooms !== undefined)
			specs.push(`${bathRooms} phòng tắm`)
		if (isPrivateBathrooms !== undefined)
			specs.push(
				isPrivateBathrooms ? "Cá nhân" : "Dùng chung"
			)

		if (specs.length === 0) return "Không giới hạn"

		const specString = specs.join(" • ")

		return specString
	}

	const minusNumber = (
		num: number | undefined,
		setNum: TSetState<number | undefined>
	) => {
		if (num === undefined) {
			return
		}

		if (num === 1) {
			setNum(undefined)
			return
		}

		setNum(num - 1)
	}

	const onDateChange = (
		date: any,
		type: "START_DATE" | "END_DATE"
	) => {
		if (type === "END_DATE") {
			setEndDate(
				date ? moment(date).format("YYYY-MM-DD") : undefined
			)
		} else {
			setStartDate(
				date ? moment(date).format("YYYY-MM-DD") : undefined
			)
			setEndDate(undefined) // Reset end date when a new start date is picked
		}
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<BlurView
				intensity={70}
				style={styles.container}
				tint='light'
				pointerEvents='box-none'
			>
				{/* TIME */}
				<View style={styles.card}>
					{openCard !== "TIME" && (
						<TouchableOpacity
							onPress={() => setOpenCard("TIME")}
							style={styles.cardPreview}
						>
							<Text style={styles.previewText}>
								Thời gian
							</Text>
							<Text style={styles.previewData}>
								{getTimePreview()}
							</Text>
						</TouchableOpacity>
					)}

					{openCard === "TIME" && (
						<Fragment>
							<Text style={styles.cardHeader}>
								Chọn thời gian chuyến đi
							</Text>

							<Animated.View style={styles.cardBody}>
								{/* Date Range Display */}
								<View style={timeStyles.dateRangeContainer}>
									<View style={timeStyles.dateBox}>
										<Text style={timeStyles.dateLabel}>
											Ngày bắt đầu
										</Text>
										<Text style={timeStyles.dateValue}>
											{startDate
												? formatDateDisplay(startDate)
												: "Chọn ngày"}
										</Text>
									</View>
									<Ionicons
										name='arrow-forward'
										size={20}
										color={Colors.grey}
										style={{ marginHorizontal: 10 }}
									/>
									<View style={timeStyles.dateBox}>
										<Text style={timeStyles.dateLabel}>
											Ngày kết thúc
										</Text>
										<Text style={timeStyles.dateValue}>
											{endDate
												? formatDateDisplay(endDate)
												: "Chọn ngày"}
										</Text>
									</View>
								</View>

								{/* Calendar */}
								<CalendarPicker
									allowRangeSelection={true}
									minDate={new Date()}
									todayBackgroundColor={Colors.primary}
									selectedDayColor={Colors.primary}
									selectedDayTextColor='#FFFFFF'
									selectedRangeStyle={{
										backgroundColor: `${Colors.primary}`,
									}}
									onDateChange={onDateChange}
									width={350}
									months={[
										"Tháng 1",
										"Tháng 2",
										"Tháng 3",
										"Tháng 4",
										"Tháng 5",
										"Tháng 6",
										"Tháng 7",
										"Tháng 8",
										"Tháng 9",
										"Tháng 10",
										"Tháng 11",
										"Tháng 12",
									]}
									weekdays={[
										"CN",
										"T2",
										"T3",
										"T4",
										"T5",
										"T6",
										"T7",
									]}
									previousTitle='Trước'
									nextTitle='Sau'
									textStyle={{
										fontFamily: "mon",
										color: "#000",
									}}
									selectedStartDate={
										startDate
											? new Date(startDate)
											: undefined
									}
									selectedEndDate={
										endDate ? new Date(endDate) : undefined
									}
								/>

								{/* Clear Button */}
								{(startDate || endDate) && (
									<TouchableOpacity
										style={timeStyles.clearBtn}
										onPress={() => {
											setStartDate(undefined)
											setEndDate(undefined)
										}}
									>
										<Text style={timeStyles.clearBtnText}>
											Xóa ngày đã chọn
										</Text>
									</TouchableOpacity>
								)}
							</Animated.View>
						</Fragment>
					)}
				</View>

				{/* PRICE */}
				<View style={styles.card}>
					{openCard !== "PRICE" && (
						<TouchableOpacity
							onPress={() => setOpenCard("PRICE")}
							style={styles.cardPreview}
						>
							<Text style={styles.previewText}>
								Khoảng giá
							</Text>
							<Text style={styles.previewData}>
								{minPrice === undefined &&
								maxPrice === undefined
									? "Không giới hạn"
									: `${
											minPrice !== undefined
												? formatPriceVND(minPrice)
												: "Không giới hạn"
									  } - ${
											maxPrice !== undefined
												? formatPriceVND(maxPrice)
												: "Không giới hạn"
									  }`}
							</Text>
						</TouchableOpacity>
					)}

					{openCard === "PRICE" && (
						<Fragment>
							<Text style={styles.cardHeader}>
								Giới hạn giá phòng
							</Text>

							<Animated.View style={styles.cardBody}>
								{/* Price Feedback */}
								{priceFeedback !== "" && (
									<View
										style={priceStyles.feedbackContainer}
									>
										<Text style={priceStyles.feedbackText}>
											{priceFeedback}
										</Text>
									</View>
								)}

								{/* Min Price */}
								<View style={priceStyles.priceRow}>
									<View style={priceStyles.priceLabelGroup}>
										<Text style={priceStyles.priceLabel}>
											Giá tối thiểu
										</Text>
										<Text style={priceStyles.priceDisplay}>
											{minPrice !== undefined
												? formatPriceVND(minPrice)
												: "Không giới hạn"}
										</Text>
									</View>

									<TextInput
										style={priceStyles.priceInput}
										placeholder='0'
										keyboardType='numeric'
										value={
											minPrice !== undefined
												? minPrice.toString()
												: ""
										}
										onChangeText={(text) => {
											const value = text.replace(
												/[^0-9]/g,
												""
											)
											if (value === "" || value === "0") {
												setMinPrice(undefined)
												setPriceFeedback("")
											} else {
												const numValue = parseInt(value)
												setMinPrice(numValue)
												if (
													maxPrice !== undefined &&
													numValue > maxPrice
												) {
													setPriceFeedback(
														"Giá tối thiểu phải nhỏ hơn hoặc bằng giá tối đa"
													)
												} else {
													setPriceFeedback("")
												}
											}
										}}
									/>
								</View>

								{/* Max Price */}
								<View style={priceStyles.priceRow}>
									<View style={priceStyles.priceLabelGroup}>
										<Text style={priceStyles.priceLabel}>
											Giá tối đa
										</Text>
										<Text style={priceStyles.priceDisplay}>
											{maxPrice !== undefined
												? formatPriceVND(maxPrice)
												: "Không giới hạn"}
										</Text>
									</View>

									<TextInput
										style={priceStyles.priceInput}
										placeholder='0'
										keyboardType='numeric'
										value={
											maxPrice !== undefined
												? maxPrice.toString()
												: ""
										}
										onChangeText={(text) => {
											const value = text.replace(
												/[^0-9]/g,
												""
											)
											if (value === "" || value === "0") {
												setMaxPrice(undefined)
												setPriceFeedback("")
											} else {
												const numValue = parseInt(value)
												setMaxPrice(numValue)
												if (
													minPrice !== undefined &&
													numValue < minPrice
												) {
													setPriceFeedback(
														"Giá tối đa phải lớn hơn hoặc bằng giá tối thiểu"
													)
												} else {
													setPriceFeedback("")
												}
											}
										}}
									/>
								</View>
							</Animated.View>
						</Fragment>
					)}
				</View>

				{/* SPECIFICATION */}
				<View style={styles.card}>
					{openCard !== "SPECIFICATION" && (
						<TouchableOpacity
							onPress={() => setOpenCard("SPECIFICATION")}
							style={styles.cardPreview}
						>
							<Text style={styles.previewText}>
								Thông số phòng
							</Text>
							<Text
								style={styles.previewData}
								numberOfLines={1}
								ellipsizeMode='tail'
							>
								{getSpecificationPreview()}
							</Text>
						</TouchableOpacity>
					)}

					{openCard === "SPECIFICATION" && (
						<Fragment>
							<Text style={styles.cardHeader}>
								Lọc theo thông số phòng
							</Text>

							<Animated.View style={styles.cardBody}>
								{/* Số phòng ngủ */}
								<View style={specStyles.specRow}>
									<Text style={specStyles.specLabel}>
										Số phòng ngủ
									</Text>
									<View style={specStyles.counterGroup}>
										<TouchableOpacity
											style={specStyles.counterBtn}
											onPress={() =>
												minusNumber(bedRooms, setBedRooms)
											}
										>
											<Text
												style={specStyles.counterBtnText}
											>
												−
											</Text>
										</TouchableOpacity>
										<Text style={specStyles.counterValue}>
											{bedRooms ?? 0}
										</Text>
										<TouchableOpacity
											style={specStyles.counterBtn}
											onPress={() => {
												setBedRooms((bedRooms ?? 0) + 1)
											}}
										>
											<Text
												style={specStyles.counterBtnText}
											>
												+
											</Text>
										</TouchableOpacity>
									</View>
								</View>

								{/* Số giường */}
								<View style={specStyles.specRow}>
									<Text style={specStyles.specLabel}>
										Số giường
									</Text>
									<View style={specStyles.counterGroup}>
										<TouchableOpacity
											style={specStyles.counterBtn}
											onPress={() =>
												minusNumber(beds, setBeds)
											}
										>
											<Text
												style={specStyles.counterBtnText}
											>
												−
											</Text>
										</TouchableOpacity>
										<Text style={specStyles.counterValue}>
											{beds ?? 0}
										</Text>
										<TouchableOpacity
											style={specStyles.counterBtn}
											onPress={() => {
												setBeds((beds ?? 0) + 1)
											}}
										>
											<Text
												style={specStyles.counterBtnText}
											>
												+
											</Text>
										</TouchableOpacity>
									</View>
								</View>

								{/* Loại giường */}
								<View style={specStyles.specRow}>
									<Text style={specStyles.specLabel}>
										Loại giường
									</Text>
									<View style={specStyles.toggleGroup}>
										<TouchableOpacity
											style={[
												specStyles.toggleBtn,
												isCoupleBed === false &&
													specStyles.toggleBtnActive,
											]}
											onPress={() =>
												setIsCoupleBed(
													isCoupleBed === false
														? undefined
														: false
												)
											}
										>
											<Text
												style={[
													specStyles.toggleBtnText,
													isCoupleBed === false &&
														specStyles.toggleBtnTextActive,
												]}
											>
												Giường đơn
											</Text>
										</TouchableOpacity>
										<TouchableOpacity
											style={[
												specStyles.toggleBtn,
												isCoupleBed === true &&
													specStyles.toggleBtnActive,
											]}
											onPress={() =>
												setIsCoupleBed(
													isCoupleBed === true
														? undefined
														: true
												)
											}
										>
											<Text
												style={[
													specStyles.toggleBtnText,
													isCoupleBed === true &&
														specStyles.toggleBtnTextActive,
												]}
											>
												Giường đôi
											</Text>
										</TouchableOpacity>
									</View>
								</View>

								{/* Số phòng tắm */}
								<View style={specStyles.specRow}>
									<Text style={specStyles.specLabel}>
										Số phòng tắm
									</Text>
									<View style={specStyles.counterGroup}>
										<TouchableOpacity
											style={specStyles.counterBtn}
											onPress={() =>
												minusNumber(bathRooms, setBathRooms)
											}
										>
											<Text
												style={specStyles.counterBtnText}
											>
												−
											</Text>
										</TouchableOpacity>
										<Text style={specStyles.counterValue}>
											{bathRooms ?? 0}
										</Text>
										<TouchableOpacity
											style={specStyles.counterBtn}
											onPress={() => {
												setBathRooms((bathRooms ?? 0) + 1)
											}}
										>
											<Text
												style={specStyles.counterBtnText}
											>
												+
											</Text>
										</TouchableOpacity>
									</View>
								</View>

								{/* Loại phòng tắm */}
								<View
									style={[
										specStyles.specRow,
										{ borderBottomWidth: 0 },
									]}
								>
									<Text style={specStyles.specLabel}>
										Loại phòng tắm
									</Text>
									<View style={specStyles.toggleGroup}>
										<TouchableOpacity
											style={[
												specStyles.toggleBtn,
												isPrivateBathrooms === true &&
													specStyles.toggleBtnActive,
											]}
											onPress={() =>
												setIsPrivateBathrooms(
													isPrivateBathrooms === true
														? undefined
														: true
												)
											}
										>
											<Text
												style={[
													specStyles.toggleBtnText,
													isPrivateBathrooms === true &&
														specStyles.toggleBtnTextActive,
												]}
											>
												Tắm riêng
											</Text>
										</TouchableOpacity>
										<TouchableOpacity
											style={[
												specStyles.toggleBtn,
												isPrivateBathrooms === false &&
													specStyles.toggleBtnActive,
											]}
											onPress={() =>
												setIsPrivateBathrooms(
													isPrivateBathrooms === false
														? undefined
														: false
												)
											}
										>
											<Text
												style={[
													specStyles.toggleBtnText,
													isPrivateBathrooms === false &&
														specStyles.toggleBtnTextActive,
												]}
											>
												Tắm chung
											</Text>
										</TouchableOpacity>
									</View>
								</View>
							</Animated.View>
						</Fragment>
					)}
				</View>

				{/*  DESTINATION */}
				{/* <View style={styles.card}>
					{openCard !== "DESTINATION" && (
						<TouchableOpacity
							onPress={() => setOpenCard("DESTINATION")}
							style={styles.cardPreview}
						>
							<Text style={styles.previewText}>
								Điểm đến
							</Text>
							<Text style={styles.previewData}>Đà Lạt</Text>
						</TouchableOpacity>
					)}

					{openCard === "DESTINATION" && (
						<Fragment>
							<Text style={styles.cardHeader}>
								Chọn điểm đến chuyến đi
							</Text>

							<Animated.View
								entering={FadeIn}
								exiting={FadeOut}
								style={styles.cardBody}
							>
								<View style={styles.searchSection}>
									<Ionicons
										style={styles.searchIcon}
										name='search-outline'
										size={20}
										color='#000'
									/>
									<TextInput
										style={styles.inputField}
										placeholder='Search destinations'
										placeholderTextColor={Colors.grey}
										onChangeText={(text) =>
											setSearch({
												...(search as any),
												smart_location: text,
											})
										}
									/>
								</View>

								<ScrollView
									horizontal
									showsHorizontalScrollIndicator={false}
									contentContainerStyle={
										styles.placesContainer
									}
								>
									{places.map((item, index) => (
										<TouchableOpacity
											onPress={() => setDestination(index)}
											key={index}
										>
											<Image
												source={item.img}
												style={
													destination == index
														? styles.placeSelected
														: styles.place
												}
											/>
											<Text
												style={{
													fontFamily: "mon",
													paddingTop: 6,
												}}
											>
												{item.title}
											</Text>
										</TouchableOpacity>
									))}
								</ScrollView>
							</Animated.View>
						</Fragment>
					)}
				</View> */}

				{/* Footer */}
				<Animated.View
					style={defaultStyles.footer}
					entering={SlideInDown.delay(200)}
				>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							paddingBottom: 30,
						}}
					>
						<TouchableOpacity
							style={{
								height: "100%",
								justifyContent: "center",
							}}
							onPress={onClearAll}
						>
							<Text
								style={{
									fontSize: 18,
									fontFamily: "mon-sb",
									textDecorationLine: "underline",
								}}
							>
								Xóa tất cả
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={{
								...defaultStyles.btn,
								paddingRight: 20,
								paddingLeft: 50,
							}}
							onPress={onSearch}
						>
							<Ionicons
								name='search-outline'
								size={24}
								style={defaultStyles.btnIcon}
								color={"#fff"}
							/>
							<Text style={defaultStyles.btnText}>
								Search
							</Text>
						</TouchableOpacity>
					</View>
				</Animated.View>
			</BlurView>
		</GestureHandlerRootView>
	)
}

export default Page

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 100,
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
		gap: 20,
	},
	cardHeader: {
		fontFamily: "mon-b",
		fontSize: 24,
		padding: 20,
	},
	cardBody: {
		paddingHorizontal: 20,
		paddingBottom: 20,
	},
	cardPreview: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 20,
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
	},
	previewData: {
		fontFamily: "mon-sb",
		fontSize: 14,
		color: Colors.dark,
		maxWidth: 200,
	},

	guestItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 16,
	},
	itemBorder: {
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: Colors.grey,
	},
})

const priceStyles = StyleSheet.create({
	feedbackContainer: {
		backgroundColor: "#FEE2E2",
		padding: 12,
		borderRadius: 8,
		marginBottom: 16,
	},
	feedbackText: {
		color: "#DC2626",
		fontSize: 14,
	},
	priceRow: {
		marginBottom: 20,
	},
	priceLabelGroup: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "baseline",
	},
	priceLabel: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 8,
		color: "#374151",
	},
	priceInput: {
		borderWidth: 1,
		borderColor: "#D1D5DB",
		borderRadius: 15,
		// textAlign: "center",
		paddingVertical: 10,
		paddingHorizontal: 15,
		fontSize: 16,
		marginBottom: 8,
	},
	priceDisplay: {
		fontSize: 14,
		color: "#6B7280",
		// fontStyle: "italic",
	},
})

const specStyles = StyleSheet.create({
	specRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 16,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: Colors.grey,
	},
	specLabel: {
		fontSize: 16,
		fontWeight: "600",
		color: "#374151",
	},
	counterGroup: {
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
	},
	counterBtn: {
		width: 36,
		height: 36,
		borderRadius: 18,
		borderWidth: 1,
		borderColor: "#D1D5DB",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
	},
	counterBtnText: {
		fontSize: 20,
		fontWeight: "600",
		color: "#374151",
	},
	counterValue: {
		fontSize: 16,
		fontWeight: "600",
		color: "#374151",
		minWidth: 24,
		textAlign: "center",
	},
	toggleGroup: {
		flexDirection: "row",
		gap: 8,
	},
	toggleBtn: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "#D1D5DB",
		backgroundColor: "#fff",
	},
	toggleBtnActive: {
		backgroundColor: Colors.primary,
		borderColor: Colors.primary,
	},
	toggleBtnText: {
		fontSize: 14,
		fontWeight: "500",
		color: "#374151",
	},
	toggleBtnTextActive: {
		color: "#fff",
	},
})

const timeStyles = StyleSheet.create({
	dateRangeContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
	},
	dateBox: {
		flex: 1,
		backgroundColor: "#F9FAFB",
		padding: 12,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#E5E7EB",
	},
	dateLabel: {
		fontSize: 12,
		color: Colors.grey,
		fontFamily: "mon",
		marginBottom: 4,
	},
	dateValue: {
		fontSize: 16,
		fontWeight: "600",
		color: "#374151",
		fontFamily: "mon-sb",
	},
	clearBtn: {
		marginTop: 16,
		padding: 12,
		backgroundColor: "#FEE2E2",
		borderRadius: 8,
		alignItems: "center",
	},
	clearBtnText: {
		color: Colors.red,
		fontSize: 14,
		fontWeight: "600",
		fontFamily: "mon-sb",
	},
})
