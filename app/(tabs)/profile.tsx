import { UserAPI } from "@/api/UserAPI"
import { UserAvatarUrl } from "@/assets/data/default"
import Colors from "@/constants/Colors"
import { defaultStyles } from "@/constants/Style"
import { deleteValueSecureStore } from "@/store/SecureStore"
import {
	DefaultUser,
	useUserStore,
} from "@/store/useUserStore"
import {
	isValidEmail,
	isValidPhoneNumber,
} from "@/utils/validation"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { Link, Stack, router } from "expo-router"
import React, { Fragment, useEffect, useState } from "react"
import {
	Button,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"

const profile = () => {
	const [avatarUrl, setAvatarUrl] = useState(UserAvatarUrl)
	const user = useUserStore((state) => state.user)

	const { updateUser: saveUserStore } = useUserStore()
	const [edit, setEdit] = useState(false)
	const [newUsername, setNewUsername] = useState("")
	const [newEmail, setNewEmail] = useState("")
	const [newPhone, setNewPhone] = useState("")
	const [profileFeedback, setProfileFeedback] = useState("")

	useEffect(() => {
		if (user.avatarUrl) {
			setAvatarUrl(user.avatarUrl)
		}
	}, [])

	const handleLogout = async () => {
		await deleteValueSecureStore("token")
		saveUserStore({ ...DefaultUser, name: user.name })
		router.push("/")
	}

	const handleEdit = async () => {
		// Validate
		if (!newUsername.trim()) {
			setProfileFeedback("Vui lòng nhập họ tên")
			return
		}
		if (!newEmail.trim()) {
			setProfileFeedback("Vui lòng nhập email")
			return
		}
		if (!newPhone.trim()) {
			setProfileFeedback("Vui lòng nhập số điện thoại")
			return
		}

		if (!isValidEmail(newEmail)) {
			setProfileFeedback("Email không hợp lệ")
			return
		}

		if (!isValidPhoneNumber(newPhone)) {
			setProfileFeedback(
				"Số điện thoại không hợp lệ (10-11 số)"
			)
			return
		}

		// Clear feedback and call API
		setProfileFeedback("")
		const res = await UserAPI.update(
			newUsername,
			newEmail,
			newPhone
		)
		if (res.success === false) {
			setProfileFeedback(res.message)
			return
		}

		saveUserStore({
			...user,
			name: newUsername,
			email: newEmail,
			phone: newPhone,
		})
		setEdit(false)
	}

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

			setAvatarUrl(uri)

			updateUser(uri)
		}
	}

	const updateUserName = async (name: string) => {
		try {
			const response = await UserAPI.updateName(
				name,
				"", // user.token,
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
				"", // user.token,
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

			{user.isLogin && (
				<SafeAreaView style={defaultStyles.container}>
					<View style={styles.headerContainer}>
						<Text style={styles.header}>
							Hi! {user.name}
						</Text>
						<Ionicons
							name='notifications-outline'
							size={26}
						/>
					</View>

					<View style={styles.card}>
						{/* <TouchableOpacity onPress={pickImage}>
							{user.avatarUrl ? (
								<Image
									source={{ uri: user.avatarUrl }}
									style={styles.avatar}
								/>
							) : (
								<Image
									source={{ uri: avatarUrl }}
									style={styles.avatar}
								/>
							)}
						</TouchableOpacity> */}

						{/* Display Mode */}
						{!edit && (
							<Fragment>
								<Text
									style={{
										fontFamily: "mon-b",
										fontSize: 22,
									}}
								>
									{user.name}
								</Text>
								<Text
									style={styles.infoText}
								>{`Email: ${user.email}`}</Text>
								<Text
									style={styles.infoText}
								>{`Số điện thoại: ${user.phone}`}</Text>

								{/* Edit Button */}
								<TouchableOpacity
									// style={styles.editButton}
									style={{ paddingHorizontal: 20 }}
									onPress={() => {
										setEdit(true)
										setNewUsername(user.name)
										setNewEmail(user.email)
										setNewPhone(user.phone)
									}}
								>
									<Ionicons
										name='create-outline'
										size={20}
										color={Colors.dark}
									/>
									{/* <Text style={styles.editButtonText}>
										Chỉnh sửa hồ sơ
									</Text> */}
								</TouchableOpacity>
							</Fragment>
						)}

						{/* Edit Mode */}
						{edit && (
							<View
								style={{
									width: "100%",
								}}
							>
								{/* Form Inputs */}
								<View style={styles.formGroup}>
									<Text style={styles.formLabel}>
										Họ tên
									</Text>
									<TextInput
										style={styles.formInput}
										value={newUsername}
										onChangeText={setNewUsername}
										placeholder='Nhập họ tên'
									/>
								</View>

								<View style={styles.formGroup}>
									<Text style={styles.formLabel}>
										Email
									</Text>
									<TextInput
										style={styles.formInput}
										value={newEmail}
										onChangeText={setNewEmail}
										placeholder='Nhập email'
										keyboardType='email-address'
										autoCapitalize='none'
									/>
								</View>

								<View style={styles.formGroup}>
									<Text style={styles.formLabel}>
										Số điện thoại
									</Text>
									<TextInput
										style={styles.formInput}
										value={newPhone}
										onChangeText={setNewPhone}
										placeholder='Nhập số điện thoại'
										keyboardType='phone-pad'
									/>
								</View>

								{/* Profile Feedback */}
								{profileFeedback !== "" && (
									<View style={styles.feedbackContainer}>
										<Text style={styles.feedbackText}>
											{profileFeedback}
										</Text>
									</View>
								)}

								{/* Action Buttons */}
								<View style={styles.actionButtonsRow}>
									<TouchableOpacity
										style={styles.cancelButton}
										onPress={() => {
											setEdit(false)
											setProfileFeedback("")
										}}
									>
										<Ionicons
											name='close-outline'
											size={20}
											color={Colors.dark}
										/>
										<Text style={styles.cancelButtonText}>
											Hủy
										</Text>
									</TouchableOpacity>

									<TouchableOpacity
										style={styles.saveButton}
										onPress={handleEdit}
									>
										<Ionicons
											name='checkmark-outline'
											size={20}
											color='#fff'
										/>
										<Text style={styles.saveButtonText}>
											Lưu
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						)}
					</View>

					<Button
						title='Log Out'
						onPress={handleLogout}
						color={Colors.dark}
					/>
				</SafeAreaView>
			)}

			{!user.isLogin && (
				<SafeAreaView>
					<View style={styles.headerContainer}>
						<Text style={styles.header}>Profile</Text>
						<Ionicons
							name='notifications-outline'
							size={26}
						/>
					</View>

					<Link href={"/(modals)/login"} asChild>
						<Button title='Login' color={Colors.dark} />
					</Link>
				</SafeAreaView>
			)}
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
	//
	infoText: {
		fontSize: 16,
		color: "#374151",
		fontFamily: "mon",
	},
	editButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.primary,
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		gap: 8,
		marginTop: 8,
	},
	editButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
		fontFamily: "mon-sb",
	},
	formGroup: {
		marginBottom: 16,
	},
	formLabel: {
		fontSize: 14,
		fontWeight: "600",
		color: "#374151",
		marginBottom: 8,
		fontFamily: "mon-sb",
	},
	formInput: {
		borderWidth: 1,
		borderColor: "#D1D5DB",
		borderRadius: 8,
		paddingVertical: 12,
		paddingHorizontal: 16,
		fontSize: 16,
		fontFamily: "mon",
		backgroundColor: "#fff",
	},
	feedbackContainer: {
		backgroundColor: "#FEE2E2",
		padding: 12,
		borderRadius: 8,
		marginBottom: 16,
	},
	feedbackText: {
		color: "#DC2626",
		fontSize: 14,
		fontFamily: "mon",
	},
	actionButtonsRow: {
		flexDirection: "row",
		gap: 12,
		marginTop: 8,
	},
	cancelButton: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#F3F4F6",
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		gap: 8,
		borderWidth: 1,
		borderColor: "#D1D5DB",
	},
	cancelButtonText: {
		color: Colors.dark,
		fontSize: 16,
		fontWeight: "600",
		fontFamily: "mon-sb",
	},
	saveButton: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.primary,
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		gap: 8,
	},
	saveButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
		fontFamily: "mon-sb",
	},
})

export default profile
