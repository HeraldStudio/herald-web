import cookie from 'js-cookie'
import axios from 'axios'
import Vue from 'vue'
import qs from 'querystring'
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";

// 用 Vue 做一个状态机来充当 api 接口
export default new Vue({
  data: {
    axios: axios.create({
      baseURL: 'https://myseu.cn/ws3/',
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true
    })
  },
  created() {
  },
  computed: {
    isLogin() {
      return window.store.getters.isLogin
    },
    token() {
      return window.store.state.token
    }
  },
  methods: {
    async get(route = '/', data = {}) {
      this.updateHeaders()
      let params = qs.stringify(data)
      if (params) params = '?' + params
      return this.handleResponse(await this.axios.get(route + params))
    },
    async post(route = '/', data = {}) {
      this.updateHeaders()
      return this.handleResponse(await this.axios.post(route, data))
    },
    async put(route = '/', data = {}) {
      this.updateHeaders()
      return this.handleResponse(await this.axios.put(route, data))
    },
    async delete(route = '/', data = {}) {
      this.updateHeaders()
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
          if(this.isLogin){
            Vue.toasted.show('登录已失效，请重新登录')
          }
          window.store.commit('logout')
        } else {
          Vue.toasted.show('请求失败：' + reason)
          throw new Error(reason)
        }
      } else {
        Vue.toasted.show(`请求出错 (${ httpStatus })`)
        throw new Error('Request failed with status ' + httpStatus)
      }
    },
    updateHeaders(){
      this.axios.defaults.headers.token = this.token
    }
  }
})