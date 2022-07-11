<template>
  <div>
    <app-main />
  </div>
</template>

<script>
import AppMain from './components/AppMain'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Layout',
  components: {
    AppMain,
  },
  data() {
    return {
      active: 0,
    }
  },
  computed: {
      ...mapState('user', [
          'userId'
      ]),
  },
  watch: {
    $route () {
      this.setCurrentRoute()
    }
  },
  created() {
    this.setCurrentRoute()
    // this.getNotifyList({ userId: this.userId })
  },
  methods: {
    ...mapActions('common', [
        'getNotifyList'
    ]),
    changeTab(val) {
      switch (val) {
        case 0 :
          this.$router.push({
             name: 'Home'
          })
          break;
        case 1 :
          this.$router.push({
             name: 'Menu'
          })
          break;
        case 2 :
          this.$router.push({
             name: 'Mine'
          })
          break;

        default:;
      }
    },
    setCurrentRoute() {
      const routerName = this.$route.name
      const tabHome = ['Home']
      const tabMenu = ['Menu']
      const tabMine = ['Mine']
      if (tabHome.includes(routerName)) {
        this.active = 0
        return
      }
      if (tabMenu.includes(routerName)) {
        this.active = 1
        return
      }
      if (tabMine.includes(routerName)) {
        this.active = 2
        return
      }
    }
  }
}
</script>

<style lang="scss">
  @import "index.scss";
</style>
