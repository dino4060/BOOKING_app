import { places } from "@/assets/data/places"
import Colors from "@/constants/Colors"
import { defaultStyles } from "@/constants/Style"
import { Ionicons } from "@expo/vector-icons"
import { TouchableOpacity } from "@gorhom/bottom-sheet"
import { BlurView } from "expo-blur"
import { useRouter } from "expo-router"
import { useState } from "react"
import {
	Image,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native"
import {
	GestureHandlerRootView,
	TextInput,
} from "react-native-gesture-handler"
import Animated, {
	FadeIn,
	FadeOut,
	SlideInDown,
} from "react-native-reanimated"
// @ts-ignore
import { RoomAPI } from "@/api/RoomAPI"
import { SearchOptions } from "@/interface/SearchOptions"
import { useHomestayStore } from "@/store/useHomestayStore"
import DatePicker from "react-native-modern-datepicker"

const Page = () => {
	const [openCard, setOpenCard] = useState(0)
	const [selectedPlace, setSelectedPlace] = useState(0)

	const router = useRouter()
	const today = new Date().toISOString().substring(0, 10)

	const onClearAll = () => {
		setSelectedPlace(0)
		setOpenCard(0)
	}

	const { homeStayList, updateHomestayList } =
		useHomestayStore()

	const [search, setSearch] = useState<SearchOptions>()
	const handleSearch = async () => {
		const getRoomCondition: SearchOptions = {
			...(search as any),
		}
		const res = await RoomAPI.listRooms(
			getRoomCondition as any
		)
		if (Array.isArray(res?.rooms))
			updateHomestayList(res?.rooms)

		router.back()
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<BlurView
				intensity={70}
				style={styles.container}
				tint='light'
				pointerEvents='box-none'
			>
				{/*  Where */}
				<View style={styles.card}>
					{openCard != 0 && (
						<TouchableOpacity
							onPress={() => setOpenCard(0)}
							style={styles.cardPreview}
						>
							<Text style={styles.previewText}>Where</Text>
							<Text style={styles.previewdData}>
								I'm flexible
							</Text>
						</TouchableOpacity>
					)}

					{openCard == 0 && (
						<Text style={styles.cardHeader}>Where to?</Text>
					)}
					{openCard == 0 && (
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
										onPress={() => setSelectedPlace(index)}
										key={index}
									>
										<Image
											source={item.img}
											style={
												selectedPlace == index
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
					)}
				</View>

				{/* When */}
				<View style={styles.card}>
					{openCard != 1 && (
						<TouchableOpacity
							onPress={() => setOpenCard(1)}
							style={styles.cardPreview}
						>
							<Text style={styles.previewText}>When</Text>
							<Text style={styles.previewdData}>
								Any week
							</Text>
						</TouchableOpacity>
					)}

					{openCard == 1 && (
						<Text style={styles.cardHeader}>
							When's your trip?
						</Text>
					)}

					{openCard == 1 && (
						<Animated.View style={styles.cardBody}>
							<DatePicker
								options={{
									defaultFont: "mon",
									headerFont: "mon-sb",
									mainColor: Colors.primary,
									borderColor: "transparent",
								}}
								current={today}
								selected={today}
								mode={"calendar"}
								onSelectedChange={(date: any) =>
									console.log(date)
								}
							/>
						</Animated.View>
					)}
				</View>

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
								Clear all
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[
								defaultStyles.btn,
								{ paddingRight: 20, paddingLeft: 50 },
							]}
							onPress={handleSearch}
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
	previewdData: {
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
	itemBorder: {
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: Colors.grey,
	},
})
export default Page
