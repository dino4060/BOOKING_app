import LocationAPI from "@/api/LocationAPI"
import { DMS } from "@/interface/common"
import { TDestination, TRoom } from "@/interface/RoomType"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useEffect, useRef, useState } from "react"
import {
	Dimensions,
	StyleSheet,
	Text,
	View,
} from "react-native"
import MapView from "react-native-map-clustering"
import { Marker, PROVIDER_GOOGLE } from "react-native-maps"

interface Props {
	listings: TRoom[]
	destination: TDestination
}

const CoordinateDelta = {
	latitudeDelta: 0.15,
	longitudeDelta: 0.15,
}

const ListingMap = ({ listings, destination }: Props) => {
	const router = useRouter()
	const mapRef: any = useRef(null)
	const [mapInitialized, setMapInitialized] =
		useState(false)
	const [searchDestination, setSearchDestination] =
		useState<string>("")

	useEffect(() => {
		mapRef.current.animateToRegion(
			{
				...destination.coordinates,
				...CoordinateDelta,
			},
			1500
		)
	}, [destination])

	const onMarkSelected = (mark: TRoom) => {
		router.push(`/listing/${mark.id}`)
	}

	const onMapReady = async () => {
		if (mapInitialized) {
			return
		}

		setMapInitialized(true)
	}

	const renderCluster = (cluster: any) => {
		const { id, geometry, onPress, properties } = cluster
		return (
			<Marker
				key={id}
				onPress={onPress}
				coordinate={{
					longitude: geometry.coordinates[0],
					latitude: geometry.coordinates[1],
				}}
			>
				<View style={styles.cluster}>
					<Text style={styles.clusterText}>
						{properties.point_count}
					</Text>
				</View>
			</Marker>
		)
	}

	const handleSubmit = async () => {
		const response: DMS = await LocationAPI.searchLocation(
			searchDestination
		)

		const animatedToRegion = (la: number, long: number) => {
			let region = {
				latitude: la,
				longitude: long,
				latitudeDelta: 0.05,
				longitudeDelta: 0.05,
			}

			mapRef.current.animateToRegion(region, 2000)
		}

		animatedToRegion(response.la, response.long)
	}

	return (
		<View style={styles.container}>
			<MapView
				ref={mapRef}
				style={styles.map}
				onLayout={onMapReady}
				animationEnabled={false}
				clusterColor='#fff'
				showsUserLocation
				provider={PROVIDER_GOOGLE}
				showsMyLocationButton
				renderCluster={renderCluster}
				initialRegion={{
					...destination.coordinates,
					...CoordinateDelta,
				}}
			>
				{listings.map((r: TRoom, i: number) => {
					return (
						<Marker
							onPress={() => onMarkSelected(r)}
							key={i}
							coordinate={{
								latitude: r.latitude
									? parseFloat(r.latitude.toString())
									: 0,
								longitude: r.longitude
									? parseFloat(r.longitude.toString())
									: 0,
							}}
						>
							<View style={styles.marker}>
								<Ionicons
									name='bed'
									color='white'
									size={20}
								/>
							</View>
						</Marker>
					)
				})}
			</MapView>

			{/* <View style={styles.searchBox}>
        <Ionicons name="location-outline" color="#27272a" size={25} />
        <TextInput
          value={searchDestination}
          onChangeText={setSearchDestination}
          onSubmitEditing={handleSubmit}
          placeholder="Know destination? Search here..."
          style={styles.inputStyle}
        />
      </View> */}
		</View>
	)
}

export default ListingMap

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	inputStyle: {
		width: "100%",
		fontSize: 18,

		fontFamily: "mon-sb",
		color: "#0a0a0a",
	},
	searchBox: {
		position: "absolute",
		left: 0,
		right: 0,
		height: 50,
		top: 0,
		paddingHorizontal: 10,
		backgroundColor: "white",
		flexDirection: "row",
		gap: 10,

		alignItems: "center",
		borderBottomLeftRadius: 30, // Add this line
		borderBottomRightRadius: 30, // Add this line
	},
	map: {
		position: "absolute",
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
		flex: 1,
	},
	marker: {
		padding: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#e11d48",
		elevation: 5,
		borderRadius: 12,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 6,
		shadowOffset: {
			width: 1,
			height: 10,
		},
	},
	cluster: {
		padding: 8,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#1d4ed870",
		elevation: 5,
		borderRadius: 12,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 6,
		shadowOffset: {
			width: 1,
			height: 10,
		},
	},
	markerText: {
		fontSize: 14,
		color: "white",
		// fontFamily: "mon-sb",
	},
	clusterText: {
		fontSize: 14,
		color: "white",
		// fontFamily: "mon-sb",
	},
	locateBtn: {
		position: "absolute",
		top: 70,
		right: 20,
		backgroundColor: "#fff",
		padding: 10,
		borderRadius: 10,
		elevation: 2,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 6,
		shadowOffset: {
			width: 1,
			height: 10,
		},
	},
})
