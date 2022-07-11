/*
 * @Descripttion: 
 * @Date: 2020-08-28 10:55:36
 * @LastEditors: thh
 * @LastEditTime: 2020-09-04 10:03:11
 * @FilePath: \crm-mobile\src\router\home.js
 */

import Layout from '@/layout'
import LayoutFull from '@/layout/layoutFull'

function concatRouters(fileName) {
  // const reg = new RegExp(`${fileName}\.js$`)
  let routesApp = []
  let routerApp = []
  if (fileName === 'router') {
    routerApp = require.context('@/views/', true, /router\.js$/)
  } else if (fileName === 'routerFull') {
    routerApp = require.context('@/views/', true, /routerFull\.js$/)
  }
  routerApp.keys().forEach(r => {
    const route = routerApp(r).default
    if (Array.isArray(route)) {
      routesApp = routesApp.concat(route)
    } else {
      routesApp.push(route)
    }
  })
  return routesApp
}

export const constantRoutes = [
  // layout 有tabbar的页面直接挂
  {
    path: '/vr',
    component: LayoutFull,
    redirect: '/home',
    hidden: true,
    meta: {
      title: ''
    },
    children: [
      {
        path: '/vr/index',
        name: 'Home',
        meta: {
          title: '首页',
          icon: 'home',
          haveCache: true
        },
        component: () => import('@/views/home')
      },
      ...concatRouters('router')
    ]
  },
  {
    path: '/',
    component: LayoutFull,
    hidden: true,
    redirect: '/vr/index',
    meta: {
      title: ''
    },
    children: [
      {
        path: '/empty',
        name: 'Empty404',
        component: () => import('@/views/empty'),
        meta: {
          title: '404'
        }
      },
      {
        path: '/five',
        name: 'FiveVR',
        component: () => import('@/views/fiveVR'),
        meta: {
          title: 'vr'
        }
      },
      ...concatRouters('routerFull')
    ]
  },
  
]
