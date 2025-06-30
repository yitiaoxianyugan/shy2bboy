<template>
	<uni-popup ref="popup" type="bottom">
		<view class="comment-view-popup" :style="{'height':popupHeight}">
			<view class="comment-content w-100 h-100 flex-col">
				<view class="comment-header w-100 flex-row gap-4 flex-0-0">
					<view class="title-view w-100 flex-col gap-1 flex-1-1">
						<slot name="titleAd"></slot>
						<text>共 {{ totalComment }} 条评论</text>
					</view>
					<view class="close-icon flex-0-0" @click="close">X</view>
				</view>
				<view id="contentheightId" ref="contentHeight" class="content-view flex-col flex-1-1">
					<scroll-view :scroll-top="scrollTop" scroll-y="true" class="content-scroll scroll-Y"
						:style="{'height':scrollContentHeight}" @scrolltoupper="upper" @scrolltolower="lower"
						@scroll="scroll">
						<view v-for="(item,index) in cList" :key="item.id" class="content-scroll-item w-100 flex-col">
							<comment :item="item"></comment>
						</view>
					</scroll-view>
				</view>
				<view class="comment-footer w-100 flex-0-0">
					<input class="comment-input" v-model="seedMessageValue" placeholder="爱评论的人运气都不会差"
						@confirm="seedConfirm" />
				</view>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	import comment from "./comment.vue";
	export default {
		components: {
			comment
		},
		props: {
			totalComment: {
				type: [String, Number],
				default: 0
			},
			listComment: {
				type: Array
			},
			popupHeight:{
				type:String,
				default:"68vh",
				require:true
			}
		},
		data() {
			return {
				cList: [],
				scrollContentHeight: "0px",
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				seedMessageValue: ""
			}
		},
		watch: {
			listComment: {
				handler: function(val, oldVal) {
					this.cList = val;
				},
				deep: true
			}
		},
		mounted() {
			this.cList = this.listComment;
		},
		methods: {
			open() {
				this.$refs.popup.open('bottom');
				let timer = setTimeout(e=>{
					this.calcScrollHeight();
					clearTimeout(timer);
				},100)
				
			},
			close() {
				this.$refs.popup.close()
			},
			// 计算评论区 滚动区域 固定高度
			calcScrollHeight() {
				let contentHeight = document.getElementById("contentheightId");
				console.log("calcScrollHeight", contentHeight);
				this.scrollContentHeight = contentHeight.clientHeight + 'px';
			},
			// 评论区滚动到顶部
			upper(e) {
				console.log("评论区滚动到顶部", e);
			},
			// 评论区滚动到底部
			lower(e) {
				console.log("评论区滚动到底部", e, this.cList);
			},
			// 评论区滚动中...
			scroll(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			// 发送评论
			seedConfirm(e) {
				console.log("发送评论", e);
				console.log("发送评论-value", e.detail.value);
			},
			// deepseek 插入表情到输入框
			insertEmoji(emoji) {
				this.seedMessageValue += `[emoji:${emoji}]`;
			}
		}
	}
</script>

<style lang="less" scoped>
	.comment-view-popup {
		width: 100%;
		height: 100%;
		background-color: #fff;
		border-radius: .75rem .75rem 0 0;
		position: relative;

		.comment-content {
			.comment-header {
				padding: .5rem .625rem;
				justify-content: space-between;
				align-items: flex-start;
				border-bottom: .0625rem solid #c3c3c3;

				.title-view {}
			}

			.content-view {
				overflow: hidden;

				.content-scroll {
					.content-scroll-item {
						padding: .5rem 0.625rem;
					}
				}
			}

			.comment-footer {
				border-top: .0625rem solid #c3c3c3;

				.comment-input {
					padding: .5rem .625rem;
					background: #c3c3c3;
				}
			}
		}
	}
</style>