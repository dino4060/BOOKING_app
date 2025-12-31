export const formatPriceVND = (
	price: number | null | undefined
): string => {
	if (price == null) return "₫0"

	const formatted = new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(price)

	// Chuyển "100.000 ₫" thành "100.000"
	return formatted.replace(/\s₫/, "").replace(/^/, "₫")
}

const formatDateVN = (
	dateStr: string | undefined // format YYYY/MM/DD
) => {
	if (!dateStr) return ""
	// Convert to DD/MM/YYYY
	const parts = dateStr.split("/")
	if (parts.length === 3) {
		return `${parts[2]}/${parts[1]}/${parts[0]}`
	}
	return dateStr
}

export const formatExperienceInfo = (
	dateString: Date | null | undefined
) => {
	if (!dateString) return ""

	const pastDate = new Date(dateString)
	const currentDate = new Date()

	const pastYear = pastDate.getFullYear()
	const currentYear = currentDate.getFullYear()

	// 1. Kiểm tra khác năm
	if (pastYear !== currentYear) {
		const yearDiff = currentYear - pastYear
		const x = Math.max(yearDiff, 0)
		return `Với ${x} năm kinh nghiệm đón tiếp khách`
	}

	// 2. Khác tháng (cùng năm)
	const pastMonth = pastDate.getMonth()
	const currentMonth = currentDate.getMonth()

	if (pastMonth !== currentMonth) {
		const monthDiff = currentMonth - pastMonth
		const x = Math.max(monthDiff, 0)
		return `Với ${x} tháng kinh nghiệm đón tiếp khách`
	}

	// 3. Trường hợp cùng tháng cùng năm (tùy chọn xử lý thêm)
	return "Mới bắt đầu kinh nghiệm đón tiếp khách"
}
