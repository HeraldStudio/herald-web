import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Live2DPage from '@/components/Live2DPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '首页',
      component: Index
    },
    {
      path: '/night',
      name: '首页',
      component: Index
    },
    {
      path: '/screensaver',
      name: '屏保',
      component: Live2DPage
    }
  ]
})
