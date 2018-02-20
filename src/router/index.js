import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index'
import ScreenSaver from '@/pages/ScreenSaver'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '首页',
      component: Index
    },
    {
      path: '/screensaver',
      name: '屏保',
      component: ScreenSaver
    }
  ]
})
