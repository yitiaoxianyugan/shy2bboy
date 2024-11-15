<template>
	<view class="page-bg login-page">
		<view class="login-box flex-col">
			<uni-easyinput prefixIcon="user" v-model="value" placeholder="左侧图标" @iconClick="iconClick">
						</uni-easyinput>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value:""
			}
		},
		methods: {
			iconClick(){
				
			}
		}
	}
</script>

<style lang="less">

</style>
