<template lang="pug">

  .login
    .title
      .zh 统一身份认证
      .en Identification
    .field
      input.zh(placeholder='一卡通号' v-model='user.cardnum')
      input.en(placeholder='Student card number' v-model='user.cardnum')
    .field
      input.zh(type='password' placeholder='统一身份认证密码' v-model='user.password')
      input.en(type='password' placeholder='Combined identification password' v-model='user.password', @submit='login()')
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

  import H from '../api'

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
        if (!/^2\d{8}$/.test(this.user.cardnum) || !this.user.password.trim()) {
          this.error = true
        }

        this.loading = true
        this.error = false
        try {
          await H.auth.post(this.user)
        } catch (e) {
          this.error = true
          this.user.password = ''
        }
        this.loading = false
      }
    }
  }

</script>
<style lang="stylus" scoped>

  .login
    width 400px
    margin 150px auto
    padding 60px 40px
    box-sizing border-box
    text-align center

    display flex
    flex-direction column
    align-items flex-start

    -webkit-user-select: none
    -moz-user-select: none
    -ms-user-select: none
    user-select: none

    @media screen and (max-width: 600px)
      margin 80px auto
      width auto

    > *
      margin-top 10px

    .title
      font-size 18px
      color #fff
      padding 5px 10px
      background var(--theme-color)

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
