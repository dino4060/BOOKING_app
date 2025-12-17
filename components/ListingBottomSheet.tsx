import Colors from "@/constants/Colors"
import { Room } from "@/interface/Room"
import BottomSheet, {
	BottomSheetModalProvider,
} from "@gorhom/bottom-sheet"
import { router } from "expo-router"
import React, { useMemo, useRef } from "react"
import { Text, TouchableOpacity, View } from "react-native"
// import { TouchableOpacity } from "react-native-gesture-handler"
import Listings from "./Listing"

interface Props {
	listing: Room[]
	category: string
}

const ListingBottomSheet = ({
	listing,
	category,
}: Props) => {
	const bottomSheeRef = useRef<BottomSheet>(null)
	const snapPoints = useMemo(() => ["10%", "100%"], [])

	return (
		<BottomSheetModalProvider>
			<BottomSheet
				index={1}
				enableContentPanningGesture={false}
				// enablePanDownToClose={false}
				ref={bottomSheeRef}
				snapPoints={snapPoints}
				handleIndicatorStyle={{
					backgroundColor: Colors.grey,
				}}
			>
				<View style={{ flex: 1 }}>
					<TouchableOpacity
						onPress={() => router.push("/reels/page")}
						style={{
							paddingHorizontal: 10,
							backgroundColor: Colors.primary,
							width: 100,
							borderTopRightRadius: 15,
							borderBottomRightRadius: 15,
							marginBottom: 20,
						}}
					>
						<Text
							style={{
								textAlign: "center",
								fontFamily: "damion",
								color: "white",
								fontSize: 25,
							}}
						>
							Reels
						</Text>
					</TouchableOpacity>
					<Listings
						listings={listing}
						category={category}
					/>
				</View>
			</BottomSheet>
		</BottomSheetModalProvider>
	)
}

export default ListingBottomSheet
