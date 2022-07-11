import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as filters from './filters'
// import FastClick from 'fastclick'
import '@/styles/index.scss' // global css
import './permission'
import './crm_bridge.js'
import './icons'

import Bus from './utils/eventBus'
import Element from 'element-ui'
import './styles/element-variables.scss'

Vue.use(Element, {
  size: 'medium' // set element-ui default size
})

// import Vconsole from 'vconsole'
// if (process.env.VUE_APP_CURRENTMODE === 'development' || window.location.host == "crm-inner.bookan.com.cn:52180") {
//   const vConsole = new Vconsole()
//   Vue.use(vConsole)
// }
const _ = require('lodash')

Bus(Vue)
Vue.use(_)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false


if (process.env.VUE_APP_CURRENTMODE === 'development') {
  require('./mock') // 引入mock数据
}

new Vue({
  el: '#app',
  router,
  store,
  data() {
    return {
      timerId: null
    }
  },
  mounted () {
      window.addEventListener('scroll', this.justifyPos)
  },
  methods: {
    justifyPos () {
        if (this.timerId) {
          clearTimeout(this.timerId)
          this.timerId = null
        }
        this.timerId = setTimeout(() => {
            this.$route.meta.y = window.pageYOffset
        }, 300)
    }
  },
  render: h => h(App)
})
