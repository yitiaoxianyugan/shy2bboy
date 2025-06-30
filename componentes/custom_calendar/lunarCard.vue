<template>
	<view class="flex-col gap-4">
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
		</view>
		<view class="constellation_content">
			<view v-if="loading" class="loading_state flex-row flex-center">
				<uni-icons type="spinner-cycle" size="60" color="#1890ff"></uni-icons>
			</view>
			<text v-else class="constellation_info flex-col">
				<text class="constellation_title">{{constellation.title}}</text>
				<view class="flex-row yunshi_view">
					<view class="flex-row flex-1-1 items-center yunshi_view_left">
						<view class="all flex-row flex-center">{{constellation.fortune.all}}</view>
						<view class="flex-col gap-1">
							<uni-rate size="18" :value="constellation.fortune.all" />
							<text class="type_text">综合运势</text>
						</view>
					</view>
					<view class="flex-col flex-0-0 yunshi_view_right type_text">
						<view class="flex-row flex-nowrap items-center gap-1">
							<text>健康:</text>
							<uni-rate size="18" :value="constellation.fortune.health" />
						</view>
						<view class="flex-row flex-nowrap items-center gap-1">
							<text>爱情:</text>
							<uni-rate size="18" :value="constellation.fortune.love" />
						</view>
						<view class="flex-row flex-nowrap items-center gap-1">
							<text>事业:</text>
							<uni-rate size="18" :value="constellation.fortune.work" />
						</view>
						<view class="flex-row flex-nowrap items-center gap-1">
							<text>财富:</text>
							<uni-rate size="18" :value="constellation.fortune.money" />
						</view>
					</view>
				</view>
				<view>
					<text>{{constellation}}</text>
				</view>
			</text>
		</view>
	</view>
</template>

<script>
	import axios from 'axios';
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
				newCardInfo: {},
				loading: true,
				constellation: {}
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
		async mounted() {
			this.newCardInfo = this.cardInfo;
			await this.getConstellation(this.newCardInfo.astro);
		},
		methods: {
			async getConstellation(xz, type) {
				this.loading = true;
				this.constellation = {};
				try {
					const {
						data
					} = await axios.get("https://v2.xxapi.cn/api/horoscope?time=today&type=aries");
					let res = data.data;
					this.constellation = res;
					console.log("data:", data, res);


				} catch (err) {
					console.error("error", err)
				}
				this.loading = false;
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

	.constellation_content {
		min-height: 150px;
		padding: 12px 14px;
		box-sizing: border-box;
		background-color: #fff;

		.loading_state {
			width: 100%;
			height: 100%;
		}

		.constellation_info {
			width: 100%;

			.constellation_title {
				font-size: 1rem;
				font-weight: bold;
				line-height: 1.5;
			}

			.yunshi_view {
				.yunshi_view_left {
					.all {
						height: 100%;
						font-size: 30px;
						aspect-ratio: 2/3;
					}
					.type_text {
						font-size: .875rem;
					}
				}

				.yunshi_view_right {}
			}
		}
	}
</style>