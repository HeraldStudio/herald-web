<template lang='pug'>
  #app(:class='{ webapp: webapp }')
    .header
      router-link.live2d-wrapper(to='/')
        .live2d-container
          live2d
        img.logo(src='static/images/logo.png')
      ul.nav
        router-link(to='/admin' v-if='isAdmin')
          li 管理中心
        a
          li(@click='logout()' v-if='isLogin') 退出
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
    --color-text-regular   #333333
    --color-text-bold      #555555
    --color-text-secondary #888888
    --color-divider        #f0f0f0
    --color-tool-bg        #fafafa

    --color-primary-dark   #237a86
    --color-primary        #00abc3
    --color-primary-light  #70eafa
    --color-primary-bg     #ddfbff

    --color-success-dark   #648723
    --color-success        #7ec200
    --color-success-light  #cafa70
    --color-success-bg     #f3ffde

    --color-warning-dark   #876b23
    --color-warning        #c28b00
    --color-warning-light  #fad370
    --color-warning-bg     #fff6de

    --color-error-dark     #872f23
    --color-error          #c21700
    --color-error-light    #fa8070
    --color-error-bg       #ffe2de

    -webkit-tap-highlight-color transparent

  ::selection
    background var(--color-primary-bg)

  *
    font-family 'Avenir Next', 'Noble Scarlet', 'PingFang SC', 'Microsoft YaHei UI', sans-serif
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    text-size-adjust: 100%;

  ::-webkit-scrollbar
    display: none

  html, body
    margin 0
    padding 0
    background #fff

  p, input, textarea
    margin-top 0
    margin-bottom 0
    line-height 1.75em
    vertical-align middle

  a, a:link, a:hover, a:active, a:focus, a:visited
    color inherit
    text-decoration none
    -webkit-appearance none
    -moz-appearance none
    appearance none

  button, input
    outline none
    border none
    border-radius 3px
    padding 3px 7px
    margin 0
    font-size 14px

  button
    font-weight bold
    background var(--color-primary-bg)
    color var(--color-primary-dark)
    cursor pointer

  button.primary
    background var(--color-primary)
    color #fff

  .bubble
    padding 0 7px
    text-align left
    border-radius 3px
    font-weight bold
    background var(--color-text-bold)
    color #fff
    margin-bottom 20px
    display flex
    flex-direction row
    align-items center

  input, textarea
    color var(--color-text-bold)
    background var(--color-tool-bg)
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
    -webkit-box-shadow inset 0 0 0 100px var(--color-tool-bg)

  img:not([src]), img[src=""]
    opacity 0

  .toasted-container.top-center
    top 60px
    left 0
    right 0
    margin-left auto
    padding 10px
    -webkit-transform none
    transform none

    .toasted
      margin 0 auto
      cursor default
      border-radius 3px

      &.primary
        font-weight normal
        min-height 0
        line-height 1.5em
        padding 5px 10px
        font-size 14px
        font-weight normal
        text-align justify
        background var(--color-primary)
        box-shadow none

      .action
        color #fff
        white-space nowrap
        text-decoration none
        padding 0
        margin 0
        font-weight bold
        font-size inherit

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
      border-bottom 1px solid var(--color-divider)

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

        // @media screen and (max-width: 600px)
        //   img.logo
        //     display none

        @supports (-webkit-backdrop-filter: blur(20px))
          background rgba(255, 255, 255, .8)
          -webkit-backdrop-filter: blur(20px)

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
          color var(--color-text-bold)
          padding 0 10px
          cursor pointer
          white-space nowrap

          &.lang
            background var(--color-primary)
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

      @media screen and (max-width: 600px)
        padding 60px 0 0

    // iOS Webapp 顶栏样式
    &.webapp
      .header
        @media screen and (max-width: 600px)
          @supports (-webkit-backdrop-filter: blur(20px))
            box-shadow inset 0 30px 40px #fff

</style>
