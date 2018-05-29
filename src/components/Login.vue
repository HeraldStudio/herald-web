<template lang="pug">

  .widget.login(v-if='!user')
    .live2d-container
      live2d
    .field
      input(placeholder='一卡通号' v-model='form.cardnum' @keyup.enter='login()')
    .field
      input(type='password' placeholder='统一身份认证密码' v-model='form.password' @keyup.enter='login()')
    .field(v-if='isGraduate')
      input(type='password' placeholder='研院密码（初始为八位生日，留空同上）' v-model='form.gpassword' @keyup.enter='login()')
    button.primary(v-if='loading') 登录中…
    button.primary(v-else, @click='login()') 登录

</template>
<script>

  import H from '@/api'
  import live2d from '@/components/Live2D.vue'

  export default {
    props: ['user'],
    components: { live2d },
    data() {
      return {
        form: {
          cardnum: '',
          password: '',
          gpassword: ''
        },
        loading: false
      }
    },
    created() {},
    methods: {
      async login() {
        if (/^[0-9a-f]{32,}$/.test(this.form.cardnum)) {
          H.token = this.form.cardnum
          return
        }

        if (!/^[12]\d{8}$/.test(this.form.cardnum) || !this.form.password.trim()) {
          this.$toasted.show('请填写完整')
          return
        }

        this.loading = true
        this.form.platform = 'web'

        if (!await H.auth.post(this.form)) {
          this.$toasted.show('登录出现错误，请重试')
          this.form.password = ''
          this.form.gpassword = ''
        } else {
          localStorage.setItem('herald-wlan-username', this.form.cardnum)
          localStorage.setItem('herald-wlan-password', new Buffer(this.form.password).toString('base64'))
        }
        this.loading = false
      }
    },
    computed: {
      isGraduate () {
        return /^22/.test(this.form.cardnum)
      }
    }
  }

</script>
<style lang="stylus" scoped>

  .widget.login
    align-items center
    padding 150px 0

    .live2d-container
      position relative
      width 100px
      height 100px
      filter hue-rotate(-15deg)
      margin-bottom 25px

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
