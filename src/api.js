import herald from 'herald-js'

const H = herald({
  onLogin (token) {},
  onLogout (token) {},
  onError (e) {
    if (e.code === 401 && H.isLogin) {
      window.herald_forcedLogOut = true
      H.deauth()
    }
    return null // 返回 null 给调用者，vue 层要做 null 判断
  }
})

export default H
