<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
     <keep-alive :include="cachedViews">
        <router-view :key="key" />
     </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= tabbar  50   */
  // height: calc(100vh - 50px);
  padding-bottom: 50px;
  width: 100%;
}
</style>
