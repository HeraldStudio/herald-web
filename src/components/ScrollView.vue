<template lang="pug">

  .scroll-view(ref='scrollView')
    .scroll-content(ref='scrollContent')
      slot

</template>
<script>

  // import AlloyTouch from 'alloytouch'

  export default {
    mounted() {
      // new AlloyTouch({
      //   touch: this.$refs.scrollView,
      //   vertical: true,
      //   target: this.$refs.scrollContent,
      //   property: 'translateY', // 被运动的属性
      //   initialValue: 0,
      //   max: 0,
      //   min: this.$refs.scrollView.clientHeight - this.$refs.scrollContent.clientHeight
      // })
    }
  }

</script>
<style lang="stylus" scoped>

  .scroll-view
    position relative
    overflow-y scroll
    -webkit-overflow-scrolling touch
    width 100%
    height 100%

    .scroll-content
      width 100%
      min-height 100%
      overflow hidden

</style>
