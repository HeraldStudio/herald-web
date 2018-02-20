import herald from 'herald-js'

const H = herald({
  onLogin () {},
  onLogout () {},
  onError (e) {
    console.log('onError', H.isLogin, e)
    if (e.code === 401 && H.isLogin) {
      H.deauth()
    }
    return null // 返回 null 给调用者，vue 层要做 null 判断
  }
})

export default H
