import { AuthAPI } from "@/api/AuthAPI"
import { defaultStyles } from "@/constants/Style"
import { useWarmUpBrowser } from "@/hooks/useWarnUpBrowser"
import { saveValueSecureStore } from "@/store/SecureStore"
import { useUserStore } from "@/store/useUserStore"
import {
	isValidEmail,
	isValidPhoneNumber,
} from "@/utils/validation"
// import { useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router"
import React, { useState } from "react"
import {
	StyleSheet,
	Text,
	TextInput,
	ToastAndroid,
	TouchableOpacity,
	View,
} from "react-native"

export const DefaultRegisterUser = {
	email: "",
	name: "",
	password: "",
	retypePassword: "",
	phone: "",
}

const Signup = () => {
	useWarmUpBrowser()
	const saveUserStore = useUserStore(
		(state) => state.updateUser
	)
	const [data, setData] = useState(DefaultRegisterUser)
	const [errors, setErrors] = useState(DefaultRegisterUser)
	const [signupError, setSignupError] = useState("")
	const router = useRouter()

	const handleTextInputChange = (
		text: string,
		inputType: string
	) => {
		setData((prevData) => ({
			...prevData,
			[inputType]: text,
		}))
		// Clear previous error message
		setErrors((prevErrors) => ({
			...prevErrors,
			[inputType]: "",
		}))
	}

	const validateForm = () => {
		let isValid = true
		const updatedErrors = { ...errors }

		if (!data.name.trim()) {
			updatedErrors.name = "Tên là bắt buộc"
			isValid = false
		}

		if (!data.email.trim()) {
			updatedErrors.email = "Email là bắt buộc"
			isValid = false
		} else if (!isValidEmail(data.email)) {
			updatedErrors.email = "Email không hợp lệ"
			isValid = false
		}

		if (!data.phone.trim()) {
			updatedErrors.phone = "Số điện thoại là bắt buộc"
			isValid = false
		} else if (!isValidPhoneNumber(data.phone)) {
			updatedErrors.phone = "Số điện thoại không hợp lệ"
			isValid = false
		}

		if (!/^\d{6}$/.test(data.password)) {
			updatedErrors.password = "Mật khẩu gồm 6 kí tự"
			isValid = false
		}

		if (data.password !== data.retypePassword) {
			updatedErrors.retypePassword =
				"Mật khẩu không giống nhau"
			isValid = false
		}

		setErrors(updatedErrors)
		return isValid
	}

	const handleSignUp = async () => {
		if (!validateForm()) return

		const res = await AuthAPI.register(
			data.name,
			data.email,
			data.password,
			data.phone
		)
		if (res.success === false) {
			setSignupError(res.message)
			return
		}
		const { currentUser: user, accessToken: token } =
			res.data

		saveUserStore(user)
		await saveValueSecureStore("token", token)
		await saveValueSecureStore("email", user.email)

		ToastAndroid.showWithGravity(
			"Khám phá phòng đẹp ngay!",
			ToastAndroid.SHORT,
			ToastAndroid.BOTTOM
		)
		router.push("/")
	}

	return (
		<View style={style.container}>
			<TextInput
				autoCapitalize='none'
				placeholder='Tên khách hàng'
				style={[
					defaultStyles.inputField,
					{ marginBottom: 5 },
				]}
				onChangeText={(text) =>
					handleTextInputChange(text, "name")
				}
			/>
			{errors.name ? (
				<Text style={style.errorText}>{errors.name}</Text>
			) : null}

			<TextInput
				autoCapitalize='none'
				placeholder='Địa chỉ email'
				style={[
					defaultStyles.inputField,
					{ marginBottom: 5 },
				]}
				onChangeText={(text) =>
					handleTextInputChange(text, "email")
				}
			/>
			{errors.email ? (
				<Text style={style.errorText}>{errors.email}</Text>
			) : null}

			<TextInput
				autoCapitalize='none'
				placeholder='Số điện thoại'
				style={[
					defaultStyles.inputField,
					{ marginBottom: 5 },
				]}
				onChangeText={(text) =>
					handleTextInputChange(text, "phone")
				}
			/>
			{errors.phone ? (
				<Text style={style.errorText}>{errors.phone}</Text>
			) : null}

			<TextInput
				autoCapitalize='none'
				placeholder='Mật khẩu tối thiểu 6 chữ số'
				keyboardType='numeric'
				maxLength={6}
				style={[
					defaultStyles.inputField,
					{ marginBottom: 5 },
				]}
				secureTextEntry={true}
				onChangeText={(text) =>
					handleTextInputChange(text, "password")
				}
			/>
			{errors.password ? (
				<Text style={style.errorText}>
					{errors.password}
				</Text>
			) : null}

			<TextInput
				autoCapitalize='none'
				placeholder='Xác nhận lại mật khẩu'
				style={[
					defaultStyles.inputField,
					{ marginBottom: 5 },
				]}
				maxLength={6}
				keyboardType='numeric'
				secureTextEntry={true}
				onChangeText={(text) =>
					handleTextInputChange(text, "retypePassword")
				}
			/>
			{errors.retypePassword ? (
				<Text style={style.errorText}>
					{errors.retypePassword}
				</Text>
			) : null}

			{signupError ? (
				<Text style={style.errorText}>{signupError}</Text>
			) : null}

			<TouchableOpacity
				style={defaultStyles.btn}
				onPress={handleSignUp}
			>
				<Text style={defaultStyles.btnText}>Register</Text>
			</TouchableOpacity>
		</View>
	)
}

const style = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FDFFFF",
		padding: 26,
	},
	errorText: {
		color: "red",
		marginBottom: 15,
	},
})

export default Signup
