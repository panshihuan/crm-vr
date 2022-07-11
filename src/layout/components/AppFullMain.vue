<template>
  <section class="out-main">
    <transition name="fade-transform" mode="out-in">
     <keep-alive :include="cachedViews">
        <router-view />
     </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppFullMain',
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
.out-main{
    width: 100%;
    font-size: 14px;
}
</style>
