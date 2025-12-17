import { create } from "zustand"

type State = {
	email: any
}

type Action = {
	updateEmail: (user: State["email"]) => void
}

// Create your store, which includes both state and (optionally) actions
export const useForgetPasswordStore = create<
	State & Action
>((set) => ({
	email: {
		email: "",
	},
	updateEmail: (email: any) =>
		set(() => ({ email: email })),
}))
