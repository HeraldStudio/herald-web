<template lang="pug">

  .page
    .hint 由于财务处充值接口变更，请同学们移步“东大财务”公众号完成充值～
    img.qr(:src='qrcode')
    .buttons
      p 具体操作指引详见：
      button(@click='window.open("http://mp.weixin.qq.com/s?__biz=MzU4OTExMTM2Nw==&mid=2247485406&idx=1&sn=88bf48e827bcb79a13172cfdbab0e405&chksm=fdd3cef6caa447e097b90e4b81856ecd4b578f628acc3036ee1684356daab1c1c3ebfea1c4b1&mpshare=1&scene=23&srcid=0501SvdlFXd6DwqYiHahP5GX#rd")') 校园卡微信充值指导 
    
</template>
<script>

  import qrcode from 'static/images/seucwc_qrcode.png'

  export default {
    data() {
      return {
        qrcode
      }
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
