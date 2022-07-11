<template>
  <div class="home" id="home">
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import ChinaMap from '@/views/fiveVR/example/map/map'
import jsonData from '@/views/fiveVR/example/json/china.json'

export default {
  name: 'Home',
  components: {
  },
  data () {
    return {
      chinaMap: null,
    }
  },
  computed: {
      ...mapState('user', [
          'userId',
          'name',
          'roleId'
      ]),
  },
  created() {
    this.$nextTick(() => {
      this.chinaMap = new ChinaMap(this.$refs['canvas'], jsonData)
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.chinaMap.init()
    })
  },
  beforeDestroy() {
  },
  methods: {
    
  }
}
</script>

<style>
  .tooltip {
      position: absolute;
      z-index: 2;
      background: white;
      padding: 10px;
      border-radius: 2px;
      visibility: hidden;
    }
</style>

<style lang="scss">
  @import "index.scss";
</style>
