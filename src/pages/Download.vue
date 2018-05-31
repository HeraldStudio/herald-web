<template lang='pug'>
  .page
    .hint 小猴偷米 App 是较早版本，已不再保持活跃更新，新 App 开发正在筹备中，建议使用网页版和小程序，获得更完整的体验。
    img.qr(src='static/images/qrcode.jpg')
    .buttons
      p 下载旧版 App：
      a(href='http://static.myseu.cn/herald-v1-final.apk' target='_blank')
        button Android 4.1+
      a(href='https://itunes.apple.com/cn/app/id1378941139' target='_blank')
        button iOS 8.0+
</template>
<script>
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
      justify-content center
      margin-top 25px
      align-items: center;

      * + *
        margin-left 10px

    img.qr
      width 100%
      height auto
      filter hue-rotate(-15deg)
      max-width 500px
      margin 0 auto
</style>
