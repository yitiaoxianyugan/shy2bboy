<template>
	<view class="pagesList-view w-100 h-100 flex-col">
		<view class="search-page flex-row items-center gap-2 flex-0-0">
			<uni-easyinput class="search-easyinput" prefixIcon="search" v-model="searchValue" clearable
				@iconClick="searchContent" @confirm="searchContent">
			</uni-easyinput>
			<button @click="searchContent(searchValue)">搜索</button>
		</view>
		<view class="pagesList-content flex-1-1">
			<LoopList :list="pagesList" @ItemClick="ItemClick">
				<template #default="{ item }">
					<view class="pagesList-content-item border flex-col gap-1">
						<text>{{item.name}}</text>
						<text>{{item.path}}</text>
					</view>
				</template>
			</LoopList>
		</view>
	</view>
</template>

<script>
	import LoopList from "../../componentes/LoopList.vue";
	import PagesList from "../../pages.json";
	export default {
		components: {
			LoopList
		},
		data() {
			return {
				searchValue: "",
				pagesList: []
			}
		},
		created() {
			let result = PagesList.pages;
			let tabBarList = PagesList.tabBar.list;
			if (result && result.length > 0) {
				let tabBarPaths = [];
				if (tabBarList && tabBarList.length > 0) {
					tabBarPaths = tabBarList.map(item => item.pagePath);
				}
				result.forEach(e => {
					e.name = e?.style?.navigationBarTitleText || "无标题";
					e.tabbar = tabBarPaths.includes(e.path);
				});
				this.pagesList = result;
			} else {
				this.pagesList = [];
			}
		},
		methods: {
			searchContent(e) {
				this.$emit("searchContent", e);
				if (!e || e == 'prefix') return;
				console.log("searchContent", e);
			},
			ItemClick(e) {
				console.log("ItemClick", e);
				if (e.tabbar) {
					uni.switchTab({
						url: `/${e.path}`,
					})
				} else {
					uni.navigateTo({
						url: `/${e.path}`,
					});
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.pagesList-view {
		overflow: hidden;

		.search-page {
			padding: .25rem .5rem;

			.search-easyinput {
				/deep/ .uni-easyinput__content {
					height: 2.75rem;
				}

			}

			.search-button {}
		}

		.pagesList-content {
			padding: .875rem .5rem;

			.pagesList-content-item {
				width: 100%;
				padding: .5rem;
				border: 1px solid #c3c3c3;
				border-radius: 2px;
			}
		}
	}
</style>