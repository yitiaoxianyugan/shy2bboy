<template>
  <div class="header_card flex-row">
    <div class="header_container w-100 flex-row flex-nowrap">
      <Avatar
        class="header_avatar_view flex-0-0"
        size="18vw"
        :src="userInfo.avatar"
        shape="circle"
        :showText="false"
        :text="userInfo.username"
      >
        <template v-slot:avatarBadge>
          <text class="avatarBadge w-100 h-100 flex-row flex-center">哪</text>
        </template>
      </Avatar>
      <view class="header_showText flex-col justify-center flex-1-1">
        <text class="show_name"
          >Hello <text style="font-weight: bold;">{{ userInfo.username }}</text
          >!</text
        >
        <text class="show_date">{{ userInfo.date }}</text>
      </view>
      <view class="header_remind flex-row flex-center flex-0-0">
        <view class="remind_content flex-row flex-center border-50">
          <Remind></Remind>
        </view>
      </view>
    </div>
  </div>
</template>

<script>
import Avatar from "./avatar/index.vue";
import Remind from "./remind/index.vue";
import { formatTimeText } from "../custom_function/index.js";
export default {
  components: {
    Avatar,
    Remind,
    formatTimeText
  },
  data() {
    return {
      userInfo: {
        avatar:"../static/avatar.jpg",
        username: "哪吒",
      },
    };
  },
  mounted() {
    const formattedDate = formatTimeText();
    this.userInfo.date = formattedDate.formattedDateEn;// formattedDateZh
  },
  methods: {

  },
};
</script>

<style scoped lang="less">
.header_card {
  width: 100%;
  padding: 1rem;
  .header_container {
    .header_avatar_view {
      .avatarBadge {
        background: green;
        color: #fff;
      }
    }
    .header_showText {
      margin: 0 0.25rem 0 0.5rem;
      font-size: 1.25rem;
      line-height: 1.5;
      .show_name {
        color: #666;
        span {
          font-weight: 500;
          color: #1890ff;
        }
      }
      .show_date {
        font-size: 1rem;
        color: #333;
      }
    }
    .header_remind {
      width: 12vw;
      .remind_content {
        display: inline-flex;
        width: 100%;
        aspect-ratio: 1;
        border: 1px solid #999;
        border-radius: 50%;
        cursor: pointer;
      }
    }
  }
}
</style>