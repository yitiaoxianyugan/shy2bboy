import moment from "moment";

import UserData from "../dataJson/user.json"
const userList = UserData.table_list;
// 格式化时间
export function formatDate(date, format) {
	format = format || "YYYY/MM/DD";
	let newDate = moment(date).format(format)
	return newDate;
}
// 查找用户
export function searchUser(key, value) {
	const user = userList.find(item => item[key] === value);
	return user === undefined ? false : user;
}
// 登录
export function login(userInfo) {
	let tempItem = {
		user_id: userInfo.account,
		user_pwd: userInfo.password
	}
	const user = userList.find(item => item.user_id === tempItem.user_id);
	if (user === undefined) {
		showToast("用户不存在!");
		return false;
	} else {
		if (tempItem.user_pwd === user.user_pwd) {
			showToast("登录成功!");
			uni.setStorageSync("user_info",user);
			return true;
		} else {
			showToast("密码错误!");
			return false;
		}
	}
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

// 加载状态
let dots = ".";
export function loadState(state,loadTextBase,dotNum){
	let loadText = "";
	loadTextBase = loadTextBase || "加载中";
	dotNum = dotNum || 6;
	if(state){
		loadText = loadTextBase + dots
		if(dots.length >= dotNum){
			dots = ".";
		}else{
			dots += "."
		}
	}else{
		dots = ".";
		loadText = ""
	}
	return loadText;
}

