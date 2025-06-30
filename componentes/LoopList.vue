<template>
	<view :id="getId" class="loop-list-view w-100 h-100">
		<scroll-view :scroll-top="scrollTop" scroll-y="true" class="loop-list-scroll scroll-Y"
			:style="{'height':scrollContentHeight}" @scrolltoupper="upper" @scrolltolower="lower" @scroll="scroll">
			<view class="loop-list-content gap-2 flex-col w-100 h-100">
				<view v-for="(item,index) in cList" :key="item.id || index" @click="itemClick(item)" class="loop-list-item">
					<!-- 
						@prop item - 数组条目数据
					  -->
					<slot name="default" :item="item"></slot>
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
			}
		},
		watch: {
			list: {
				handler: function(val, oldVal) {
					this.cList = _.cloneDeep(val);
				},
				deep: true
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
				return "LoopListId" + id;
			}
		},
		mounted() {
			this.cList = _.cloneDeep(this.list);
			let timer = setTimeout(e => {
				let contentHeight = "auto";
				let contentDom = null;
				contentDom = document.getElementById(`${this.getId}`);
				if (contentDom) {
					contentHeight = contentDom.clientHeight + 'px';
				}
				this.scrollContentHeight = contentHeight;
			}, 100);
		},
		methods: {
			upper(e) {
				console.log("组件列表滚动到顶部", e);
			},
			lower(e) {
				console.log("组件列表滚动到底部", e, this.cList);
			},
			scroll(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			itemClick(e){
				this.$emit("ItemClick",e);
			}
		}
	}
</script>

<style lang="less" scoped>

</style>