<template lang="pug">

  .page
    #live2d-page
      .live2d-container
        live2d(:auto-emotion='true')
      .clock-container(:class='{ shakeup: shakeup }')
        .clock {{ time }}

</template>
<script>

  import live2d from '../components/Live2D.vue'

  export default {
    components: {
      live2d
    },
    data () {
      return {
        time: '',
        shakeup: false
      }
    },
    created () {
      setInterval(() => {
        let now = new Date()
        let hour = now.getHours()
        let min = now.getMinutes()
        if (min < 10) {
          min = '0' + min
        }
        this.time = hour + ':' + min
        this.shakeup = !this.shakeup
      }, 500)
    }
  }

</script>
<style lang="stylus" scoped>

  #live2d-page
    position fixed !important
    left 0 !important
    top 0 !important
    right 0 !important
    bottom 0 !important
    z-index 99999 !important
    background #000
    display flex
    flex-direction row
    align-items center
    justify-content center

    .live2d-container
      width 200px
      height 200px
      position relative

    .clock-container
      border-radius 60px
      border 2px solid #fff
      position relative
      margin-bottom 90px
      transform rotate(-15deg)
      transform-origin 0 50%
      transition .5s

      &.shakeup
        transform rotate(-25deg)

      &::before
        content ''
        position absolute
        left -10px
        top 50%
        margin-top -7px
        border-top 7px solid transparent
        border-bottom 7px solid transparent
        border-right 10px solid #fff

      .clock
        background #fff
        font-size 40px
        font-weight 500
        line-height 1em
        color #5d5d5d
        border-radius 60px
        border 8px solid #21a9f0
        padding 7px 15px

</style>
