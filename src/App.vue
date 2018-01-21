<template lang='pug'>
  #app(:class='{ webapp: webapp, "lang-en": english, "lang-zh": !english }')
    .header
      img.logo(src='static/images/logo.png')
      live2d
      ul.nav
        a
          li(@click='logout()' v-if='user.uuid')
            .zh 退出登录
            .en Sign out
        a
          li.lang(@click='toggleLanguage()')
            .zh en
            .en zh
    .container
      router-view(v-if='user.uuid')
      .login(v-else)
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
  import logger from './logger'
  import api from './api'
  import cookie from 'js-cookie'
  import qs from 'qs'
  import offline from 'offline-plugin/runtime'
  import live2d from './components/Live2D.vue'

  export default {
    name: 'app',
    components: {
      live2d
    },
    data() {
      return {
        webapp: false,
        english: false,
        user: {
          cardnum: '',
          password: ''
        },
        error: false,
        loading: false
      }
    },
    async created() {
      if (window.navigator.standalone) {
        this.webapp = true
      }
      offline.install()
      logger.bindAjax()
      let user = cookie.getJSON('user')
      if (user && typeof user === 'object') {
        user.cardnum = user.cardnum || ''
        user.password = user.password || ''
        this.user = user
      }
      // 自用 屏保登录
      if (/#\/night(\/.*?\/.*?)?/.test(location.hash)) {
        document.body.className += ' night'
        if (RegExp.$1) {
          let [cardnum, password] = /^\/(.*)\/(.*)$/.exec(RegExp.$1).slice(1)
          this.user.cardnum = cardnum
          this.user.password = password
          this.login()
        }
      }
    },
    methods: {
      toggleLanguage() {
        this.english = !this.english
      },
      async login() {
        if (!/^2\d{8}$/.test(this.user.cardnum) || !this.user.password.trim()) {
          this.error = true
        }

        this.loading = true
        let res = await api.post('/uc/auth', {
          appid: '9f9ce5c3605178daadc2d85ce9f8e064',
          user: this.user.cardnum,
          password: this.user.password
        })
        this.loading = false
        if (res.status >= 400) {
          this.error = true
          this.user.password = ''
        } else {
          this.error = false
          this.user.uuid = res.data
          cookie.set('user', this.user, { expires: 365 })
        }
      },
      logout() {
        this.user = {
          cardnum: '',
          password: ''
        }
        cookie.set('user', this.user, { expires: 365 })
        cookie.set('curriculum', null, { expires: 365 })
      }
    }
  }
</script>

<style lang='stylus'>
  :root
    --divider-color #f0f0f0
    --theme-color #229ded
    --theme-color-dark #1a7ab8
    --theme-color-light #78cdff

    *
      font-family 'Avenir Next', 'Noble Scarlet', 'PingFang SC', 'Microsoft YaHei UI', sans-serif

    *:not(input, textarea, a, a *, *[onclick])
      -webkit-user-select: none
      -moz-user-select: none
      -ms-user-select: none
      user-select: none
      cursor default

    html, body
      margin 0
      padding 0

      &.night
        background #000
        color #ccc
        --divider-color #333
        --theme-color #6099b8

    p
      margin-top 0
      margin-bottom 0
      line-height 1.75em

    a, a:link, a:hover, a:active, a:focus, a:visited
      color inherit
      text-decoration none
      -webkit-appearance none
      -moz-appearance none
      appearance none

    button, input
      outline none
      border none
      padding 8px 12px
      margin 0
      font-size 15px

    button
      color #fff
      background #555
      -webkit-transition .2s
      -moz-transition .2s
      -ms-transition .2s
      -o-transition .2s
      transition .2s

    .night button
      background #555
      color #ccc

    button:active
      background #212121

    input
      color #555
      background #fafafa
      box-sizing border-box

    .night input
      background #212121
      color #888

    input, input:focus
      -webkit-appearance none
      -moz-appearance none
      appearance none

    .lang-en .zh, .lang-zh .en
      display none

    .night img
      -webkit-filter brightness(0.8)

  #app
    padding 0

    .header
      position fixed
      top 0
      left 0
      right 0
      z-index 999
      height 40px
      max-width 1200px

      margin 0 auto
      padding 10px

      display flex
      flex-direction row
      justify-content flex-start
      overflow hidden

      background #fff
      border-bottom 1px solid var(--divider-color)

      -webkit-user-select: none
      -moz-user-select: none
      -ms-user-select: none
      user-select: none

      .night &
        background #000

        img.logo
          -webkit-filter invert()

      @media screen and (max-width: 600px)
        @supports (-webkit-backdrop-filter: blur(20px))
          background rgba(255, 255, 255, .8)
          -webkit-backdrop-filter: blur(20px)
          border-bottom 1px solid rgba(0, 0, 0, .05)

      img.logo
        width auto
        height 40px
        object-fit contain
        pointer-events none
        padding 0 10px

      ul.nav
        height 100%
        padding 0
        margin 0
        flex 1 1 0
        display flex
        flex-direction row
        align-items center
        justify-content flex-end

        li
          list-style none
          font-size 14px
          color #555
          padding 0 10px
          cursor pointer

          .night &
            color #888

          &.lang
            background var(--theme-color)
            color #fff
            padding 0
            margin 0 10px
            width 26px
            text-align center

    .container
      max-width 1200px

      margin 0 auto
      padding 70px 15px 10px
      overflow scroll

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

        >*
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

    // iOS Webapp 顶栏样式
    &.webapp
      .header
        @media screen and (max-width: 600px)
          @supports (-webkit-backdrop-filter: blur(20px))
            box-shadow inset 0 30px 40px #fff

</style>
