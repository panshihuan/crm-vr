<template>
  <div id="app">
    <!-- <router-view /> -->
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViewsLayout">
          <router-view />
      </keep-alive>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'App',
  data () {
    return {}
  },
  components: {
  },
  computed: {
    cachedViewsLayout() {
      return ['Layout']
    },
    key() {
      return this.$route.path
    }
  },
  watch: {
    $route() {
      this.addTags()
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    addTags() {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('tagsView/addView', this.$route)
      }
      return false
    }
  }
}
</script>

