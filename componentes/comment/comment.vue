<template>
	<view class="comment-view gap-2 flex-row">
		<view class="user_avatar flex-0-0">
			<img class="avatar-image" src="/static/avatar.jpg" />
		</view>
		<view class="user_comment flex-col gap-1 flex-1-1">
			<view class="main_content flex-row justify-between">
				<view class="content flex-col gap-1">
					<view class="user_name_view flex-row gap-2 items-center flex-nowrap">
						<text class="user_name">{{item.user_name}} </text>
						<text v-if="userType == 'autor'" class="user_autor h-100 flex-row flex-center">作者</text>
						<text v-else-if="userType == 'mine'" class="user_mine">我</text>
					</view>
					<!-- 需要支持图片、表情 -->
					<view class="user_comment_view flex-row flex-wrap">
						<text>{{item.comment}}</text>
						<view class="other-info flex-row flex-wrap gap-1">
							<text>3天前</text>
							<text>{{item.ip_ads}}</text>
							<text class="apply" @click="onApply(item)">回复</text>
						</view>
					</view>
				</view>
				<view class="like-status flex-col items-center flex-0-0" @click="changeLikeStatus(item)">
					<view>
						<uni-icons v-if="item.likeStatus" type="heart-filled" size="24" color="#ff6e00"></uni-icons>
						<uni-icons v-else type="heart" size="24" color="#999"></uni-icons>
					</view>
					<view>{{item.likeNum}}</view>
				</view>
			</view>
			<view class="user_apply_comment flex-col" v-if="item.totalSubItem && item.totalSubItem>=1">
				<view v-if="showSubStatus === false" class="down_date" @click="downSubComment">
					<text class="">-- 展开 {{item.totalSubItem}} 条评论</text>
				</view>
				<view v-else class="sub-comment-view w-100 flex-col gap-2">
					<subItem v-for="(subItem,subIndex) in subCommentList" :key="subItem.id" :item="subItem"></subItem>
					<view v-if="showSubStatus === true" class="up_date flex-row flex-1-1">
						<text v-if="item.totalSubItem !== subCommentList.length" @click="downMoreContent">-- 展开更多评论</text>
						<text @click="upSubComment">-- 收起</text>
					</view>
					<view v-if="['loading','loadError'].includes(showSubStatus)" class="loading-status text-center">
						<slot v-if="showSubStatus == 'loading'" name="loading">
							<text>加载中 ...</text>
						</slot>
						<text v-if="showSubStatus == 'loadError'" class="error-text">加载失败</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import subItem from "./subComment.vue";
	import commentJs from "../../mixin/comment.js"
	export default {
		mixins:[commentJs],
		components: {
			subItem
		},
		data() {
			return {
				showSubStatus: false,
				subCommentList: []
			}
		},
		methods: {
			onApply() {},
			async downSubComment() {
				// 获取第一页数据
				this.showSubStatus = "loading";
				let list = [];
				let n = 0;
				while (n < 3) {
					list = this.item.child;
					
					if (list && list.length > 0) {
						break;
					}
					await deplay(500);
					n++;
					function deplay(ms){
						return new Promise(resolve => setTimeout(resolve,ms))
					}
				}
				if(list && list.length > 0){
					this.subCommentList = list;
					this.showSubStatus = true;
				}else{
					this.showSubStatus = 'loadError';
					setTimeout(e=>{
						this.showSubStatus = false;
					},3000);
				}
			},
			downMoreContent() {},
			upSubComment() {
				// 收起当前item所有数据
				this.showSubStatus = false;
			}
		}
	}
</script>

<style lang="less">
	.comment-view {
		.user_avatar {
			width: 2rem;

			.avatar-image {
				width: 100%;
				aspect-ratio: 1 / 1;
				border-radius: 50%;
			}
		}

		.user_comment {
			.main_content {
				.content {
					.user_name_view {
						font-size: .875rem;

						.user_name {
							font-size: 1rem;
							color: #999;
						}

						.user_autor {
							color: #ff6e00;
							background-color: #ececec;
							border-radius: 50px;
							line-height: 1;
							padding: 0rem .5rem;
						}

						.user_mine {
							color: #999;
						}
					}

					.user_comment_view {
						column-gap: .5rem;
						row-gap: .25rem;

						.other-info {
							color: #999;
							font-size: .75rem;
							align-items: flex-end;

							.apply {
								color: #1890ff;
							}
						}
					}
				}

				.like-status {
					width: 2.5rem;
					font-size: .875rem;
					color: #999;
				}
			}

			.user_apply_comment {
				.sub-comment-view {
					.up_date {
						color: #1890ff;
>uni-text{
	width: 50%;
}
					}

					.loading-status {
						font-size: .625rem;
						color: #999;
						line-height: 1.5;

						.error-text {
							color: #ff6e00;
						}
					}
				}
			}
		}
	}
</style>