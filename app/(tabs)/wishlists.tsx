import WishList from "@/components/WishList"
import { Wishlist } from "@/interface/Wishlist"
import { WishlistHandle } from "@/utils/Function"
import { Stack, useFocusEffect } from "expo-router"
import React, {
	useCallback,
	useState
} from "react"
import { View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"

const Wishlists = () => {
	const [list, setList] = useState([])

	useFocusEffect(
		useCallback(() => {
			init()
		}, [])
	)
	const init = async () => {
		const res: Wishlist[] =
			await WishlistHandle.getWishList()
		setList(res as any)
	}
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<SafeAreaView style={{ flex: 1 }}>
				<Stack.Screen
					options={{
						header: () => <View></View>,
					}}
				></Stack.Screen>

				<WishList listings={list} />
			</SafeAreaView>
		</GestureHandlerRootView>
	)
}

export default Wishlists
