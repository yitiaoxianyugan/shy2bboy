<template>
  <view class="custom_calendar">
    <view class="calendar_container flex-col">
      <view class="calendar_header"> </view>
      <view class="calendar_date_content">
        <view class="calendar_date_month_backgroundNumber"> </view>
        <view class="calendar_date_weeks weeks_text">
          <view class="calendar_date_week_item"><text>日</text></view>
          <view class="calendar_date_week_item"><text>一</text></view>
          <view class="calendar_date_week_item"><text>二</text></view>
          <view class="calendar_date_week_item"><text>三</text></view>
          <view class="calendar_date_week_item"><text>四</text></view>
          <view class="calendar_date_week_item"><text>五</text></view>
          <view class="calendar_date_week_item"><text>六</text></view>
        </view>
        <view
          class="calendar_date_weeks"
          v-for="(item, weekIndex) in weeks"
          :key="weekIndex"
        >
          <view
            class="calendar_date_day_item"
            v-for="(weeks, weeksIndex) in item"
            :key="weeksIndex"
          >
            <text>{{ weeks.date }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const MonthNameEn = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MonthNameZh = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
const WeekNameEn = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WeekNameZh = ["一", "二", "三", "四", "五", "六", "日"];
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const date = today.getDate();
const day = today.getDay();
export default {
  data() {
    return {};
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      console.log(year, month, date, day);
      let currentDay = {
        year,
        month,
        date,
        day,
      };
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const lastDate = lastDay.getDate();
      const lastDayWeek = lastDay.getDay();
      const lastWeek = Math.ceil((lastDate + day) / 7);
      console.log(lastDate, lastDayWeek, lastWeek);
    },
  },
};
</script>

<style scoped lang="less">
.calendar_date_content {
  display: flex;
  flex-direction: column;
  .calendar_date_weeks {
    display: flex;
    flex-direction: row;
    .calendar_date_week_item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .calendar_date_day_item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .weeks_text{
	border-top:1px;
	border-bottom:1px;
	border-color:#333;
  }
}
</style>
