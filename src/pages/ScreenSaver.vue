<template lang="pug">

  #live2d-page
    .live2d-container
      live2d(:follow-cursor='false', :auto-emotion='true')
   
</template>
<script>

  import live2d from '../components/Live2D.vue'

  export default {
    components: {
      live2d
    }
  }
  
</script>
<style lang="stylus" scoped>

  #live2d-page
    position fixed
    left 0
    top 0
    right 0
    bottom 0
    z-index 9999
    background #000
    display flex
    flex-direction column
    align-items center
    justify-content center

    .live2d-container
      width 200px
      height 200px
      position relative
      -webkit-filter brightness(0.6)

</style>