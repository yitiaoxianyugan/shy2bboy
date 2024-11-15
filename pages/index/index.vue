<template>
	<view class="page-bg content d-flex flex-center">
		<div class="image-box">
			<image class="logo" src="/static/poster.png" style="width:100%;height:100%"></image>
		</div>
	</view>
</template>

<script>
	import { formatDate } from "../../custom_function/index.js"
	export default {
		data() {
			return {
				loading: true
			}
		},
		onLoad() {
			this.onloadUserinfo()
		},
		mounted() {
			console.log("success",formatDate("2024-12-23 18:12:32"));
		},
		methods: {
			onloadUserinfo() {
				let self = this;
				self.loading = true;
				let data = {
					id: "12345678",
					user_id: "2184075593",
					user_name: "小咸鱼",
					user_sex: 1
				}
				uni.setStorageSync('user_info', data);
				uni.getStorage({
					key: 'user_info',
					success: function(res) {
						console.log("success", res.data);
					},
					fail: function(res) {
						console.log("fail", res);
					},
					complete: function(res) {
						console.log("complete", res);
						// uni.navigateTo({
						// 	url:"/pages/login/index"
						// })
						self.loading = false;
					}
				})
			}
		},
		beforeDestroy() {
			this.loading = false;
		}
	}
</script>

<style lang="less">
	.content {
		.image-box {
			width: 61.8%;
			aspect-ratio: 1/1;
			border-radius: .875rem;
			overflow: hidden;
		}
	}
</style>