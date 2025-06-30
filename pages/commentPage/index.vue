<template>
	<view>
		<button v-on:click="open">打开评论区</button>
		<commentIndex ref="comment" 
		:total-comment="42" 
		:list-comment="listComment"
		style="height: 500px;">
			<template #titleAd>123123</template>
		</commentIndex>
	</view>
</template>

<script>
	import commentIndex from "../../componentes/comment/index.vue"
 	import {
 		searchComment
 	} from "../../custom_function/index.js";
	export default {
		components:{
			commentIndex
		},
		data() {
			return {
				listComment:[]
			}
		},
		mounted(){
			this.listComment = searchComment();
		},
		methods: {
			open(){
				this.$refs.comment.open();
			}
		}
	}
</script>

<style>

</style>
