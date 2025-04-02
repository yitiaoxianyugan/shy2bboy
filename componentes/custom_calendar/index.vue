<template>
	<view class="custom_calendar">
		<view class="calendar_container flex-col">
			<view class="calendar_header"> </view>
			<view class="calendar_date_content flex-col">
				<view class="calendar_date_month_backgroundNumber flex-row flex-center">{{
					selectItem.month < 10 ? '0'+selectItem.month : selectItem.month
				}}</view>
				<view class="calendar_date_weeks weeks_border">
					<view class="calendar_date_week_item"><text>日</text></view>
					<view class="calendar_date_week_item"><text>一</text></view>
					<view class="calendar_date_week_item"><text>二</text></view>
					<view class="calendar_date_week_item"><text>三</text></view>
					<view class="calendar_date_week_item"><text>四</text></view>
					<view class="calendar_date_week_item"><text>五</text></view>
					<view class="calendar_date_week_item"><text>六</text></view>
				</view>
				<view class="calendar_date_weeks" v-for="(item, weekIndex) in weeks" :key="weekIndex">
					<view v-for="(weekItem, weeksIndex) in item" :key="weeksIndex" :class="{
						'flex-col calendar_date_day_item':true,
						'calendar_date_today_item':weekItem.isDay,
						'calendar_date_active_day_item':isEqual(selectItem,weekItem)
					}" @click="onSelectDate(weekItem)">
						<text class="date_text">{{ weekItem.date }}</text>
						<text class="lunar_date">
							{{ setLunarDate(weekItem) }}
						</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import CALENDAR from './calendar.js'
	const MonthNameEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const MonthNameZh = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
	const WeekNameEn = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	const WeekNameZh = ["一", "二", "三", "四", "五", "六", "日"];
	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth();
	const date = today.getDate();
	const day = today.getDay();
	const currentItem = {
		year,
		month,
		date,
		day
	};
	export default {
		data() {
			return {
				selectItem: {},
				weeks: [
					[1, 2, 3, 4, 5, 6, 7]
				]
			};
		},
		created() {
			this.init();
		},
		watch:{
			selectItem:{
				handler:function(newVal,oldVal){
					if(oldVal){
						this.selectChangeDate(newVal);
					}
				}
			}
		},
		methods: {
			init() {
				const {
					weeks
				} = this.getStartAndEnd(year, month);
				this.weeks = weeks;
				console.log("init", weeks, currentItem);
			},
			getStartAndEnd(tempYear, tempMonth) {
				// 获取当前月的第一天
				let firstDay = new Date(tempYear, tempMonth, 1);
				// 获取当前月的最后一天
				let lastDay = new Date(tempYear, tempMonth + 1, 0);
				let start = {
					year: firstDay.getFullYear(),
					month: firstDay.getMonth(),
					date: firstDay.getDate(),
					day: firstDay.getDay(),
				};
				let end = {
					year: lastDay.getFullYear(),
					month: lastDay.getMonth(),
					date: lastDay.getDate(),
					day: lastDay.getDay(),
				};
				let weekNumber = Math.ceil(lastDay.getDate() / 7);
				let weeks = [];
				let count = end.date;
				let startValue = 1;
				for (var x = 0; x < weekNumber; x++) {
					let tempArr = [];
					for (var y = 0; y < 7; y++) {
						let tempItem = {
							year: start.year,
							month: start.month,
							date: "",
							day: y,
						}
						if (x == 0 && y < start.day && start.day != 0) {
							tempItem.date = "";
						} else if (x == weekNumber - 1 && startValue > end.date) {
							tempItem.date = "";
						} else {
							tempItem.date = startValue;
							tempItem.lunar = CALENDAR.solar2lunar(start.year, start.month + 1, startValue);
							tempItem.isDay = this.isEqual(currentItem, tempItem);
							startValue += 1;
							if(tempItem.isDay){
								this.selectItem = tempItem;
							}
						}
						tempArr.push(tempItem);
					}
					weeks.push(tempArr);
				}
				return {
					start,
					end,
					weeks
				}
			},
			// 解决比较对象问题 (小,大);
			isEqual(obj1, obj2) {
				for (let key in obj1) {
					if (obj1[key] !== obj2[key]) {
						return false;
					}
				}
				return true;
			},
			setLunarDate(e){
				let str = "";
				if(!e.date) return;
				if(e.isDay){
					str = '今日';
				}else if(!e.isDay && e.lunar){
					if(e.lunar.IDayCn === '初一'){
						str = e.lunar.IMonthCn;
					}else{
						str = e.lunar.IDayCn;
					}
				}else{
					console.error("未识别到阴历",e);
				}
				return str;
			},
			onSelectDate(e) {
				if(!e.date) return;
				this.selectItem = e;
			},
			selectChangeDate(e){
				this.$emit("selectChangeDate", e);
			}
		},
	};
</script>

<style scoped lang="less">
	.calendar_date_content {
		position: relative;

		.calendar_date_month_backgroundNumber {
			position: absolute;
			font-size: 200px;
			width: 100%;
			height: 100%;
			overflow: hidden;
			color: #f5f5f5;
			opacity: 1;
			z-index: -1;
		}

		.calendar_date_weeks {
			display: flex;
			flex-direction: row;

			.calendar_date_week_item,
			.calendar_date_day_item {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				aspect-ratio: 1 / 1;
				height: auto;
			}

			.calendar_date_day_item {
				.lunar_date {
					font-size: 12px;
					color: #999;
				}
			}

			.calendar_date_today_item {
				.date_text {
					color: #1890ff;
				}

				.lunar_date {
					color: #1890ff;
				}
			}

			.calendar_date_active_day_item {
				background-color: #2979ff;

				.date_text {
					color: #fff;
				}

				.lunar_date {
					color: #fff;
				}
			}
		}

		.weeks_border {
			border-top: 1px solid;
			border-bottom: 1px solid;
			border-color: #F5F5F5;
		}
	}
</style>