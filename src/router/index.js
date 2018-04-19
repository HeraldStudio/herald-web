import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index/Index'
import NoticePage from '@/components/NoticePage'
import ScreenSaver from '@/components/ScreenSaver'
import Admin from '@/components/admin/Admin'

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
    },
    {
      path: '/notice/:nid',
      name: '通知公告',
      component: NoticePage
    },
    {
      path: '/admin',
      name: '管理中心',
      component: Admin
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
