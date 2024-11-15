<template>
	<view class="page-bg login-page f-row flex-center">
		<view class="login-image">
			<image class="logo" src="/static/poster.png" style="width:100%;height:100%"></image>
		</view>
		<view class="login-box f-col">
			<view class="form-box f-col gap-4">
				<uni-easyinput prefixIcon="person" v-model="user.account" placeholder="请输入账号">
				</uni-easyinput>
				<uni-easyinput prefixIcon="eye" v-model="user.password" placeholder="请输入密码">
				</uni-easyinput>
				<button class="login-btn w-100" size="default" type="primary" :loading="loading"
					@click="toLogin(user)">登录</button>
			</view>
		</view>
		<view class="banquan-box d-block color-9">
			版权所有 ©️ HbuildX 备案号xxxxxx
		</view>
	</view>
</template>

<script>
	import {
		login,
		showToast
	} from "../../custom_function/index.js"
	export default {
		data() {
			return {
				user: {
					account: "",
					password: ""
				},
				loading: false
			}
		},
		methods: {
			async toLogin(user) {
				this.loading = true;
				let flag = await login(user);
				if (flag) {
					uni.navigateTo({
						url: "/pages/home/index"
					})
				}
				this.loading = false;
			}
		}
	}
</script>

<style lang="less">
	.login-page {
		background-image: url("../../static/login_background.gif");
		background-size: 100% 100%;
		position: relative;

		.login-image {
			position: absolute;
			width: 61.8%;
			aspect-ratio: 1/1;
			border-radius: .875rem;
			overflow: hidden;
			top: 0;
			left: 50%;
			transform: translate(-50%,0px) scale(.618);
		}

		.login-box {
			width: 61.8%;
			padding: 1.25rem 1rem;
			box-shadow: 0 2px 10px rgba(0, 0, 0, 25%);
			border-radius: .375rem;
			overflow: hidden;
			backdrop-filter: blur(4px);

			.form-box {
				.login-btn {
					font-size: .875rem;
				}
			}
		}

		.banquan-box {
			width: 100%;
			padding: .25rem .875rem;
			font-size: .75rem;
			position: absolute;
			left: 0;
			bottom: 0;
			text-align: center;
			backdrop-filter: blur(2px);
		}
	}
</style>