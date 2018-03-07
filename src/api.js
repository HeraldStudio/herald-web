import herald from 'herald-js'
import Vue from 'vue'

const H = herald({
  onLogin (token) {},
  onLogout (token) {},
  onError (e) {
    if (e.code === 401) {
      H.deauth()
      Vue.toasted.show('由于其他浏览器端登录，当前平台已下线。', {
        action: {
          text: '为什么？',
          onClick: () => {
            this.$toasted.show(
              '小猴偷米现已采用更安全的加密机制，加密密钥仅保存在用户端，且每个用户端密钥不同。' +
              '每一个有效的密钥，都需要小猴后端系统中对应的一条数据来维持。为了缓解颁发过多密钥' +
              '造成的数据库过度膨胀，我们设定同一用户在同一平台只允许一处登录。', { duration: 30000 })
          }
        }
      })
    } else {
      Vue.toasted.show('请求出错：' + e.reason || '请求失败')
    }
    return null // 返回 null 给调用者，vue 层要做 null 判断
  }
})

export default H
