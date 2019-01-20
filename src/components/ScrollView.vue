<template lang="pug">

  .scroll-view(ref='scrollView')
    .scroll-content(ref='scrollContent')
      slot

</template>
<script>
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
