import herald from './util/herald.js'
import { Log } from './logger'
import cookie from 'js-cookie'
import axios from 'axios'
import Vue from 'vue'

let api = axios.create({
  baseURL: 'https://myseu.cn/ws3/',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false // 所有请求不带 Cookie
});

['get', 'post', 'put', 'delete', 'head', 'options'].map(k => {
  api[k] = (...args) => {
    api[k]
  }
})

Object.defineProperty(api, 'token', {
  get() {
    return cookie.get('herald-default-token')
  },
  set(newValue) {
    cookie.set('herald-default-token', newValue, { expires: 60 })
    api.defaults.headers.token = newValue
  }
})

// 每次启动时从存储中 get 出 token，重新 set
// 两个作用，一是把 token 设置到 headers 里，二是更新存储 token 过期时间
api.token = api.token
export default api