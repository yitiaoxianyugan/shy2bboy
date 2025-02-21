<template>
  <view class="page">
    <view class="page-bg home_page">
      <headerInfo></headerInfo>
      <uni-calendar class="uni-calendar--hook" :selected="info.selected" :showMonth="true" @change="change" @monthSwitch="monthSwitch" />
      <customCalendar></customCalendar>
    </view>
  </view>
</template>

<script>
import headerInfo from "../../componentes/headerInfo_card.vue";
import customCalendar from "../../componentes/custom_calendar/index.vue";
export default {
  components: {
    headerInfo,
    customCalendar
  },
  data() {
    return {
      info: {
					lunar: true,
					range: true,
					insert: false,
					selected: []
				}
    };
  },
  mounted() {},
  methods: {
    change(){

    },
    monthSwitch(){

    }
  },
};
</script>

<style lang="less" scoped>
.home_page {
  padding: 0 20rpx;
}
</style>
