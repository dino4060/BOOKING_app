import { UserAPI } from "@/api/UserAPI2"
import Colors from "@/constants/Colors"
import { defaultStyles } from "@/constants/Style"
import { useWarmUpBrowser } from "@/hooks/useWarnUpBrowser"
import {
	getValueSecureStore,
	saveValueSecureStore,
} from "@/store/SecureStore"
import { useUserStore } from "@/store/useUserStore"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import React, { useEffect, useRef, useState } from "react"
import {
	StyleSheet,
	Text,
	TextInput,
	ToastAndroid,
	TouchableOpacity,
	View,
} from "react-native"

const Login = () => {
	useWarmUpBrowser()
	const [data, setData] = useState({
		email: "",
		password: "",
	})
	const passwordRef = useRef<any>(null)
	const [apiError, setApiError] = useState<any>(null)
	const [emailError, setEmailError] = useState<any>(null)
	const [passwordError, setPasswordError] =
		useState<any>(null)
	const saveUserStore = useUserStore(
		(state) => state.updateUser
	)

	useEffect(() => {
		const checkLoggedEmail = async () => {
			const email = await getValueSecureStore("email")
			if (email)
				router.push("/(modals)/loginWithoutEmailField")
		}

		checkLoggedEmail()
	}, [])

	useEffect(() => {
		if (data.password.length === 6) {
			handleLogin()
		}
	}, [data.password])

	const handleTextInputChange = async (
		text: string,
		inputType: string
	) => {
		setData((pre) => ({ ...pre, [inputType]: text }))

		if (inputType === "email") setEmailError("")
		if (inputType === "password") setPasswordError("")

		if (
			inputType === "email" &&
			text.toLowerCase().endsWith(".com")
		) {
			// Focus on the password field
			passwordRef?.current?.focus()
		}
	}

	const validatePassword = (password: string) => {
		if (!password) {
			setPasswordError("Password là bắt buộc")
			return false
		}
		if (password.length !== 6) {
			setPasswordError("Password tối thiểu 6 ký tự")
			return false
		}
		setPasswordError(null)
		return true
	}

	const validateEmail = (email: string) => {
		if (!email) {
			setEmailError("Email là bắt buộc")
			return false
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			setEmailError("Email không hợp lệ")
			return false
		}
		setEmailError(null)
		return true
	}

	const handleLogin = async () => {
		const isEmailValid = validateEmail(data.email)
		const isPasswordValid = validatePassword(data.password)

		if (!isEmailValid || !isPasswordValid) {
			return
		}

		const res = await UserAPI.login(
			data.email,
			data.password
		)
		if (res.success === false) {
			setApiError(res.message)
			return
		}

		const { currentUser: user, accessToken: token } =
			res.data
		saveUserStore(user)
		await saveValueSecureStore("token", token)
		await saveValueSecureStore("email", user.email)
		await saveValueSecureStore("password", data.password)

		ToastAndroid.show("Welcome " + user.name + " 😍", 3000)
		router.push("/(tabs)")
	}

	const handelSignInWithGoogle = async () => {}

	return (
		<View style={style.container}>
			{apiError && (
				<Text style={style.errorText}>{apiError}</Text>
			)}

			<TextInput
				id='email'
				autoCapitalize='none'
				placeholder='email'
				style={[
					defaultStyles.inputField,
					{
						marginBottom: 10,
						borderColor: emailError && "red",
					},
				]}
				onChangeText={(e) => {
					handleTextInputChange(e, "email")
				}}
			/>
			{emailError && (
				<Text style={style.errorText}>{emailError}</Text>
			)}

			<TextInput
				id='password'
				secureTextEntry
				autoCapitalize='none'
				keyboardType='numeric'
				placeholder='password'
				maxLength={6}
				ref={passwordRef}
				style={[
					defaultStyles.inputField,
					{
						marginBottom: 5,
						borderColor: passwordError && "red",
					},
				]}
				onChangeText={(e) => {
					handleTextInputChange(e, "password")
				}}
			/>
			{passwordError && (
				<Text style={style.errorText}>{passwordError}</Text>
			)}
			<TouchableOpacity
				onPress={handleLogin}
				style={{ ...defaultStyles.btn, marginTop: 10 }}
			>
				<Text style={defaultStyles.btnText}>Login</Text>
			</TouchableOpacity>

			<TouchableOpacity
				onPress={() => {
					router.push("/(modals)/inputEmail")
				}}
				style={{
					...defaultStyles.btnCustom_1,
					marginTop: 15,
				}}
			>
				<Text style={defaultStyles.btnText}>
					Forget password?
				</Text>
			</TouchableOpacity>

			<View style={style.seperatorView}>
				<View
					style={{
						borderBottomColor: "#000",
						flex: 1,

						borderBottomWidth: StyleSheet.hairlineWidth,
					}}
				></View>
				<Text style={style.seperator}>or</Text>
				<View
					style={{
						borderBottomColor: "#000",
						flex: 1,

						borderBottomWidth: StyleSheet.hairlineWidth,
					}}
				></View>
			</View>

			<View>
				<TouchableOpacity
					onPress={() => {
						router.push("/(modals)/signup")
						// router.push("/(information)/congatulation")
					}}
					style={style.btnOutline}
				>
					<Ionicons
						name='log-in-outline'
						size={24}
						style={defaultStyles.btnIcon}
					/>
					<Text style={style.btnOutlineText}>
						Bạn chưa có tài khoản? Tạo ngay
					</Text>
				</TouchableOpacity>
			</View>

			<View style={style.seperatorView}>
				<View
					style={{
						borderBottomColor: "#000",
						flex: 1,

						borderBottomWidth: StyleSheet.hairlineWidth,
					}}
				></View>
				<Text style={style.seperator}>Continue with</Text>
				<View
					style={{
						borderBottomColor: "#000",
						flex: 1,
						borderBottomWidth: StyleSheet.hairlineWidth,
					}}
				></View>
			</View>

			<View
				style={{
					borderRightColor: "grey",
					height: 50,
					width: "auto",
					flexDirection: "row",
					justifyContent: "center",
					gap: 30,
				}}
			>
				<TouchableOpacity
					onPress={handelSignInWithGoogle}
					style={{
						height: 100,
						width: 100,
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: "#f9fafb",
						borderRadius: 30,
						borderWidth: 2,
						borderColor: "#33415530",
					}}
				>
					<Ionicons
						name='logo-google'
						size={50}
						color='#ef4444'
					/>
				</TouchableOpacity>

				<TouchableOpacity
					style={{
						height: 100,
						width: 100,
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: "#f9fafb",
						borderRadius: 30,
						borderWidth: 2,
						borderColor: "#33415530",
					}}
				>
					<Ionicons
						name='logo-facebook'
						size={50}
						color='#3b82f6'
					/>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export const style = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FDFFFF",
		padding: 26,
	},
	seperatorView: {
		flexDirection: "row",
		gap: 10,
		alignItems: "center",
		marginVertical: 30,
	},
	errorText: {
		color: "red",
		marginBottom: 10,
	},
	seperator: {
		fontFamily: "mon-sb",
		color: Colors.grey,
	},
	btnOutline: {
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: Colors.grey,
		height: 50,
		borderRadius: 8,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		paddingHorizontal: 10,
	},
	btnOutlineText: {
		color: "#000",
		fontSize: 16,
		fontFamily: "mon-sb",
	},
})

export default Login
