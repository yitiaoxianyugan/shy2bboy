import moment from "moment";

import UserData from "../dataJson/user.json"

export function formatDate(date, format) {
	format = format || "YYYY/MM/DD";
	let newDate = moment(date).format(format)
	return newDate;
}
export function searchUser(key,value){
	console.log("UserData",UserData)
	return id;
}
export function login(userInfo){
	return false
}
// 展示提示
export function showToast(title, type, duration) {
	uni.showToast({
		title: title,
		icon: type || 'none',
		mask: true,
		duration: duration || 2000
	});
}