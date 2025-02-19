<template>
  <div class="header_card flex-row">
    <div class="header_container w-100 flex-row gap-4">
      <Avatar
        class="header_avatar_view"
        size="18vw"
        :src="userInfo.avatar"
        shape="circle"
        :showText="false"
        :text="userInfo.username"
      >
        <template v-slot:avatarBadge>
          <text class="avatarBadge w-100 h-100 flex-row flex-center"
            >哪</text
          >
        </template>
      </Avatar>
      <view class="header_showText flex-col justify-center">
        <text class="show_name"
          >Hello <span>{{ userInfo.username }}</span
          >!</text
        >
        <text class="show_date">123123</text>
      </view>
    </div>
  </div>
</template>

<script>
import Avatar from "./avatar/avatar.vue";
export default {
  components: {
    Avatar,
  },
  data() {
    return {
      userInfo: {
        avatar:
          "https://b0.bdstatic.com/2d43e63ca240bdf793814be0dbc9c3a5.jpg@h_1280",
        username: "哪吒",
      },
    };
  },
};
</script>

<style scoped lang="less">
.header_card {
  width: 100%;
  padding: 1rem;
  .header_container {
    margin-right: 16px;
    .header_avatar_view {
      .avatarBadge {
        background: green;
        color: #fff;
      }
    }
    .header_showText {
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
        color: #333;
      }
    }
  }
}
</style>