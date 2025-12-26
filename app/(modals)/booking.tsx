import Colors from "@/constants/Colors"
import { defaultStyles } from "@/constants/Style"
import { TSetState } from "@/interface/Base"
import { useHomestayStore } from "@/store/useHomestayStore"
import { formatPriceVND } from "@/utils/number.util"
import { Ionicons } from "@expo/vector-icons"
import { TouchableOpacity } from "@gorhom/bottom-sheet"
import { BlurView } from "expo-blur"
import { useRouter } from "expo-router"
import { Fragment, useEffect, useState } from "react"
import {
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import DatePicker from "react-native-modern-datepicker"
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
							<Text style={styles.previewData}>Tất cả</Text>
						</TouchableOpacity>
					)}

					{openCard === "TIME" && (
						<Fragment>
							<Text style={styles.cardHeader}>
								Chọn thời gian chuyến đi
							</Text>

							<Animated.View style={styles.cardBody}>
								<DatePicker
									isGregorian={true}
									options={{
										defaultFont: "mon",
										headerFont: "mon-sb",
										borderColor: "transparent",
										mainColor: Colors.primary,
									}}
									current={today}
									selected={today}
									mode={"calendar"}
									onSelectedChange={(date: string) =>
										console.log(date)
									}
									onMonthYearChange={(date: string) => {
										console.log(date)
									}}
									// @ts-ignore
									// configs={VNConfigDatetimePicker}
								/>
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
