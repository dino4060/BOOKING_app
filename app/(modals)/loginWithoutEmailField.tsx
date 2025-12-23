import { UserAPI } from "@/api/UserAPI2"
import { defaultStyles } from "@/constants/Style"
import {
	deleteValueSecureStore,
	getValueSecureStore,
	saveValueSecureStore,
} from "@/store/SecureStore"
import { useUserStore } from "@/store/useUserStore"
import { Stack, router } from "expo-router"
import React, { useEffect, useState } from "react"
import {
	Text,
	TextInput,
	ToastAndroid,
	TouchableOpacity,
	View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const LoginWithoutEmailField = () => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const saveUserStore = useUserStore(
		(state) => state.updateUser
	)

	useEffect(() => {
		const initEmail = async () => {
			setEmail((await getValueSecureStore("email")) || "")
		}

		initEmail()
	}, [])

	useEffect(() => {
		if (password.length === 6) {
			handleLogin()
		}
	}, [password])

	const handleLogin = async () => {
		if (!email) {
			return
		}

		console.log("login body: " + email + password)

		const res = await UserAPI.login(email, password)
		if (res.success === false) {
			// setApiError(res.message)
			return
		}

		const { currentUser: user, accessToken: token } =
			res.data
		saveUserStore(user)
		await saveValueSecureStore("token", token)
		await saveValueSecureStore("email", user.email)
		await saveValueSecureStore("password", password)

		ToastAndroid.show(
			"Welcome back " + user.name + " 😍",
			3000
		)
		router.push("/")
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<Stack.Screen
				options={{
					header: () => <></>,
				}}
			></Stack.Screen>
			<View
				style={{
					margin: 50,
				}}
			>
				<Text
					style={{
						marginTop: 20,
						fontFamily: "mon-sb",
						fontSize: 30,
						letterSpacing: -2,
						textAlign: "center",
					}}
				>
					{`Welcome back! ${email}`}
				</Text>
				<Text
					style={{
						fontFamily: "mon",
						fontSize: 15,
						letterSpacing: 0,
						textAlign: "center",
						marginTop: 15,
						marginBottom: 10,
					}}
				>
					Nhập mật khẩu ở đây
				</Text>
				<TextInput
					id='password'
					autoFocus
					value={password}
					onChangeText={(text) => {
						setPassword(text)
					}}
					maxLength={6}
					autoCapitalize='none'
					placeholder='******'
					keyboardType='numeric'
					secureTextEntry
					style={[
						defaultStyles.inputField,
						{
							height: "auto",

							fontFamily: "mon",
							fontSize: 30,
							textAlign: "center",
						},
					]}
				/>

				<TouchableOpacity
					onPress={async () => {
						await deleteValueSecureStore("email")
						router.push("/(modals)/login")
					}}
					style={{
						...defaultStyles.btnCustom_1,
						marginTop: 15,
					}}
				>
					<Text style={defaultStyles.btnText}>
						Dùng email khác 🤔?
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	)
}

export default LoginWithoutEmailField
