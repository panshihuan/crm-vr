<template>
  <div class="page404">
    404
    <div style="text-align: center;color: #12b9f1;font-size:18px;" @click="goHome">去主页</div>
  </div>
</template>

<script>
export default {
    name: 'Empty404',
    components: {
    },
    methods: {
      goHome() {
        this.$router.push({
          name: 'Home'
        })
      }
    }
}
</script>
<style lang="sass" scoped>
</style>
