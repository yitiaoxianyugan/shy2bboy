<script>
export default {
  onLaunch: function () {
    console.log("App Launch");
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

<style lang="scss">
/*每个页面公共css */
@import "@/uni_modules/uni-scss/index.scss";

.page {
  width: 100vw;
  // #ifdef APP
  height:100vh;
  // #endif
  // #ifndef APP
  height: calc(100vh - 50px);
  // #endif
  overflow: hidden;
  padding-top:var(--status-bar-height);
}
.page-bg {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
view,
div {
  box-sizing: border-box;
}
// 自定义公共样式
.w-100 {
  width: 100%;
}
.h-100 {
  height: 100%;
}
.gap-1 {
  gap: 0.25rem;
}
.gap-2 {
  gap: 0.5rem;
}
.gap-4 {
  gap: 1rem;
}
.gap-8 {
  gap: 2rem;
}
.gap-12 {
  gap: 3rem;
}
.gap-16 {
  gap: 4rem;
}
.d-none {
  display: none;
}
.d-block {
  display: block;
}
.d-inline-block {
  display: inline-block;
}
.text-center {
  text-align: center;
}
.text-left {
  text-align: left;
}
.text-right {
  text-align: right;
}
.flex-row {
  display: flex;
  flex-direction: row;
}
.flex-col {
  display: flex;
  flex-direction: column;
}
.flex-0-0 {
  flex: 0 0 auto;
}
.flex-1-1 {
  flex: 1 1 auto;
}
.flex-nowrap {
  flex-wrap: nowrap;
}
.flex-wrap {
  flex-wrap: wrap;
}
.flex-center {
  justify-content: center;
  align-items: center;
}
.justify-center {
  justify-content: center;
}
.justify-between {
  justify-content: space-between;
}
.items-center {
  align-items: center;
}
.items-start {
  align-items: flex-start;
}
.border-50 {
  border-radius: 50%;
}
</style>
