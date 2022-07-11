import Vue from 'vue'
import VueRouter from 'vue-router'
import { constantRoutes } from './home'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const router404 = {
  path: '*',
  component: () => import('@/components/Page404')
}


const routesAll = [...constantRoutes, router404]

const createRouter = () => new VueRouter({
  // mode: 'hash',
  // base: process.env.BASE_URL,

  scrollBehavior: (to, from , savedPosition) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const offset = { x: to.meta.x || 0, y: to.meta.y || 0 }
        resolve(offset)
      }, 0)
    })
  },

  routes: routesAll
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
