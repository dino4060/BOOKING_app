import ModalHeader from "@/components/ModalHeader"
import { useColorScheme } from "@/components/useColorScheme"
import Colors from "@/constants/Colors"
import { useUserStore } from "@/store/useUserStore"
// import { ClerkProvider } from "@clerk/clerk-expo"
import { Ionicons } from "@expo/vector-icons"
import * as Font from "expo-font"
import { Stack, useRouter } from "expo-router"
import * as SecureStore from "expo-secure-store"
import * as SplashScreen from "expo-splash-screen"
import { useCallback, useEffect, useState } from "react"
import {
	Dimensions,
	StyleSheet,
	TouchableOpacity,
} from "react-native"
import Animated, {
	interpolate,
	useAnimatedRef,
	useAnimatedStyle,
	useScrollViewOffset,
} from "react-native-reanimated"

SplashScreen.preventAutoHideAsync()

const CLERK_PUBLISHABLE_KEY =
	process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

const tokenCache = {
	async getToken(key: string) {
		try {
			return SecureStore.getItemAsync(key)
		} catch (err) {
			return null
		}
	},
	async saveToken(key: string, value: string) {
		try {
			return SecureStore.setItemAsync(key, value)
		} catch (err) {
			return
		}
	},
}

SplashScreen.hideAsync()

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router"

export const unstable_settings = {
	initialRouteName: "(tabs)",
}

export default function RootLayout() {
	const [appIsReady, setAppIsReady] = useState(false)

	useEffect(() => {
		async function prepare() {
			try {
				// Pre-load fonts, make any API calls you need to do here
				await Font.loadAsync({
					mon: require("@/assets/fonts/Montserrat-Regular.ttf"),
					"mon-sb": require("@/assets/fonts/Montserrat-SemiBold.ttf"),
					"mon-b": require("@/assets/fonts/Montserrat-Bold.ttf"),
					"mon-t": require("@/assets/fonts/Montserrat-Thin.ttf"),
					"amita-b": require("@/assets/fonts/Amita-Bold.ttf"),
					amita: require("@/assets/fonts/Amita-Regular.ttf"),
					damion: require("@/assets/fonts/Damion-Regular.ttf"),
				})
				// Artificially delay for two seconds to simulate a slow loading
				// experience. Please remove this if you copy and paste the code!
				await new Promise((resolve) =>
					setTimeout(resolve, 2000)
				)
			} catch (e) {
				console.warn(e)
			} finally {
				// Tell the application to render
				setAppIsReady(true)
			}
		}

		prepare()
	}, [])

	const onLayoutRootView = useCallback(async () => {
		if (appIsReady) {
			// This tells the splash screen to hide immediately! If we call this after
			// `setAppIsReady`, then we may see a blank screen while the app is
			// loading its initial state and rendering its first pixels. So instead,
			// we hide the splash screen once we know the root view has already
			// performed layout.
			await SplashScreen.hideAsync()
		}
	}, [appIsReady])

	if (!appIsReady) {
		return null
	}

	return (
		// <ClerkProvider
		// 	publishableKey={CLERK_PUBLISHABLE_KEY!}
		// 	tokenCache={tokenCache}
		// >
		<RootLayoutNav />
		// </ClerkProvider>
	)
}

function RootLayoutNav() {
	const colorScheme = useColorScheme()
	const router = useRouter()

	// const { isLoaded, isSignedIn } = useAuth()
	// useEffect(() => {
	// 	if (isLoaded && !isSignedIn)
	// 		router.push("/(modals)/login")
	// }, [isLoaded])

	const updateUser = useUserStore(
		(state) => state.updateUser
	)

	const checkLogedState = async () => {
		router.push("/")
		// const email = await getValueSecureStore("email")
		// const password = await getValueSecureStore("password")
		// if (email && !password) {
		// 	router.push("/(modals)/loginWithoutEmailField")
		// } else if (email && password) {
		// 	const user = await AuthHandle.login(email, password)
		// 	// login fail
		// 	if (!user) return
		// 	// login success
		// 	updateUser(user)
		// 	router.push("/")
		// } else {
		// 	router.push("/(modals)/login")
		// }
	}

	useEffect(() => {
		checkLogedState()
	}, [])

	const scrollRef = useAnimatedRef<Animated.ScrollView>()
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
		<Stack>
			<Stack.Screen
				name='(tabs)'
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name='(modals)/login'
				options={{
					title: "Đăng nhập",

					headerTitleStyle: {
						fontFamily: "mon-sb",
					},
					presentation: "modal",
					headerLeft: () => {
						return (
							<TouchableOpacity
								onPress={() => {
									router.back()
								}}
							>
								<Ionicons name='close-outline' size={28} />
							</TouchableOpacity>
						)
					},
				}}
			/>

			<Stack.Screen
				name='(modals)/signup'
				options={{
					title: "Đăng ký tài khoản mới",

					headerTitleStyle: {
						fontFamily: "mon-sb",
					},
					presentation: "modal",
					headerLeft: () => {
						return (
							<TouchableOpacity
								onPress={() => {
									router.back()
								}}
							>
								<Ionicons name='close-outline' size={28} />
							</TouchableOpacity>
						)
					},
				}}
			/>

			<Stack.Screen
				name='listing/[id]'
				options={{
					headerTitle: "",
					// headerLeft: () => (
					// 	<TouchableOpacity
					// 		style={{
					// 			width: 40,
					// 			height: 40,
					// 			borderRadius: 50,
					// 			backgroundColor: "white",
					// 			alignItems: "center",
					// 			justifyContent: "center",
					// 			// color: Colors.primary,
					// 		}}
					// 		onPress={() => {
					// 			console.log("back")
					// 			router.back()
					// 		}}
					// 	>
					// 		<Ionicons
					// 			name='chevron-down'
					// 			size={24}
					// 			color={"#000"}
					// 		/>
					// 	</TouchableOpacity>
					// ),

					// headerTitle: "",
					// headerTransparent: true,
					// headerBackground: () => (
					// 	<Animated.View
					// 		style={[headerAnimatedStyle, styles2.header]}
					// 	></Animated.View>
					// ),
					// headerRight: () => (
					// 	<View style={styles2.bar}>
					// 		<TouchableOpacity
					// 			style={styles2.roundButton}
					// 			// onPress={shareRoom}
					// 		>
					// 			<Ionicons
					// 				name='share-outline'
					// 				size={22}
					// 				color={"#000"}
					// 			/>
					// 		</TouchableOpacity>
					// 	</View>
					// ),
					// headerLeft: () => (
					// 	<TouchableOpacity
					// 		style={styles2.roundButton}
					// 		onPress={() => {
					// 			console.log("back")
					// 			router.back()
					// 		}}
					// 	>
					// 		<Ionicons
					// 			name='chevron-down'
					// 			size={24}
					// 			color={"#000"}
					// 		/>
					// 	</TouchableOpacity>
					// ),
				}}
			/>
			<Stack.Screen
				name='(modals)/booking'
				options={{
					presentation: "transparentModal",
					animation: "fade",
					headerTransparent: true,
					headerTitle: () => (
						<ModalHeader title='Tìm kiếm nơi lưu trú' />
					),
				}}
			/>
		</Stack>
	)
}

const { width } = Dimensions.get("window")
const IMG_HEIGHT = 340

const styles2 = StyleSheet.create({
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
		maxWidth: "95%",
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
