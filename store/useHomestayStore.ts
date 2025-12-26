import { TRoom, TRoomParam } from "@/interface/RoomType"
import { create } from "zustand"

type State = {
	homeStayList: TRoom[]
	homeStayParam: TRoomParam
}
type Action = {
	updateHomestayList: (value: TRoom[]) => void
	updateHomestayParam: (value: TRoomParam) => void
}

export const useHomestayStore = create<State & Action>(
	(set: any) => ({
		homeStayList: [],
		updateHomestayList: (value: TRoom[]) =>
			set(() => ({ homeStayList: value })),
		homeStayParam: {},
		updateHomestayParam: (value: TRoomParam) =>
			set(() => ({ homeStayParam: value })),
	})
)
