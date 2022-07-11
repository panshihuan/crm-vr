// "version": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0 && git add CHANGELOG.md"

import router from './router'
import store from './store'
import NProgress from 'nprogress'

const _import = require('./router/_import_' + process.env.NODE_ENV)
import Layout from '@/layout'
import LayoutFull from '@/layout/layoutFull'
// import { constantRoutes } from '@/router/index'


NProgress.configure({ showSpinner: false })

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  document.title = to.meta.title
  next()
})

function go404(next) {
  next({ name: 'Empty404' })
}


router.afterEach(() => {
  NProgress.done()
})

router.beforeEach((to, from, next) => {
    if (from.meta.keepAlive&&from.meta.ele) {
      const $wrapper = document.querySelector(`.${from.meta.ele}`); // 列表的外层容器 注意找到滚动的盒子
      const scrollTop = $wrapper ? $wrapper.scrollTop : 0;
      from.meta.scrollTop = scrollTop;
    }
    next();
  });
