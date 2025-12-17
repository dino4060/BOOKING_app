import { create } from "zustand"
export interface User {
	_id: string
	username: string
	phoneNumber: string
	email: string
	isLogin: boolean
	created_at: Date
	profile_image: string | null
	token: string
}

type State = {
	user: User
}

type Action = {
	updateUser: (user: State["user"]) => void
}

// Create your store, which includes both state and (optionally) actions
export const useUserStore = create<State & Action>(
	(set) => ({
		user: {
			_id: "",
			username: "",
			email: "",
			phoneNumber: "",
			isLogin: false,
			created_at: new Date(),
			profile_image: "",
			token: "",
		},
		updateUser: (user: User) => set(() => ({ user })),
	})
)
