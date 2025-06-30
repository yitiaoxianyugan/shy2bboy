<template>
	<view class="web-socket-view w-100 h-100 flex-col">
		<!-- 头部 -->
		<view class="header-view flex-row gap-2 flex-0-0">
			<view class="left-icon">
				<uni-icons type="left" size="30"></uni-icons>
			</view>
			<view class="center-title flex-row flex-center flex-1-1">
				<text>{{title}}</text>
			</view>
			<view class="right-icon">
				<uni-icons type="more-filled" size="30"></uni-icons>
			</view>
		</view>
		<!-- 聊天区域 -->
		<view class="main-view flex-1-1">
			2
		</view>
		<!-- 底部输入区域 -->
		<view class="footer-view w-100 flex-col flex-0-0">
			<view class="seed-message flex-row gap-2">
				<textarea v-model="message"
					placeholder="输入消息..." 
					auto-height></textarea>
				<button type="primary">发送</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: "默认标题"
			}
		},
		data() {
			return {
				message: ""
			}
		},
		methods: {

		}
	}
</script>

<style lang="less" scoped>
	.web-socket-view {
		.header-view {
			background-color: antiquewhite;

			.left-icon,
			.right-icon {
				padding: .325rem;
				display: flex;
			}

			.center-title {
				font-size: 1.125rem;
				font-weight: bold;
				overflow: hidden;

				uni-text {
					width: 100%;
					text-align: center;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}

		.main-view {}

		.footer-view {
			background-color: antiquewhite;
			padding:.5rem .325rem;
			.seed-message{
				
				textarea{
					
					border:1px solid red;
				}
				button{
					
				}
			}
		}
	}
</style>