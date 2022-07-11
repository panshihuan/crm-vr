<template>
  <div>
    <AppFullMain />
  </div>
</template>

<script>
import AppFullMain from './components/AppFullMain'
export default {
  name: 'LayoutFull',
  components: {
    AppFullMain
  },
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
