import { Room } from "@/interface/Room"
import { create } from "zustand"

type State = {
	homeStayList: Room[]
}
type Action = {
	updateHomestayList: (room: State["homeStayList"]) => void
}

export const useHomestayStore = create<State & Action>(
	(set: any) => ({
		homeStayList: [],
		updateHomestayList: (homeStayList: Room[]) =>
			set(() => ({ homeStayList })),
	})
)
