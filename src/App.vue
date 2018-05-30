<template lang='pug'>
  #app(:class='env' v-loading='isLoading')
    .app-container
      //- base-page 为手机版底部界面，桌面版左侧栏
      .base-page
        .base-header
          router-link.live2d-wrapper(to='/')
            .live2d-container
              live2d
            img.logo(src='static/images/logo.png')
          .spacing
          router-link(to='/download')
            img.download(src='static/images/download.png')
        seuLogin(:isLoading='isLoading')
        tabs(:user='user')

      //- overlay-page 为手机版上层栈，桌面版右侧栏
      .overlay-page(:class='{ home: isHome }' ref='page')
        .overlay-header
          transition(name='slide')
            .title-bar(v-if='!isHome')
              .back(@click='$router.go(-1)') ‹ 
              .current {{ title }}
        scrollView.overlay-router(:style='"--mouse-x: " + mouseX + "px; --mouse-y: " + mouseY + "px"')
          transition(name='page')
            router-view(:user='user')
</template>

<script>
  import Vue from 'vue'
  import router from '@/router/index'
  import { Loading } from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css'
  Vue.use(Loading)

  import H from './api'
  import logger from './logger'
  import tabs from './base/Tabs.vue'
  import live2d from './components/Live2D.vue'
  import seuLogin from './components/SeuLogin.vue'
  import scrollView from './components/ScrollView.vue'

  function getOffsetTop(obj){
    let tmp = obj.offsetTop - obj.scrollTop;
    let val = obj.offsetParent;
    while (val){
      tmp += val.offsetTop - val.scrollTop;
      val = val.offsetParent;
    }
    return tmp;
  }
  function getOffsetLeft(obj){
    let tmp = obj.offsetLeft - obj.scrollLeft;
    let val = obj.offsetParent;
    while (val){
      tmp += val.offsetLeft - val.scrollLeft;
      val = val.offsetParent;
    }
    return tmp;
  }

  export default {
    name: 'app',
    components: { 
      live2d, tabs, seuLogin, scrollView
    },
    data() {
      return {
        user: null,
        env: window.__herald_env,
        isLoading: false,
        title: '',
        isHome: true,
        mouseX: 0,
        mouseY: 0
      }
    },
    persist: {
      user: 'herald-default-user'
    },
    async created() {
      this.title = this.$route.name
      this.isHome = this.$route.path === '/'

      logger.openListeners.push(() => this.isLoading = true)
      logger.doneListeners.push(() => this.isLoading = false)

      // 套壳用，通过 URL 参数导入 token
      if (/importToken=([0-9a-fA-F]+)/.test(location.search)) {
        H.token = RegExp.$1
        if (location.search) {
          location.search = ''
        }
      } else {
        setInterval(async () => {
          if (!this.user && H.isLogin) {
            let user = await H.api.user()
            user.admin = await H.api.admin.admin()
            if (user.admin && user.admin.super) {
              location.href = '#/admin'
            }
            this.user = user
          } else if (this.user && !H.isLogin) {
            this.user = null
            location.href = '#/'
          }
        }, 500)
      }
    },
    mounted() {
      let el = this.$refs.page;
      ['touchstart', 'mouseup'].map(k => document.addEventListener(k, ev => {
        this.mouseX = (ev.clientX || ev.touches[0].clientX) - getOffsetLeft(el)
        this.mouseY = (ev.clientY || ev.touches[0].clientY) - getOffsetTop(el)
      }))
    },
    watch: {
      '$route' (to, from) {
        this.title = to.name
        this.isHome = to.path === '/'
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
    --color-error          #c23720
    --color-error-light    #fa8070
    --color-error-bg       #ffe2de

    -webkit-tap-highlight-color transparent

    font-size 13px
    color var(--color-text-regular)

  ::selection
    background var(--color-primary-bg)

  *
    font-family -apple-system, BlinkMacSystemFont, 'Noble Scarlet', 'PingFang SC', 'Noto Sans CJK SC', 'Source Han Sans CN', 'Microsoft YaHei UI', sans-serif
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    text-size-adjust: 100%;

  ::-webkit-scrollbar
    display: none

  html, body
    margin 0
    padding 0
    background #fff
    overflow hidden

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
    // -webkit-appearance none
    // -moz-appearance none
    // appearance none
    border none
    outline none
    resize none

  input:-webkit-autofill,
  textarea:-webkit-autofill,
  select:-webkit-autofill
    -webkit-box-shadow inset 0 0 0 100px var(--color-tool-bg)

  hr
    border 0 none
    height 1px
    background var(--color-divider)
    margin 25px 0

  img:not([src]), img[src=""]
    opacity 0

  ::-webkit-scrollbar
    display none !important

  .stale
    position relative

  .stale::after
    content ''
    display block
    position absolute
    right 3px
    top 3px
    min-width 6px
    max-width 6px
    min-height 6px
    max-height 6px
    border-radius 3px
    box-sizing border-box
    background var(--color-warning-light)
    padding 0
    color var(--color-warning-dark)
    font-size 10px
    transition .5s
    transition-property max-width, max-height
    overflow hidden

  .stale:hover::after
    border-left-width 0
    border-top-width 0
    padding 0 3px
    background var(--color-warning-light)
    content '缓存'
    max-width 100px 
    max-height 30px

  .el-loading-mask
    position fixed !important
    top 0 !important
    right 10px !important
    left auto !important
    bottom auto !important
    width 59px !important
    height 59px !important
    z-index 9999999 !important
    background #fff !important
    border-radius 3px

    .el-loading-spinner .path
      stroke var(--color-primary) !important

  .toasted-container.top-center
    // 覆盖vendor原有属性，由于webpack资源重排，不加important覆盖不上
    -webkit-transform none !important
    transform none !important
    // 浮于抽屉上层
    z-index 99999 !important
    top 60px !important
    left 0 !important
    right 0
    margin-left auto
    padding 10px

    .toasted
      margin 0 auto 10px
      cursor default
      border-radius 3px
      pointer-events all

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
    -webkit-user-select: none
    -moz-user-select: none
    -ms-user-select: none
    user-select: none

    .app-container
      position fixed
      top 0
      left 0
      right 0
      bottom 0
      display flex
      flex-direction row
      overflow hidden

      @media screen and (max-width: 600px)
        display block

      .base-header, .overlay-header
        width 100%
        height 60px
        flex 0 0 60px
        box-sizing border-box
        padding 0 10px
        display flex
        flex-direction row
        align-items center
        justify-content flex-start
        background #fff
        box-shadow 0 1px 0 rgba(0, 0, 0, .07)
        z-index 999

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

        .spacing
          flex 1 1 0
            
        img.download
          margin-right 10px
          width 24px
          height 24px

      .base-page
        width 40%
        min-width 320px
        max-width 400px
        overflow hidden
        display flex
        flex-direction column

        @media screen and (max-width: 600px)
          position absolute
          min-width none
          max-width none
          width 100%
          height 100%

      .overlay-page
        flex 1 1 0
        overflow hidden
        border-left 10px solid var(--color-divider)
        background var(--color-divider)
        display flex
        flex-direction column
        transition .3s
        z-index 100000

        @media screen and (max-width: 600px)
          position absolute
          background #fff
          min-width none
          max-width none
          width 100%
          height 100%

          .overlay-header
            transition .3s

          .overlay-router
            transition .3s

          &.home
            transition .3s
            background transparent
            pointer-events none

            .overlay-header
              opacity 0

            .overlay-router
              background transparent

        .overlay-header .title-bar
          height 60px
          display flex
          flex-direction row
          align-items center
          flex 1 1 0

          .back
            display block
            font-size 22px
            vertical-align middle
            text-align center
            width 60px
            line-height 58px
            cursor pointer
            
            &:hover
              color var(--color-text-bold)

          .current
            flex 1 1 0
            font-size 15px
            font-weight bold
            color var(--color-text-bold)
            text-align center
            padding-right 60px
            line-height 60px

        .overlay-router
          flex 1 1 0
          position relative
          background #fff

          .scroll-content > *
            position relative
            top 0
            width 100%
            min-height 100%
            box-sizing border-box

          .page-enter-active, .page-leave-active
            transition .3s !important
            position absolute !important
            overflow hidden !important
            width 100% !important
            min-height 100% !important
            z-index 9999 !important
            transform translateZ(0px)

          .page-leave-active
            transition .3s !important
            filter brightness(0.9) !important
            opacity 0 !important

          .page-enter
            min-height 0
            transform scale(0.2) translateZ(0px) !important
            transform-origin var(--mouse-x, 50%) var(--mouse-y, 400px) !important
            box-shadow 0 0 25px rgba(0, 0, 0, .1) !important
            border-radius 20px !important
            overflow hidden !important

        @media screen and (max-width: 600px)
          position absolute
          border-left 0
          width 100%
          height 100%

    // 强制加固定白底，尤其在微信和小程序中用于屏蔽黑底和微信的提示文字
    &::before
      content ''
      position fixed
      left 0
      top 0
      right 0
      bottom 0
      z-index -999
      background var(--color-divider)

    &.wx
      .base-header
        display none

  .widget
    border-bottom 1px solid var(--color-divider)

    @media screen and (max-width: 600px)
      border-bottom-width 10px

  .widget, .page, .admin-page
    position relative
    box-sizing border-box
    -webkit-transition: .3s
    -moz-transition: .3s
    -ms-transition: .3s
    -o-transition: .3s
    transition: .3s
    display flex
    flex-direction column
    background #fff
    padding 20px 25px

    .empty
      display block
      text-align center
      color #888
      font-size 14px

    ul.info-bar
      width 100%
      box-sizing border-box
      margin 0
      padding 5px 0 0 5px
      display flex
      flex-direction row
      justify-content center
      flex-wrap wrap

      li.info
        list-style none
        flex 0 1 auto
        padding 0 10px
        margin 0 5px 5px 0
        display flex
        flex-direction row
        justify-content center
        font-size 14px
        padding 3px 7px
        color var(--color-primary-dark)
        background var(--color-primary-bg)
        border-radius 3px

        .title
          font-weight bold

          + .content
            margin-left 5px

      +ul.detail-list>*:first-child
        margin-top 15px
        border-top 1px solid var(--color-divider)
        padding-top 10px

    ul.detail-list
      width 100%
      margin 0
      padding 0
      box-sizing border-box
      display flex
      flex-direction column
      white-space normal

      > li + li
        border-top 1px solid var(--color-divider)

      > li
        list-style none
        flex 1 1 auto
        padding 10px 0
        display flex
        flex-direction column
        text-align justify
        word-break break-all
        color var(--color-text-bold)

        &.section
          border-top 1px solid var(--color-divider)
          margin-top 10px
          padding-top 10px !important
          font-weight bold

        .top, .bottom
          display flex
          flex-direction row
          // align-items center

        .top + .bottom
          margin-top 2px

        .left
          flex 1 1 auto

        .right
          flex 0 0 auto
          margin-left 20px

        .top .left
          font-size 15px
          color var(--color-primary)

        .top .right, .bottom .left
          font-size 13px

        .top .right
          font-weight bold
          color var(--color-text-bold)

        .bottom .right
          font-size 13px
          color #888

        &:last-child
          padding-bottom 0

        &:first-child
          padding-top 0

  .admin-page

    .title
      font-size 22px
      margin-bottom 20px

    .subcontainer
      text-align center
      overflow-x scroll

      + .subcontainer
        border-top 1px solid var(--color-divider)
        padding-top 20px
        margin-top 20px

    .subtitle
      padding 0 7px
      text-align center
      font-size 16px
      font-weight bold
      color var(--color-text-bold)
      margin-bottom 20px

    .summary
      display inline-block
      font-size 13px
      color var(--color-text-secondary)
      margin 0 5px 20px

    table
      max-width 100%

      th, td
        white-space nowrap

        .vdatetime
          white-space normal
    
    input
      min-width 100px
      
      &.vdatetime-input
        min-width 115px

</style>
