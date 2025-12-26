import Colors from "@/constants/Colors"
import { Text, TouchableOpacity, View } from "react-native"

type TProps = {
	title: string
}

const ModalHeader = ({ title }: TProps) => {
	return (
		<View
			style={{
				flexDirection: "row",
				flex: 1,
				justifyContent: "center",
				gap: 10,
				paddingRight: 50,
			}}
		>
			<TouchableOpacity>
				<Text
					style={{
						fontFamily: "mon-sb",
						fontSize: 18,
						color: Colors.dark,
					}}
				>
					{title}
				</Text>
			</TouchableOpacity>
		</View>
	)
}

export default ModalHeader
