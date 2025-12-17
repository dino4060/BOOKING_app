import Colors from "@/constants/Colors"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"
import { Link } from "expo-router"
import React, { useRef, useState } from "react"

import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

interface Props {
	onCategoryChanged: (category: string) => void
}

const ExploreHeader = ({ onCategoryChanged }: Props) => {
	const scrollRef = useRef<ScrollView>(null)
	// const itemsRef = useRef<Array<TouchableOpacity | null>>(
	// 	[]
	// )
	const itemsRef = useRef<Array<any | null>>(
		[]
	)
	const [activeIndex, setActiveIndex] = useState(0)

	const selectCategory = (index: number) => {
		const selected = itemsRef.current[index]
		setActiveIndex(index)
		selected?.measure((x: any) => {
			scrollRef.current?.scrollTo({
				x: x - 16,
				y: 0,
				animated: true,
			})
		})
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
		onCategoryChanged(categories[index].name)
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={styles.container}>
				<View style={styles.actionRow}>
					<Link href={"/(modals)/booking"} asChild>
						<TouchableOpacity>
							<View style={styles.searchBtn}>
								<Ionicons name='search' size={24} />
								<View>
									<Text style={{ fontFamily: "mon-sb" }}>
										Where to?
									</Text>
									<Text
										style={{
											color: Colors.grey,
											fontFamily: "mon",
										}}
									>
										Anywhere · Any week
									</Text>
								</View>
							</View>
						</TouchableOpacity>
					</Link>

					<TouchableOpacity style={styles.filterButton}>
						<Ionicons
							size={21}
							name='color-filter-outline'
						/>
					</TouchableOpacity>
				</View>

				<View>
					<ScrollView
						horizontal
						scrollEnabled={true}
						nestedScrollEnabled={true}
						ref={scrollRef}
						showsHorizontalScrollIndicator={true}
						contentContainerStyle={{
							alignItems: "center",
							gap: 20,
							flex: 1,
							justifyContent: "space-around",
							paddingHorizontal: 16,
						}}
					>
						{categories.map((item, index) => (
							<TouchableOpacity
								ref={(el) => (itemsRef.current[index] = el)}
								key={index}
								style={
									activeIndex === index
										? styles.categoriesBtnActive
										: styles.categoriesBtn
								}
								onPress={() => selectCategory(index)}
							>
								<MaterialIcons
									name={item.icon as any}
									size={24}
									color={
										activeIndex === index
											? "#000"
											: Colors.grey
									}
								/>
								<Text
									style={
										activeIndex === index
											? styles.categoryTextActive
											: styles.categoryText
									}
								>
									{item.name}
								</Text>
							</TouchableOpacity>
						))}
					</ScrollView>
				</View>
			</View>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#fff",
		height: 150,
	},
	scrollList: {
		width: "80%",
		height: 300,
	},
	actionRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 24,
		paddingBottom: 16,
	},
	filterButton: {
		padding: 10,
		borderWidth: 1,
		borderColor: Colors.grey,
		borderRadius: 25,
	},
	searchContainer: {
		flexDirection: "row",
		gap: 10,
		justifyContent: "flex-start",
		alignItems: "center",
	},

	searchBtn: {
		backgroundColor: "#fff",
		flexDirection: "row",
		gap: 10,
		padding: 14,
		alignItems: "center",
		width: 280,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: "#c2c2c2",
		borderRadius: 30,
		elevation: 2,
		shadowColor: "#000",
		shadowOpacity: 0.12,
		shadowRadius: 8,
		shadowOffset: {
			width: 1,
			height: 1,
		},
	},

	filterBtn: {
		padding: 10,
		borderWidth: 1,
		borderColor: "#A2A0A2",
		borderRadius: 24,
	},
	categoryText: {
		fontSize: 12,
		fontFamily: "mon-sb",
		color: Colors.grey,
	},
	categoryTextActive: {
		fontSize: 12,
		fontFamily: "mon-sb",
		color: "#000",
	},
	categoriesBtn: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingBottom: 8,
	},
	categoriesBtnActive: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		borderBottomColor: "#000",
		borderBottomWidth: 2,
		paddingBottom: 8,
	},
})

export default ExploreHeader

const categories = [
	{
		name: "Tiny homes",
		icon: "home",
	},
	{
		name: "Cabins",
		icon: "house-siding",
	},
	{
		name: "Trending",
		icon: "local-fire-department",
	},
	{
		name: "Play",
		icon: "videogame-asset",
	},
]
