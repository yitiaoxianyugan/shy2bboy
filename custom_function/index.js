import moment from "moment";

import UserData from "../dataJson/user.json"

export function formatDate(date, format) {
	format = format || "YYYY/MM/DD";
	let newDate = moment(date).format(format)
	return newDate;
}
export function searchUser(id){
	console.log("UserData",UserData)
	return id;
}