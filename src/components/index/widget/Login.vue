<template lang="pug">

  widget.login(title='统一身份认证' :show='!isLogin')
    .live2d-container
      live2d
    .field
      input(placeholder='一卡通号' v-model='user.cardnum' @keyup.enter='login()')
    .field
      input(type='password' placeholder='统一身份认证密码' v-model='user.password' @keyup.enter='login()')
    button.primary(v-if='loading') 登录中…
    button.primary(v-else, @click='login()') 登录

</template>
<script>

  import H from '@/api'
  import widget from './Widget.vue'
  import live2d from '@/components/Live2D.vue'

  export default {
    props: ['isLogin'],
    components: { live2d, widget },
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

  .widget.login
    align-items center
    padding 30px 0

    .live2d-container
      position relative
      width 100px
      height 100px
      filter hue-rotate(-15deg)
      margin-bottom 10px

    .hint
      margin-bottom 30px
      font-size 16px
      color #555
      font-weight bold

    input
      width 260px
      margin-bottom 10px

    button
      width 260px
      padding 5px 10px
      margin-top 10px

    .error
      font-size 14px
      color #fff
      background var(--color-error)
      padding 5px 10px
      border-radius 3px

</style>
