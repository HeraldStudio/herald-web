<template lang='pug'>
  .page
    .hint 小猴偷米新版 App 已经发布上线，请尽快更新
    .hint iOS 用户请前往 App Store 下载 
    img.qr(:src='qrcodeImg')
    .buttons
      p 下载 App：
      a(href='https://hybrid.myseu.cn/herald-new-app-4.apk' target='_blank')
        button 新版本 Android
    
        
</template>
<script>
  import qrcodeImg from 'static/images/qrcode.jpg'

  export default {
    data() {
      return { qrcodeImg }
    }
  }
</script>
<style lang='stylus' scoped>

  .page
    text-align center

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
      flex-wrap wrap
      justify-content center
      margin-top 25px
      align-items center

      button
        margin 5px 0

      * + *
        margin-left 10px

    img.qr
      width 100%
      height auto
      filter hue-rotate(-15deg)
      max-width 500px
      margin 0 auto
</style>
