<template lang="pug">

  .widget.login(v-if='!user')
    .live2d-container
      //- 仿 B 站，输密码闭眼睛
      live2d(:force-state='isPasswordFocus ? "sleep" : ""')
    .field
      input(placeholder='一卡通号' v-model='cardnum' @keyup.enter='login()')
    .field
      input(type='password' placeholder='统一身份认证密码' ref='password' v-model='password' @keyup.enter='login()' @keydown.tab='preventTab' @focus='isPasswordFocus = true' @blur='isPasswordFocus = false')
    .field(v-if='isGraduate')
      input(type='password' placeholder='研院密码（初始为八位生日，留空同上）' v-model='gpassword' @keyup.enter='login()')
    button.primary(v-if='loading') …
    button.primary(v-else, @click='login()') 登录

</template>
<script>

  import api from '@/api'
  import live2d from '@/components/Live2D.vue'

  export default {
    props: ['user'],
    components: { live2d },
    data() {
      return {
        cardnum: '',
        password: '',
        gpassword: '',
        loading: false,
        isPasswordFocus: false
      }
    },
    created() {},
    watch: {
      cardnum() { // 十分贴心的设计，一卡通输够 9 位自动聚焦密码框
        if (this.cardnum.length === 9) {
          this.$refs.password.focus()
        }
      }
    },
    methods: {
      preventTab(e) { // 同时，既然自动跳过去了，应该阻止用户再次按下 tab
        if (e.keyCode === 9) {
          e.preventDefault()
        }
      },
      async login() {
        if (/^[0-9a-f]{32,}$/.test(this.cardnum)) {
          api.token = this.cardnum
          return
        }

        if (!/^[12]\d{8}$/.test(this.cardnum) || !this.password.trim()) {
          this.$toasted.show('请填写完整')
          return
        }

        this.loading = true

        try {
          api.token = await api.post('/auth', {
            cardnum: this.cardnum,
            password: this.password,
            gpassword: this.gpassword,
            platform: 'web'
          })
          localStorage.setItem('herald-wlan-username', this.cardnum)
          localStorage.setItem('herald-wlan-password', Buffer.from(this.password).toString('base64'))
        } catch (e) {
          if (/^21318/.test(this.cardnum)) {
            this.$toasted.show('18级新生？过几天才能登陆哦～')
          } else {
            this.$toasted.show('登录出现错误，请重试')
          }
          this.password = ''
          this.gpassword = ''
        }
        this.loading = false
      }
    },
    computed: {
      isGraduate () {
        return /^22/.test(this.cardnum)
      }
    }
  }

</script>
<style lang="stylus" scoped>

  .widget.login
    align-items center
    position absolute
    width 100%
    min-height 100%
    bottom 0
    display flex
    flex-direction column
    justify-content center

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
