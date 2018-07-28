// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import interceptor from './util/interceptor'
import Toasted from 'vue-toasted'
import Persist from 'vue-component-persist'

if (window.navigator.standalone) {
  window.__herald_env = 'webapp'
} else if (window.__wxjs_environment === 'miniprogram') {
  window.__herald_env = 'mina'
} else if (/micromessenger/.test(window.navigator.userAgent.toLowerCase())) {
  window.__herald_env = 'wx'

  // 微信环境下，为了隐藏前进后退按钮栏，在 router/index.js 中设置了 vue-router 的 mode 为 abstract
  // 在这种模式下，vue-router 不会自动打开首页，需要手动调用 router.push('/') 打开首页。
  // 注意不能用 replace，用 replace 将导致无法返回首页。
  // 参考：https://github.com/vuejs/vue-router/issues/729
  router.push('/')

  // 如果地址中包含某 hash，打开对应的页面，因为 abstract 模式不会处理地址 hash
  let current = location.hash.replace(/^#/, '')
  if (current && current !== '/') {
    router.push(current)
  }
}

Vue.config.productionTip = false

Vue.use(Toasted, {
  duration: 5000,
  position: 'top-center'
})

Vue.use(Persist, {
  read: k => {
    let data = JSON.parse(localStorage.getItem(k))
    try {
      data.data.isStale = true
    } catch (e) {}
    return data
  }
})

// Toast 去重
let lastToastText = null
Vue.toasted.__show = Vue.toasted.show
Vue.toasted.show = (text, ...args) => {
  if (text !== lastToastText) {
    lastToastText = text
    setTimeout(() => lastToastText = null, 10000)
    return Vue.toasted.__show(text, ...args)
  }
}

// router.afterEach(route => document.title = '小猴偷米' + (route.name ? '丨' + route.name : ''))

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})