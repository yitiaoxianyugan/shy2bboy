<template>
	<view class="lunarInfo_card flex-col" v-if="newCardInfo">
		<text class="lunarInfo_title">
			{{newCardInfo.IMonthCn}}{{newCardInfo.IDayCn}}
		</text>
		<view class="lunarInfo_describe flex-row">
			<view class="lunarInfo_describe_left">
				<text>{{newCardInfo.Animal}}年</text>
				<text>{{newCardInfo.gzYear}}年</text>
				<text>{{newCardInfo.gzMonth}}月</text>
				<text>{{newCardInfo.gzDay}}日</text>
				<text>{{newCardInfo.ncWeek}}</text>
			</view>
			<view class="lunarInfo_describe_right flex-row flex-center">
				<text>{{newCardInfo.astro}}</text>
			</view>
		</view>
		<text></text>
	</view>
</template>

<script>
	import CALENDAR from './calendar.js'
	export default {
		props: {
			cardInfo: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},
		data() {
			return {
				newCardInfo: {}
			}
		},
		watch: {
			cardInfo: {
				handler: function(newVal, oldVal) {
					this.newCardInfo = newVal;
					this.getConstellation(newVal.astro);
				},
				deep: true
			}
		},
		mounted() {
			this.newCardInfo = this.cardInfo;
			this.getConstellation(this.newCardInfo.astro);
		},
		methods: {
			getConstellation(xz,type) {
				let apiKey = da05bd364e37449c165534b22917d50f;
				type = type || "today";
				uni.request({
					url: "http://web.juhe.cn/constellation/getAll",
					method:"GET",
					data: {
						'key':apiKey,
						'consName': xz,
						'type':type
					},
					header:{
						"Content-Type":"application/x-www-form-urlencoded"
					},
					success: (res) => {
						console.log(res.data);
					}
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.lunarInfo_card {
		width: 100%;
		padding: 20rpx;
		background-color: #fff;
		border-radius: .5rem;
		overflow: hidden;
		gap: .325rem;

		.lunarInfo_title {
			font-size: 1rem;
			font-weight: bold;
		}

		.lunarInfo_describe {
			font-size: .875rem;
			gap: 1rem;
			justify-content: space-between;

			.lunarInfo_describe_left {
				display: flex;
				gap: .25rem;
			}

			.lunarInfo_describe_right {
				min-width: 4.5rem;
			}
		}
	}
</style>