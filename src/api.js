import herald from './util/herald.js'
import { Log } from './logger'
import axios from 'axios'

const H = herald({
  onLogin (token) {},
  onLogout (token) {},
  async onError (e, path) {
    if (e.code === 401) {
      H.token = ''
      Vue.toasted.show('登录已失效，请重新登录')
    } else if (e.reason.request.status === 0 && !e.reason.response) {
      Vue.toasted.show('网络异常，已加载缓存')
    } else {
      new Log().red(e.code).yellow(path).cyan(e.reason).fire()
      Vue.toasted.show('部分接口请求失败')
    }
    throw e // 抛出异常，不覆盖已有缓存数据
  }
})

export default H
