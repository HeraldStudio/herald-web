<template lang="pug">

  .login-wrapper
    .login
      .title
        .zh 统一身份认证
        .en Identification
      .field
        input.zh(placeholder='一卡通号' v-model='user.cardnum' @keyup.enter='login()')
        input.en(placeholder='Student card number' v-model='user.cardnum' @keyup.enter='login()')
      .field
        input.zh(type='password' placeholder='统一身份认证密码' v-model='user.password' @keyup.enter='login()')
        input.en(type='password' placeholder='Combined identification password' v-model='user.password' @keyup.enter='login()')
      .error(v-if='error')
        .zh 登录出现问题，请重试
        .en Something wrong, please try again.
      button(v-if='loading')
        .zh 登录中…
        .en Loading...
      button(v-else, @click='login()')
        .zh 登录
        .en Sign in

</template>
<script>

  import H from '@/api'

  export default {
    data() {
      return {
        user: {
          cardnum: '',
          password: '',
          platform: 'web'
        },
        error: false,
        loading: false
      }
    },
    created() {

    },
    methods: {
      async login() {
        if (/^[0-9a-f]{32,}$/.test(this.user.cardnum)) {
          H.token = this.user.cardnum
          return
        }

        if (!/^[12]\d{8}$/.test(this.user.cardnum) || !this.user.password.trim()) {
          this.error = true
          return
        }

        this.loading = true
        this.error = false
        if (!await H.auth.post(this.user)) {
          this.error = true
          this.user.password = ''
        }
        this.loading = false
      }
    }
  }

</script>
<style lang="stylus" scoped>

  .login-wrapper
    position fixed
    left 0
    right 0
    top 64px
    bottom 0
    display flex
    align-items center
    justify-content center

    .login
      box-sizing border-box
      text-align center

      display flex
      flex-direction column
      align-items flex-start

      -webkit-user-select: none
      -moz-user-select: none
      -ms-user-select: none
      user-select: none

      > *
        margin-top 10px

      .title
        font-size 18px
        color #fff
        padding 5px 10px
        background #555

      input
        width 260px

      button
        font-size 16px
        padding 5px 10px

      .error
        font-size 14px
        color #fff
        background #cc5e6f
        padding 5px 10px

</style>
