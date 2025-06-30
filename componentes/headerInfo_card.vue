<template>
	<div class="header_card flex-row">
		<div class="header_container w-100 flex-row flex-nowrap">
			<Avatar class="header_avatar_view flex-0-0" size="18vw" :src="userInfo.avatar" shape="circle"
				:showText="false" :text="userInfo.user_name">
				<template v-slot:avatarBadge>
					<text class="avatarBadge w-100 h-100 flex-row flex-center">哪</text>
				</template>
			</Avatar>
			<view class="header_showText flex-col justify-center flex-1-1">
				<text class="show_name">{{hello}} <text
						style="font-weight: bold;">{{ userInfo.user_name }}</text>!</text>
				<text class="show_date">{{ currentDate }}</text>
			</view>
			<view class="header_remind flex-row flex-center flex-0-0">
				<view class="remind_content flex-row flex-center border-50">
					<Remind :value="value" @click="onClick"></Remind>
				</view>
			</view>
		</div>
	</div>
</template>

<script>
	import Avatar from "./avatar/index.vue";
	import Remind from "./remind/index.vue";
	import {
		formatTimeText
	} from "../custom_function/index.js";
	export default {
		components: {
			Avatar,
			Remind,
			formatTimeText
		},
		props: {
			value: {
				type: [String, Number]
			}
		},
		data() {
			return {
				userInfo: {},
				currentDate: ""
			};
		},
		created() {
			const formattedDate = formatTimeText();
			const local = localStorage.getItem("local") || "Zh";
			console.log("formattedDate:", local);
			let default_userInfo = {
				avatar: "../static/avatar.jpg",
				user_name: local == "Zh" ? "哪吒" : "Peter",
			}
			this.userInfo = JSON.parse(localStorage.getItem("user_info"))?.data || default_userInfo;
			this.userInfo.avatar = default_userInfo.avatar;
			this.currentDate = local == "Zh" ? formattedDate.formattedDateZh : formattedDate.formattedDateEn;
			this.hello = local == "Zh" ? "您好" : "Hello"
		},
		mounted() {},
		methods: {
			onClick() {
				this.$emit("messageClick");
			}
		},
	};
</script>

<style scoped lang="less">
	.header_card {
		width: 100%;
		padding: 1rem;

		.header_container {
			.header_avatar_view {
				.avatarBadge {
					background: green;
					color: #fff;
				}
			}

			.header_showText {
				margin: 0 0.25rem 0 0.5rem;
				font-size: 1.25rem;
				line-height: 1.5;

				.show_name {
					color: #666;

					span {
						font-weight: 500;
						color: #1890ff;
					}
				}

				.show_date {
					font-size: 1rem;
					color: #333;
				}
			}

			.header_remind {
				width: 12vw;

				.remind_content {
					display: inline-flex;
					width: 100%;
					aspect-ratio: 1;
					border: 1px solid #999;
					border-radius: 50%;
					cursor: pointer;
				}
			}
		}
	}
</style>