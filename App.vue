<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	@import '@/static/css/public.css';
	
	page {
		width:100vw;
		// #ifdef APP
		height:100vh;
		// #endif
		// #ifndef APP
		height:calc(100vh - 44px);
		// #endif
		overflow: hidden;
	}
	.page-bg{
		width:100%;
		height: 100%;
	}
</style>
