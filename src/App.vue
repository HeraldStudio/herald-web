<template lang='pug'>
  #app(:class='{ webapp: webapp }')
    .header
      router-link.live2d-wrapper(to='/')
        .live2d-container
          live2d
        img.logo(src='static/images/logo.png')
      ul.nav
        router-link(to='/')
          li 主站
        router-link(to='/admin' v-if='isAdmin')
          li 管理中心
        a
          li(@click='logout()' v-if='isLogin') 退出登录
    .container
      router-view(:isLogin='isLogin' :isAdmin='isAdmin')
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
        isAdmin: false,
        webapp: false
      }
    },
    async created() {
      if (window.navigator.standalone) {
        this.webapp = true
      }
      // offline.install()
      logger.bindAjax()

      let checkLogin = async () => {
        if (!this.isLogin && H.isLogin) {
          let adminObj = await H.api.admin.admin()
          let isAdmin = false
          for (let k in adminObj) {
            if (adminObj[k]) {
              isAdmin = true
              break
            }
          }
          this.isAdmin = isAdmin
          if (adminObj && adminObj.super) {
            location.href = '#/admin'
          }
        } else if (!H.isLogin) {
          this.isAdmin = false
        }
        this.isLogin = H.isLogin
        if (!this.isAdmin && /^#\/admin/.test(location.hash)) {
          location.href = '#/'
        }
        setTimeout(checkLogin, 500)
      }

      setTimeout(checkLogin, 500)
    },
    methods: {
      logout() {
        H.deauth()
      }
    }
  }
</script>

<style lang='stylus'>
  :root
    --divider-color #f0f0f0
    --theme-color #00abc3
    --theme-color-dark #237a86
    --theme-color-light #ddfbff

    ::selection
      background var(--theme-color-light)

    *
      font-family 'Avenir Next', 'Noble Scarlet', 'PingFang SC', 'Microsoft YaHei UI', sans-serif
      -webkit-text-size-adjust: 100%

    *:not(input, button, textarea, a, a *, *[onclick])
      // -webkit-user-select: none
      // -moz-user-select: none
      // -ms-user-select: none
      // user-select: none
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
      background var(--theme-color)
      -webkit-transition .2s
      -moz-transition .2s
      -ms-transition .2s
      -o-transition .2s
      transition .2s

    button:active
      background var(--theme-color-dark)

    input, textarea
      color #555
      background #fafafa
      box-sizing border-box

    input, textarea, input:focus, textarea:focus
      -webkit-appearance none
      -moz-appearance none
      appearance none
      border none
      outline none
      resize none

    input:-webkit-autofill,
    textarea:-webkit-autofill,
    select:-webkit-autofill
      -webkit-box-shadow inset 0 0 0 100px #fafafa

    img:not([src]), img[src=""]
      opacity 0

  #app
    padding 0

    .header
      position fixed
      top 0
      left 0
      right 0
      z-index 999
      height 60px
      max-width 1200px

      margin 0 auto
      padding 0 10px

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

      .live2d-wrapper
        display flex
        flex-direction row
        align-items center
        padding 0 10px

        .live2d-container
          width 56px
          height 56px
          position relative
          filter hue-rotate(-15deg)

        img.logo
          width 115px
          height 40px
          object-fit cover
          object-position 100% 50%
          pointer-events none

      @media screen and (max-width: 600px)
        img.logo
          display none

        @supports (-webkit-backdrop-filter: blur(20px))
          background rgba(255, 255, 255, .8)
          -webkit-backdrop-filter: blur(20px)
          border-bottom 1px solid rgba(0, 0, 0, .05)

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
