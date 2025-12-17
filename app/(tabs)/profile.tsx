import { UserAPI } from "@/api/UserAPI"
import Colors from "@/constants/Colors"
import { defaultStyles } from "@/constants/Style"
import { deleteValueSecureStore } from "@/store/SecureStore"
import { useUserStore } from "@/store/useUserStore"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { Link, Stack, router } from "expo-router"
import React, { useEffect, useState } from "react"
import {
	Button,
	Image,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
const profile = () => {
	const [edit, setEdit] = useState(false)
	const [newUsername, setNewUsername] = useState("")
	const [avatarUri, setAvatarUri] = useState(
		"https://avatars.githubusercontent.com/u/92299727?s=96&v=4"
	)

	const user = useUserStore((state) => state.user)

	const handleLogout = async () => {
		deleteValueSecureStore("email")
		router.push("/(modals)/login")
	}

	const handleEdit = () => {
		setEdit(false)
		useUserStore.setState({
			user: { ...user, username: newUsername },
		})
		updateUserName(newUsername)
	}
	useEffect(() => {
		console.log(user)
		if (user.profile_image) {
			setAvatarUri(user.profile_image)
		}
	}, [])

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		})

		if (!result.canceled) {
			const uri = result.assets[0].uri
			const type = result.assets[0].type
			const name = result.assets[0].fileName
			const source = { uri, type, name }

			setAvatarUri(uri)

			updateUser(uri)
		}
	}

	const updateUserName = async (name: string) => {
		try {
			const response = await UserAPI.updateName(
				name,
				user.token,
				user._id
			)
			console.log("Update successful:", response)
		} catch (error) {
			console.error("Update failed:", error)
		}
	}
	const updateUser = async (uri: string) => {
		try {
			const response = await UserAPI.updateUser(
				uri,
				user.token,
				user._id
			)
			console.log("Update successful:", response)
		} catch (error) {
			console.error("Update failed:", error)
		}
	}
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<Stack.Screen
				options={{ header: () => <View></View> }}
			></Stack.Screen>

			<SafeAreaView style={defaultStyles.container}>
				<View style={styles.headerContainer}>
					<Text style={styles.header}>
						Profile {user.username}
					</Text>
					<Ionicons
						name='notifications-outline'
						size={26}
					/>
				</View>

				<View style={styles.card}>
					<TouchableOpacity onPress={pickImage}>
						{user.profile_image ? (
							<Image
								source={{ uri: user.profile_image }} // Chuyển đổi thành chuỗi JavaScript
								style={styles.avatar}
							/>
						) : (
							<Image
								source={{ uri: avatarUri }}
								style={styles.avatar}
							/>
						)}
					</TouchableOpacity>

					<View style={{ flexDirection: "row", gap: 6 }}>
						{!edit && (
							<View style={styles.editRow}>
								<Text
									style={{
										fontFamily: "mon-b",
										fontSize: 22,
									}}
								>
									{user.username}
								</Text>
								<TouchableOpacity
									onPress={() => setEdit(true)}
								>
									<Ionicons
										name='create-outline'
										size={24}
										color={Colors.dark}
									/>
								</TouchableOpacity>
							</View>
						)}
						{edit && (
							<View style={styles.editRow}>
								<TextInput
									style={styles.input}
									value={newUsername}
									onChangeText={setNewUsername}
									placeholder='Enter new username'
								/>
								<TouchableOpacity onPress={handleEdit}>
									<Ionicons
										name='checkmark-outline'
										size={24}
										color={Colors.dark}
									/>
								</TouchableOpacity>
							</View>
						)}
					</View>
					<Text>{user.email}</Text>
					<Text>Since {"16/05/2003"}</Text>
				</View>

				{user.isLogin && (
					<Button
						title='Log Out'
						onPress={handleLogout}
						color={Colors.dark}
					/>
				)}
				{!user.isLogin && (
					<Link href={"/(modals)/login"} asChild>
						<Button title='Log In' color={Colors.dark} />
					</Link>
				)}
			</SafeAreaView>
		</GestureHandlerRootView>
	)
}

const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 24,
	},
	header: {
		fontFamily: "mon-b",
		fontSize: 24,
	},
	card: {
		backgroundColor: "#fff",
		padding: 24,
		borderRadius: 16,
		marginHorizontal: 24,
		marginTop: 24,
		elevation: 2,
		shadowColor: "#000",
		shadowOpacity: 0.2,
		shadowRadius: 6,
		shadowOffset: {
			width: 1,
			height: 2,
		},
		alignItems: "center",
		gap: 14,
		marginBottom: 24,
	},
	avatar: {
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: Colors.grey,
	},
	editRow: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
	},
	input: {
		fontSize: 22,
		borderBottomWidth: 1,
		borderBottomColor: Colors.dark,
		flex: 1,
		marginRight: 8,
	},
})

export default profile
