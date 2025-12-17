import * as SecureStore from "expo-secure-store"

export async function saveValueSecureStore(
	key: string,
	value: string
) {
	await SecureStore.setItemAsync(key, value)
}

export async function getValueSecureStore(key: string) {
	let result = await SecureStore.getItemAsync(key)

	return result
}

export async function deleteValueSecureStore(key: string) {
	try {
		await SecureStore.deleteItemAsync(key)
	} catch (error) {}
}
