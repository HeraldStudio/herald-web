<template lang='pug'>
  .page
    .hint 小猴偷米新 App 正在全力开发中，现提供安卓 beta 版本进行线上公测
    img.qr(:src='qrcodeImg')
    .buttons
      p 下载 App：
      a(href='http://static.myseu.cn/herald-v1-final.apk' target='_blank')
        button 老版本 Android 4.1+ 
      a(href='https://hybrid.myseu.cn/herald-app-beta-1.apk' target='_blank')
        button 新版本 Android 5.0+
      a(href='https://itunes.apple.com/cn/app/id1378941139' target='_blank')
        button iOS 8.0+
        
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
