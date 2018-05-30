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
        bounceTime: 600,
        momentumLimitTime: 200,
        momentumLimitDistance: 20,
        swipeTime: 1000,
        deceleration: 0.003,
        swipeBounceTime: 300,
        mouseWheel: true
      })
    }
  }

</script>
<style lang="stylus" scoped>
  .scroll-content
    min-height 100%
</style>
