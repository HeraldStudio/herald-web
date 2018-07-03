import cookie from 'js-cookie'
import axios from 'axios'
import Vue from 'vue'
import qs from 'querystring'

// 用 Vue 做一个状态机来充当 api 接口
export default new Vue({
  data: {
    token: '',
    axios: axios.create({
      baseURL: 'https://myseu.cn/ws3/',
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true
    })
  },
  created() {
    this.axios.defaults.headers.token = this.token = cookie.getJSON('herald-default-token')
    // 更新 token 失效时间
    cookie.set('herald-default-token', this.token, { expires: 60 })
  },
  watch: {
    token() {
      this.axios.defaults.headers.token = this.token
      cookie.set('herald-default-token', this.token, { expires: 60 })
    }
  },
  computed: {
    isLogin() {
      return !!this.token
    }
  },
  methods: {
    async get(route = '/', data = {}) {
      let params = qs.stringify(data)
      if (params) params = '?' + params
      return this.handleResponse(await this.axios.get(route + params))
    },
    async post(route = '/', data = {}) {
      return this.handleResponse(await this.axios.post(route, data))
    },
    async put(route = '/', data = {}) {
      return this.handleResponse(await this.axios.put(route, data))
    },
    async delete(route = '/', data = {}) {
      let params = qs.stringify(data)
      if (params) params = '?' + params
      return this.handleResponse(await this.axios.delete(route + params))
    },
    handleResponse(response) {
      let { status, data } = response
      if (status < 400) {
        let { code, result, reason } = data
        status = code
        data = reason

        if (status < 400) {
          if (status === 203) {
            result.isStale = true
          }
          return result
        }
      }

      // 出错时的处理
      if (status === 401) {
        if (this.isLogin) {
          this.token = ''
          Vue.toasted.show('登录已失效，请重新登录')
        }
      } else {
        Vue.toasted.show('部分接口请求失败')
      }

      throw new Error(data)
    }
  }
})