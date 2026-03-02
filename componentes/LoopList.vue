<template>
	<view :id="getId" class="loop-list-view w-100 h-100">
		<scroll-view :scroll-top="scrollTop" scroll-y="true" class="loop-list-scroll scroll-Y"
			:style="{'height':scrollContentHeight}" @scrolltoupper="upper" @scrolltolower="lower" @scroll="scroll">
			<view id="loopListContent" class="loop-list-content gap-2 flex-col w-100">
				<view v-for="(item,index) in cList" :key="item.id || index" @click="itemClick(item)"
					class="loop-list-item">
					<!-- 
						@prop item - 数组条目数据
					  -->
					<slot name="default" :item="item">
						<text>{{item}}</text>
					</slot>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import _ from 'lodash';
	export default {
		props: {
			list: {
				type: [Array, Object]
			},
			dataUrl:{
				type:String
			}
		},
		watch: {
			list: {
				handler: function(val, oldVal) {
					this.cList = _.cloneDeep(val);
				},
				deep: true,
				immediate: true
			},
			cList: {
				handler: function(val, oldVal) {
					this.calcHeight();
				},
				deep: true,
				immediate: true
			}
		},
		data() {
			return {
				cList: [],
				scrollTop: 0,
				scrollContentHeight: "auto",
				old: {
					scrollTop: 0
				}
			}
		},
		computed: {
			getId() {
				let id = Date.now();
				return id;
			}
		},
		created() {
			this.calcHeight();
		},
		methods: {
			calcHeight() {
				let scrollHeight = "auto";
				let sh = 0;
				let h = 0;
				let scrollDom = null;
				let timer = setTimeout(e => {
					scrollDom = document.getElementById(`${this.getId}`);
					if (scrollDom) {
						sh = scrollDom.clientHeight;
						scrollHeight = sh + 'px';
						h = document.getElementById('loopListContent').clientHeight;
						let flag = h < sh * 2;
						if (flag) {
							this.loadDateScroll(flag);
						}
					}
					this.scrollContentHeight = scrollHeight;
					clearTimeout(timer);
				}, 100);
			},
			upper(e) {
				console.log("组件列表滚动到顶部", e);
			},
			lower(e) {
				console.log("组件列表滚动到底部", e, this.cList);
				this.$emit("scrollLower")
			},
			scroll(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			loadDateScroll(e) {
				this.$emit("loadDateScroll", e);
			},
			itemClick(e) {
				this.$emit("ItemClick", e);
			}
		}
	}
</script>

<style lang="less" scoped>
	.loop-list-view {
		overflow: hidden;
	}
</style>