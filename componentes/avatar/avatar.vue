<template>
  <view class="avatar_container flex-row">
    <view class="avatar_innerBox flex-row" :style="{ width: cSize }">
      <view
        :class="{
          'avatar_content flex-row flex-center': true,
          avatar_square: shape === 'square',
          avatar_circle: shape === 'circle',
        }"
      >
        <image
          mode="aspectFill"
          :src="src"
          :lazy-load="true"
          style="width: 100%; height: 100%"
        ></image>
        <text v-if="showText" class="avatar_text">{{ text }}</text>
      </view>
      <view class="avatar_badge">
        <slot name="avatarBadge"></slot>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    size: { type: [String, Number], default: "20px" },
    src: { type: String, default: "https://via.placeholder.com/150" }, 
    shape: { type: String, default: "circle" }, // circle, square
    text: { type: String, default: "John" },
  },
  computed: {
    showText() {
      let url = this.src;
      return url === "false" && this.text ? true : false;
    },
  },
  data() {
    return {
      avatar: {
        defaultSize: "20px",
        defaultSrc: "https://via.placeholder.com/150",
        defaultShape: "circle",
      },
      cSize: "20px",
    };
  },
  watch: {
    size(val) {
      this.cSize = this.setSize(val);
    },
  },
  mounted() {
    this.cSize = this.setSize(this.size);
  },
  methods: {
    setSize(val) {
      let tempSize = "";
      if (typeof val == "string") {
        if (
          val.includes("px") ||
          val.includes("rem") ||
          val.includes("em") ||
          val.includes("%") ||
          val.includes("vw") ||
          val.includes("vh")
        ) {
          tempSize = val;
        } else if (/^\d+$/.test(val)) {
          tempSize = val + "px";
        } else {
          tempSize = this.avatar.defaultSize;
        }
      } else if (typeof val == "number") {
        tempSize = val + "px";
      } else {
        tempSize = this.avatar.defaultSize;
      }
      return tempSize;
    },
  },
};
</script>

<style lang="less" scoped>
.avatar_container {
  width: auto;
  height: auto;
  .avatar_innerBox {
    width: auto;
    aspect-ratio: 1;
    position: relative;
    .avatar_content {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .avatar_square {
      border-radius: 8px;
    }
    .avatar_circle {
      border-radius: 50%;
    }
    .avatar_badge {
      position: absolute;
      right: 0%;
      bottom: 0%;
      width: 28%;
      min-width: 28px;
      max-width: 36px;
      aspect-ratio: 1;
      border: 2px solid #fff;
      background: #fff;
      box-sizing: border-box;
	  overflow: hidden;
    }
    .avatar_content.avatar_square ~ .avatar_badge {
      border-radius: 8px;
    }
    .avatar_content.avatar_circle + .avatar_badge {
      border-radius: 50%;
    }
  }
}
</style>