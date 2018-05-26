<template lang='pug'>
  #app(:class='{ webapp: webapp }')
    .root
      .header
        router-link.live2d-wrapper(to='/')
          .live2d-container
            live2d(:showAjax='true')
          img.logo(src='static/images/logo.png')
        ul.nav
          drawer(title='小猴偷米微信端 / App')
            img.download(v-if='!mina' src='static/images/download.png')
            .content(slot='content')
              .hint 小猴偷米 App 是较早版本，已不再保持活跃更新，新 App 开发正在筹备中，建议使用网页版和小程序，获得更完整的体验。
              .buttons
                p 仍要下载：
                a(href='http://static.myseu.cn/herald-v1-final.apk' target='_blank')
                  button Android 4.1+
                a(href='https://itunes.apple.com/cn/app/id1378941139' target='_blank')
                  button iOS 8.0+
              hr
              img.qr(src='static/images/qrcode.jpg')
      .container
        router-view(:user='user')
</template>

<script>
  import logger from './logger'
  import H from './api'
  import drawer from '@/components/Drawer.vue'
  import offline from 'offline-plugin/runtime'
  import live2d from './components/Live2D.vue'
  import status from './components/Status.vue'

  export default {
    name: 'app',
    components: {
      live2d, drawer, status
    },
    data() {
      return {
        user: null,
        webapp: false,
        mina: false
      }
    },
    persist: ['user'],
    async created() {
      if (window.navigator.standalone) {
        this.webapp = true
      }

      if (window.__wxjs_environment === 'miniprogram') {
        this.mina = true
      }

      // 套壳用，通过 URL 参数导入 token
      if (/importToken=([0-9a-fA-F]+)/.test(location.search)) {
        H.token = RegExp.$1
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
      if (location.search) {
        location.search = ''
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

    --left-column-width 40%

    @media screen and (max-width: 800px)
      --left-column-width 320px

    @media screen and (min-width: 1000px)
      --left-column-width 400px

    font-size 13px
    color var(--color-text-regular)

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
    overflow-x hidden

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

  .toasted-container.top-center
    // 覆盖vendor原有属性，由于webpack资源重排，不加important覆盖不上
    -webkit-transform none !important
    transform none !important
    // 浮于抽屉上层
    z-index 10005 !important
    top 60px !important
    left 0 !important
    right 0
    margin-left auto
    padding 10px
    pointer-events none

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

    .header
      position fixed
      top 0
      left 0
      right 0
      z-index 10000
      height 60px
      box-sizing border-box

      margin 0 auto
      padding 0 10px

      display flex
      flex-direction row
      justify-content flex-start

      background #fff
      border-bottom 1px solid rgba(0, 0, 0, .07)

      -webkit-user-select: none
      -moz-user-select: none
      -ms-user-select: none
      user-select: none

      @supports (-webkit-backdrop-filter: blur(20px))
        background: rgba(255, 255, 255, .8)
        -webkit-backdrop-filter: blur(20px)
        box-shadow inset 0 30px 40px #fff

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

      ul.nav
        height 100%
        padding 0
        margin 0 10px
        flex 1 1 0
        display flex
        flex-direction row
        align-items center
        justify-content flex-end

        .qr
          width 100%
          height auto

        .hint
          display block
          font-size 14px
          margin-bottom 15px

          &::before
            content '!'
            display inline-block
            width 20px
            height 20px
            margin-right 5px
            border-radius 50%
            background var(--color-warning-light)
            color var(--color-warning-dark)
            text-align center

        .buttons
          display flex
          justify-content center
          margin-top 25px
          align-items: center;

          * + *
            margin-left 10px

        img.download
          width 24px
          height 24px

        img.qr
          filter hue-rotate(-15deg)

    .container
      margin 0 auto
      padding 60px 0 0
      overflow scroll

</style>
