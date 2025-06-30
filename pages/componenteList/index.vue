<template>
	<view class="componenteList-view w-100 h-100 flex-col">
		<view class="search-componente flex-row items-center gap-2 flex-0-0">
			<uni-easyinput class="search-easyinput" prefixIcon="search" v-model="searchValue" clearable
				@iconClick="searchContent" @confirm="searchContent">
			</uni-easyinput>
			<button @click="searchContent(searchValue)">搜索</button>
		</view>
		<view class="componenteList-content flex-1-1">
			<LoopList :list="compList" @ItemClick="ItemClick">
				<template #default="{ item }">
					<view class="componenteList-content-item border flex-col gap-1">
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
	import CompList from "../../pages.json";
	export default {
		components: {
			LoopList
		},
		data() {
			return {
				searchValue: "",
				compList: []
			}
		},
		created() {
			let result = CompList.pages;
			if (result && result.length > 0) {
				let tabBarList = CompList.tabBar.list;
				let tabBarPaths = [];
				if (tabBarList && tabBarList.length > 0) {
					tabBarPaths = tabBarList.map(item => item.pagePath);
				}
				result.forEach(e => {
					e.name = e?.style?.navigationBarTitleText || "无标题";
					e.tabbar = tabBarPaths.includes(e.path);
				});
				this.compList = result;
			} else {
				this.compList = [];
			}
		},
		methods: {
			searchContent(e) {
				this.$emit("searchContent", e);
				if (!e || e == 'prefix') return;
				console.log("searchContent", e);
			},
			ItemClick(e) {

				uni.navigateTo({
					url: `/${e.path}`,
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.componenteList-view {
		overflow: hidden;
		.search-componente {
			padding: .25rem .5rem;

			.search-easyinput {
				/deep/ .uni-easyinput__content {
					height: 2.75rem;
				}

			}

			.search-button {}
		}

		.componenteList-content {
			padding:.875rem .5rem;
			.componenteList-content-item{
				width: 100%;
				padding:.5rem;
				border:1px solid #c3c3c3;
				border-radius: 2px;
			}
		}
	}
</style>