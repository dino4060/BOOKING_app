import Colors from "@/constants/Colors"
import { Room } from "@/interface/Room"
import BottomSheet, {
	BottomSheetModalProvider,
	BottomSheetView,
} from "@gorhom/bottom-sheet"
import { router } from "expo-router"
import React, { useCallback, useMemo, useRef } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
// import { TouchableOpacity } from "react-native-gesture-handler"
import Listings from "./Listing"
import { GestureHandlerRootView } from "react-native-gesture-handler"

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

	  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

	return (
		<GestureHandlerRootView style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  
		// <BottomSheetModalProvider>
		// 	<BottomSheet
		// 		index={1}
		// 		enableContentPanningGesture={false}
		// 		//enablePanDownToClose={false}
		// 		ref={bottomSheeRef}
		// 		snapPoints={snapPoints}
		// 		handleIndicatorStyle={{
		// 			backgroundColor: Colors.grey,
		// 		}}
		// 	>
		// 		<View style={{ flex: 1 }}>
		// 			<TouchableOpacity
		// 				onPress={() => router.push("/reels/page")}
		// 				style={{
		// 					paddingHorizontal: 10,
		// 					backgroundColor: Colors.primary,
		// 					width: 100,
		// 					borderTopRightRadius: 15,
		// 					borderBottomRightRadius: 15,
		// 					marginBottom: 20,
		// 				}}
		// 			>
		// 				<Text
		// 					style={{
		// 						textAlign: "center",
		// 						fontFamily: "damion",
		// 						color: "white",
		// 						fontSize: 25,
		// 					}}
		// 				>
		// 					Reels
		// 				</Text>
		// 			</TouchableOpacity>
		// 			<Listings
		// 				listings={listing}
		// 				category={category}
		// 			/>
		// 		</View>
		// 	</BottomSheet>
		// </BottomSheetModalProvider>
	)
}

export default ListingBottomSheet

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
});