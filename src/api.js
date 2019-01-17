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
    this.axios.defaults.headers.token = this.token = cookie.get('herald-default-token')
    // 更新 token 失效时间
    cookie.set('herald-default-token', this.token || '', { expires: 60 })
  },
  watch: {
    token() {
      this.axios.defaults.headers.token = this.token
      cookie.set('herald-default-token', this.token || '', { expires: 60 })
      this.$emit(this.token ? 'login' : 'logout')
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
      let { status: httpStatus, data: jsonData } = response
      if (httpStatus < 400) {
        let { code, result, reason } = jsonData

        if (code < 400) {
          if (code === 203) {
            result.isStale = true
          }
          return result
        }

        // 出错时的处理
        if (code === 401) {
          if (this.isLogin) {
            this.token = ''
            Vue.toasted.show('登录已失效，请重新登录')
          }
        } else {
          Vue.toasted.show('请求失败：' + reason)
          throw new Error(reason)
        }
      } else {
        Vue.toasted.show('请求失败：系统维护')
        throw new Error('Request failed with status ' + httpStatus)
      }
    }
  }
})