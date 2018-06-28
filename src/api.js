import cookie from 'js-cookie'
import axios from 'axios'
import Vue from 'vue'
import qs from 'querystring'

// 用 Vue 做一个状态机来充当 api 接口
export default new Vue({
  data: {
    token: null,
    axios: axios.create({
      baseURL: 'https://myseu.cn/ws3/',
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true
    })
  },
  created() {
    this.axios.defaults.headers.token = this.token = cookie.get('herald-default-token')
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
        let { code, result } = data
        status = code

        if (status < 400) {
          if (status === 203) {
            result.isStale = true
          }
          return result
        }
      }

      throw new Error(status)
    }
  }
})