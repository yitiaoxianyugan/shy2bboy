<template>
	<view>
		<view
          class="markdown-views"
          id="MarkdownViews"
          v-html="article.content"
        ></view>
	</view>
</template>

<script>
import articleInfo from "../../static/article/articleList/1.json";
	export default {
		data() {
			return {
				article:null
			}
		},
		create(){
			this.init();
		},
		mounted() {
			
		},
		methods: {
			init() {
				let temp = articleInfo.header;
				let tempData = temp.itemData;
				let sections = temp.itemData.sections || [];
				let article = "";
				let data_html = "";
				sections.forEach((e)=>{
					article += e.content;
					data_html += e.data_html;
				});
				let data = {
					type:temp.itemType,
					header:tempData.header,
					author_name:tempData.infoBaiJiaHao.name,
					contentStr:article,
					content:data_html
				};
				this.article = data;
			}
		}
	}
</script>

<style lang="less" scoped>
.markdown-views{
	p{
		font-size: 1rem;
		margin: 1rem 0.5rem;
	}
	p:last-child(){
		margin-bottom:1.25rem;
	}
}
</style>
