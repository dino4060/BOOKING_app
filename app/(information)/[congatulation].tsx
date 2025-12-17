import { defaultStyles } from "@/constants/Style"
import { Ionicons } from "@expo/vector-icons"
import {
	Stack,
	router,
	useLocalSearchParams,
} from "expo-router"
import { default as React } from "react"
import { Text, View } from "react-native"
import {
	GestureHandlerRootView,
	TouchableOpacity,
} from "react-native-gesture-handler"

const Congatulation = () => {
	const { congatulation } = useLocalSearchParams()

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<View
				style={{
					flex: 1,
					height: "auto",
					width: "auto",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Stack.Screen
					options={{
						header: () => <></>,
					}}
				></Stack.Screen>
				<Text
					style={{
						fontSize: 30,
						fontFamily: "mon-b",
						textAlign: "center",
						backgroundColor: "#fee2e2",
						color: "#0c0a09",
						padding: 30,
						borderRadius: 30,
						marginHorizontal: 20,
					}}
				>
					{congatulation}
				</Text>
				<TouchableOpacity
					onPress={() => {
						// router.push("/(modals)/login")
						router.push("/")
					}}
					style={{
						...defaultStyles.btn,
						marginTop: 10,
						width: 200,
						backgroundColor: "#111827",
						flexDirection: "row",
						alignItems: "center",
						gap: 5,
					}}
				>
					<Ionicons
						name='log-in-outline'
						size={25}
						color='white'
					/>

					<Text style={defaultStyles.btnText}>
						Back to login
					</Text>
				</TouchableOpacity>
			</View>
		</GestureHandlerRootView>
	)
}

export default Congatulation
