import herald from './util/herald.js'
import { Log } from './logger'
import Vue from 'vue'

const H = herald({
  onLogin (token) {},
  onLogout (token) {},
  onError (e, path) {
    if (e.code === 401) {
      H.token = ''
      Vue.toasted.show('登录已失效，请重新登录')
    } else {
      new Log().red(e.code).yellow(path).cyan(e.reason).fire()
      Vue.toasted.show('部分接口请求失败')
    }
    return null // 返回 null 给调用者，vue 层要做 null 判断
  }
})

export default H
