<template lang='pug'>
  #app(:class='{ webapp: webapp, "lang-en": english, "lang-zh": !english }')
    .header
      router-link(to='/')
        img.logo(src='static/images/logo.png')
        .live2d-container
          live2d
      ul.nav
        a
          li(@click='logout()' v-if='isLogin')
            .zh 退出登录
            .en Sign out
        a
          li.lang(@click='toggleLanguage()')
            .zh en
            .en zh
    .container
      router-view(:is-login='isLogin')
</template>

<script>
  import logger from './logger'
  import H from './api'
  import offline from 'offline-plugin/runtime'
  import live2d from './components/Live2D.vue'

  export default {
    name: 'app',
    components: {
      live2d
    },
    data() {
      return {
        isLogin: false,
        webapp: false,
        english: false
      }
    },
    async created() {
      if (window.navigator.standalone) {
        this.webapp = true
      }
      offline.install()
      logger.bindAjax()

      let checkLogin = () => {
        this.isLogin = H.isLogin
        setTimeout(checkLogin, 500)
      }

      setTimeout(checkLogin, 100)
    },
    methods: {
      toggleLanguage() {
        this.english = !this.english
      },
      logout() {
        H.deauth()
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
      -webkit-text-size-adjust: 100%

    *:not(input, textarea, a, a *, *[onclick])
      -webkit-user-select: none
      -moz-user-select: none
      -ms-user-select: none
      user-select: none
      cursor default

    html, body
      margin 0
      padding 0

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

    button:active
      background #212121

    input
      color #555
      background #fafafa
      box-sizing border-box

    input, input:focus
      -webkit-appearance none
      -moz-appearance none
      appearance none

    .lang-en .zh, .lang-zh .en
      display none

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

      .live2d-container
        position absolute
        left 16px
        top 2px
        width 56px
        height 56px

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

    // iOS Webapp 顶栏样式
    &.webapp
      .header
        @media screen and (max-width: 600px)
          @supports (-webkit-backdrop-filter: blur(20px))
            box-shadow inset 0 30px 40px #fff

</style>
