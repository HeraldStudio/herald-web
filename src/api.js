import herald from 'herald-js'
import Vue from 'vue'

const H = herald({
  onLogin (token) {},
  onLogout (token) {},
  onError (e) {
    if (e.code === 401 && H.isLogin) {
      window.herald_forcedLogOut = true
      H.deauth()
    }
    Vue.toasted.show('请求出错：' + e.reason)
    return null // 返回 null 给调用者，vue 层要做 null 判断
  }
})

export default H
