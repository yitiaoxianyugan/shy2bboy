<template>
	<view class="page-bg content d-flex flex-center">
		<div class="image-box">
			<image class="logo" src="/static/poster.png" style="width:100%;height:100%"></image>
		</div>
	</view>
</template>

<script>
	import { searchUser } from "../../custom_function/index.js"
	export default {
		data() {
			return {
				loading: true
			}
		},
		onLoad() {
			this.onloadUserinfo()
		},
		methods: {
			onloadUserinfo() {
				let self = this;
				self.loading = true;
				uni.getStorage({
					key: 'user_info',
					complete: function(res) {
						console.log("complete", res.data.id);
						if(res.data && res.data.id){
							const data = searchUser(res.data.id);
							uni.setStorageSync('user_info',data)
							uni.navigateTo({
								url:"/pages/home/index"
							})
						}else{
							uni.navigateTo({
								url:"/pages/login/index"
							})
						}
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