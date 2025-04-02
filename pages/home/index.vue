<template>
	<view class="page">
		<view class="page-bg home_page">
			<headerInfo></headerInfo>
			<!-- <uni-calendar class="uni-calendar--hook" :lunar="true" :selected="info.selected" :showMonth="true" @change="change" @monthSwitch="monthSwitch" /> -->
			<customCalendar @selectChangeDate="selectChangeDate"></customCalendar>
			<view class="bottom_calendar_info flex-col">
				<view class="calendar_info_title flex-row" v-if="selectDateInfo">
					<text>{{selectDateInfo.dateStr}}</text>
					<text>{{selectDateInfo.lunarStr}}</text>
				</view>
				<custom-calendar-card class="calendar_info_lunarInfo" :card-info="selectDateInfo.lunar">
				</custom-calendar-card>
			</view>
		</view>
	</view>
</template>

<script>
	import headerInfo from "../../componentes/headerInfo_card.vue";
	import customCalendar from "../../componentes/custom_calendar/index.vue";
	import customCalendarCard from "../../componentes/custom_calendar/lunarCard.vue";
	export default {
		components: {
			headerInfo,
			customCalendar,
			customCalendarCard
		},
		data() {
			return {
				info: {
					lunar: true,
					range: true,
					insert: false,
					selected: [],
				},
				selectDateInfo: {}
			};
		},
		mounted() {},
		methods: {
			change() {

			},
			monthSwitch() {

			},
			selectChangeDate(e) {
				const {
					year,
					month,
					date,
					day,
					lunar
				} = e;
				console.log("selectDate", year, month, date, day, lunar);
				let dateStr = year + '年' + (month + 1) + '月' + date + '日';
				let lunarStr = '农历' + lunar.IMonthCn + lunar.IDayCn;
				this.selectDateInfo = {
					dateStr,
					lunarStr,
					lunar,
					lunarInfo: {
						Animal: "蛇",
						IDayCn: "初三",
						IMonthCn: "二月",
						Term: null,
						astro: "双鱼座",
						cDay: 2,
						cMonth: 3,
						cYear: 2025,
						gzDay: "庚午",
						gzMonth: "戊寅",
						gzYear: "乙巳",
						isLeap: false,
						isTerm: false,
						isToday: false,
						lDay: 3,
						lMonth: 2,
						lYear: 2025,
						nWeek: 7,
						ncWeek: "星期日",
					}
				}
			}
		},
	};
</script>

<style lang="less" scoped>
	.home_page {
		display: flex;
		flex-direction: column;

		.bottom_calendar_info {
			flex: 1 1 auto;
			padding: 20rpx;
			background-color: #f5f5f5;
			gap:.5rem;
			.calendar_info_title {
				width: 100%;
				font-size: 18px;
				justify-content: space-between;
			}

			.calendar_info_lunarInfo {
				width: 100%;
			}
		}
	}
</style>