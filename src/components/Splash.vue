<template lang="pug">

  transition(name='slide')
    #splash(v-if='shown')

</template>
<script>

  export default {
    data: () => ({
      shown: true
    }),
    created () {
      setTimeout(() => {
        this.shown = false
      }, 2000)
    }
  }

</script>
<style lang="stylus" scoped>

  #splash
    position fixed
    left 0
    top 0
    right 0
    bottom 0
    background #fff
    z-index 99999
    display none
    background-size cover
    background-position 50% 100%

    @media screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)
      background-image url(../../static/images/splash-1536-2008.png)
      display block

    @media screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)
      background-image url(../../static/images/splash-1242-2208.png)
      display block

    @media screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)
      background-image url(../../static/images/splash-750-1334.png)
      display block

    @media screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)
      background-image url(../../static/images/splash-640-1136.png)
      display block

</style>
