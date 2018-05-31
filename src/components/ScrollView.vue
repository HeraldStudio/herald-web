<template lang="pug">

  .scroll-view(ref='scrollView')
    .scroll-content
      slot

</template>
<script>

  import Scroll from 'better-scroll'

  export default {
    mounted() {
      new Scroll(this.$refs.scrollView, {
        click: true,
        bounceTime: 300,
        momentumLimitTime: 200,
        momentumLimitDistance: 20,
        swipeTime: 1000,
        deceleration: 0.003,
        swipeBounceTime: 100,
        mouseWheel: true,
        eventPassthrough: 'horizontal'
      })
    }
  }

</script>
<style lang="stylus" scoped>

  .scroll-view
    position relative
    overflow hidden

    .scroll-content
      position relative
      width 100%
      min-height 100%
      overflow hidden

</style>
