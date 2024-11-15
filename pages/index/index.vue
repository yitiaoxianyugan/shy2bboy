<template>
	<view class="page-bg content f-col flex-center gap-8">
		<div class="image-box">
			<image class="logo" src="/static/poster.png" style="width:100%;height:100%"></image>
		</div>
		<div class="loading-text">
			{{loadText}}
		</div>
	</view>
</template>

<script>
	import {
		searchUser,
		loadState
	} from "../../custom_function/index.js"
	export default {
		data() {
			return {
				loading: true,
				loadText: "加载中",
				timer: null
			}
		},
		onLoad() {
			this.onloadUserinfo()
		},
		watch: {
			loading: {
				handler: function(newValue, value) {
					let timer;
					if (newValue) {
						timer = setInterval(e => {
							this.loadText = loadState(true)
						}, 500)
					} else {
						this.loadText = loadState(false)
						clearInterval(timer)
					}
				},
				deep: true,
				immediate: true
			}
		},
		methods: {
			onloadUserinfo() {
				let self = this;
				self.loading = true;
				uni.getStorage({
					key: 'user_info',
					complete: function(res) {
						if (res.data && res.data.id) {
							const data = searchUser("id", res.data.id);
							uni.setStorageSync('user_info', data)
							uni.navigateTo({
								url: "/pages/home/index"
							})
						} else {
							uni.navigateTo({
								url: "/pages/login/index"
							})
						}
						self.loading = false;
					}
				})
			}
		},
		beforeDestroy() {
			this.loading = false;
			clearInterval(this.timer);
		}
	}
</script>

<style lang="less">
	.content {
		position: relative;

		.image-box {
			width: 61.8%;
			aspect-ratio: 1/1;
			border-radius: .875rem;
			overflow: hidden;
		}

		.loading-text {
			color: #1890ff;
		}
	}
</style>