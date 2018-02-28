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
    created() {
      if (window.herald_forcedLogOut) {
        this.$toasted.show('由于其他浏览器端登录，当前平台已下线。', {
          action: {
            text: '为什么？',
            onClick: () => {
              this.$toasted.show(
                '小猴偷米现已采用更安全的加密机制，加密密钥仅保存在用户端，且每个用户端密钥不同。' +
                '每一个有效的密钥，都需要小猴后端系统中对应的一条数据来维持。为了缓解颁发过多密钥' +
                '造成的数据库过度膨胀，我们设定同一用户在同一平台只允许一处登录。', { duration: 30000 })
            }
          },
        })
        window.herald_forcedLogOut = false
      }
    },
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
      text-align center

      display flex
      flex-direction column
      align-items center

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
