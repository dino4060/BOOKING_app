export const isValidEmail = (email: string) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	return emailRegex.test(email)
}

export const isValidPhoneNumber = (phoneNumber: string) => {
	const phoneRegex = /^\d{10}$/
	return phoneRegex.test(phoneNumber)
}
