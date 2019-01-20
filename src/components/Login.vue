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
    button.primary(v-if='loading' disabled) 正在登录…
    button.primary(v-else, @click='login()') 登录
    .tips 小猴偷米使用业界公认标准加密你的所有隐私数据，使用只有你知道的统一身份认证密码和只有你的设备保存的会话标识符 (token) 作为数据解密的密钥。

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
    mounted() {
      this.loading = false
    },
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
          let authResult = await api.post('/auth', {
            cardnum: this.cardnum,
            password: this.password,
            gpassword: this.gpassword,
            platform: 'web'
          })

          // 执行到此处，/auth请求返回，判断是成功还是验证码
          if(authResult.verifyUrl){
            // 有验证码的情况
            window.location.href = authResult.verifyUrl
            // 跳转到ids认证页面
          } else {
            // 不需要验证码
            this.$store.commit('setToken', authResult) // 直接设置token
            api.token = authResult // 更新api中的token设置
            let user = await api.get("/api/user");
            user.admin = await api.get("/api/admin/admin");
            this.$store.commit('setUser', user) // 获取并设置用户信息
          }
          localStorage.setItem('herald-wlan-username', this.cardnum)
          localStorage.setItem('herald-wlan-password', Buffer.from(this.password).toString('base64'))

          // 此时还没有离开登录界面，api.token 被 set 后，会触发 user 拉取，拉取到之后才会跳转到用户界面
          // 因此继续显示 loading 状态直到生命的最后一刻
          // this.loading = false
        } catch (e) {
          if (this.password.length === 6) {
            this.$toasted.show('不要用一卡通充值密码登录小猴！')
          } else {
            this.$toasted.show('登录出现错误，请重试')
          }
          this.password = ''
          this.gpassword = ''
          this.loading = false
        }
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
    margin 0
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
      font-size 16px
      line-height 1.3em

      &[disabled]
        background #ccc

    .error
      font-size 14px
      color #fff
      background var(--color-error)
      padding 5px 10px
      border-radius 3px

    .tips
      text-align justify
      width 260px
      color #ccc
      margin-top 40px

</style>
