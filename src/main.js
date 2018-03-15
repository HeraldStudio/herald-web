// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Toasted from 'vue-toasted'

window.Vue = Vue

Vue.config.productionTip = false
Vue.use(Toasted, {
  duration: 5000,
  position: 'top-center'
})

// Toast 去重
let lastToastText = null
Vue.toasted.__show = Vue.toasted.show
Vue.toasted.show = (text, ...args) => {
  if (text !== lastToastText) {
    lastToastText = text
    return Vue.toasted.__show(text, ...args)
  }
}

router.afterEach(route => document.title = '小猴偷米' + (route.name ? '丨' + route.name : ''))

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
