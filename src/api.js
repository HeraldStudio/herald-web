import herald from './util/herald.js'
import Vue from 'vue'

const H = herald({
  onLogin (token) {},
  onLogout (token) {},
  onError (e) {
    if (e.code === 401) {
      H.deauth()
      Vue.toasted.show('登录已失效，请重新登录')
    } else {
      Vue.toasted.show(e.code + '：' + e.reason || '部分接口请求失败')
    }
    return null // 返回 null 给调用者，vue 层要做 null 判断
  }
})

export default H
