<template>
	<view class="tabbar_container">
		<view v-for="(item,index) in tabbarList" :key="index">
			<text>{{item.text}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabbarList:[{
					icon:"",
					text:"首页"
				},
				{
					icon:"",
					text:"我的"
				}]
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
