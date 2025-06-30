export default{
	props: {
		item: {
			type: Object
		}
	},
	computed: {
		userType() {
			let type = ""; // "","autor","mine"
			let userInfo = JSON.parse(localStorage.getItem("user_info")) || {};
			let current_userId = userInfo.data?.user_id || null;
			let user_id = this.item.user_id;
			let autor_id = this.item.autor_id;
			if (current_userId === user_id && current_userId === autor_id) {
				type = "mine"
			} else if (current_userId === user_id) {
				type = "mine"
			} else if (autor_id === user_id) {
				type = "autor"
			} else {
				type = "";
			}
			return type;
		},
		Time(){
			
		}
	},
	methods: {
		changeLikeStatus(e) {
			let status = e.likeStatus;
			if (status) {
				e.likeNum -= 1;
			} else {
				e.likeNum += 1;
			}
			e.likeStatus = !status
		}
	}
}