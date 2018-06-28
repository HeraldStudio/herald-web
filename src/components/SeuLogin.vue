<template lang='pug'>
  .seu-login(v-if='needLogin')
    .hint 当前可能在 seu-wlan 网络下
    .operations(v-if='saved')
      button.login(@click='login()') 用 {{ form.cardnum }} 的身份登录
      button.change(@click='saved = false') 换个账号
    .form(v-else)
      input(placeholder='一卡通号' v-model='form.cardnum' @keyup.enter='login()')
      input(type='password' placeholder='统一身份认证密码' v-model='form.password' @keyup.enter='login()')
      button.primary(v-if='!isLoading', @click='login()') 登录
</template>
<script>
  import api from '@/api'
  import axios from 'axios'
  import qs from 'querystring'

  export default {
    props: ['isLoading'],
    data () {
      return {
        form: {
          cardnum: '',
          password: ''
        },
        saved: false,
        needLogin: false
      }
    },
    async created () {
      let cardnum = localStorage.getItem('herald-wlan-username')
      let password = localStorage.getItem('herald-wlan-password')
      if (password) {
        password = Buffer.from(password, 'base64').toString()
      }
      if ((this.form.cardnum = cardnum) && (this.form.password = password)) { // 赋值
        this.saved = true
      }
      await this.check()
    },
    methods: {
      async login() {
        try {
          await axios.get('https://w.seu.edu.cn/index.php/index/login?' + qs.stringify({
            username: this.form.cardnum,
            password: Buffer.from(this.form.password).toString('base64')
          }))
        } catch (e) {}
        await this.check()
        if (!this.needLogin) {
          localStorage.setItem('herald-wlan-username', this.form.cardnum)
          localStorage.setItem('herald-wlan-password', Buffer.from(this.form.password).toString('base64'))
          location.reload()
        }
      },
      async check() {
        this.needLogin = navigator.onLine && await axios.head('/', {
          validateStatus: () => true
        }).then(() => false, () => true)
      }
    }
  }
</script>
<style lang='stylus' scoped>
.seu-login
  width 100%
  box-sizing border-box
  padding 10px 20px
  background var(--color-warning-bg)
  border-bottom 0.5px solid var(--color-divider)
  display flex
  flex-direction column

  input
    background rgba(#000, .1)
    color var(--color-warning-dark)
    font-size 13px
    padding 2px 7px
    flex 1 1 auto
    width 100px

  button
    background var(--color-warning)
    color #fff
    flex 0 0 auto
    white-space nowrap

  .hint
    color var(--color-warning-dark)
    margin-bottom 10px

  .operations, .form
    display flex
    flex-direction row
    align-items center

    * + *
      margin-left 5px
</style>
