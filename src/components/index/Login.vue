<template lang="pug">
  .login-wrapper
    .login
      .title 统一身份认证
      .field
        input(placeholder='一卡通号' v-model='user.cardnum' @keyup.enter='login()')
      .field
        input(type='password' placeholder='统一身份认证密码' v-model='user.password' @keyup.enter='login()')
      button.primary(v-if='loading') 登录中…
      button.primary(v-else, @click='login()') 登录
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
        loading: false
      }
    },
    created() {},
    methods: {
      async login() {
        if (/^[0-9a-f]{32,}$/.test(this.user.cardnum)) {
          H.token = this.user.cardnum
          return
        }

        if (!/^[12]\d{8}$/.test(this.user.cardnum) || !this.user.password.trim()) {
          this.$toasted.show('请填写完整')
          return
        }

        this.loading = true
        if (!await H.auth.post(this.user)) {
          this.$toasted.show('登录出现错误，请重试')
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
    bottom 128px
    display flex
    align-items center
    justify-content center

    .login
      box-sizing border-box
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
        font-size 16px
        font-weight bold
        background var(--color-text-bold)
        color #fff
        padding 5px 10px
        border-radius 3px
        margin-bottom 20px


      input
        width 260px

      .error
        font-size 14px
        color #fff
        background var(--color-error)
        padding 5px 10px
        border-radius 3px

</style>
