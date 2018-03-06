<template lang="pug">

  .drawer-wrapper
    .click-area(@click.stop='drawer = !drawer')
      slot
    .mask(:class='{ shown: drawer }' @click.stop='drawer = !drawer')
      .drawer
        .title-bar
          .title {{ title }}
        .drawer-view
          slot(name='content')

</template>
<script>

  import Vue from 'vue'
  Vue.$drawer = { count: 0 }

  export default {
    props: ['title'],
    data() {
      return {
        drawer: false
      }
    },
    watch: {
      drawer () {
        if (this.drawer) {
          Vue.$drawer.count++
          this.$emit('open')
        } else {
          Vue.$drawer.count--
          this.$emit('close')
        }

        if (Vue.$drawer.count) {
          document.getElementsByTagName('html')[0].className += ' drawer-shown'
        } else {
          document.getElementsByTagName('html')[0].className
            = document.getElementsByTagName('html')[0].className.replace(' drawer-shown', '')
        }
      }
    }
  }

</script>
<style lang="stylus">

  html.drawer-shown, html.drawer-shown body
    overflow: hidden

  .drawer-wrapper
    .click-area
      cursor pointer

    .mask
      position: fixed
      overflow: hidden
      top 0
      left 0
      bottom 0
      right 0
      margin 0
      background: rgba(#000, .5)
      z-index: 99999
      cursor: default
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
      opacity: 0
      pointer-events: none
      transition: .2s

      @media screen and (max-width: 600px)
        width 100%
        justify-content: flex-end
        padding-top 60px

      &.shown
        opacity: 1
        pointer-events: all

      &.shown .drawer
        transform none

      .drawer
        transform translateY(100%)
        overflow: hidden
        background: #fff
        z-index: 100000
        box-sizing: border-box
        width: 600px
        box-shadow: 0 0 20px rgba(0, 0, 0, .1)
        cursor: default
        display: flex
        flex-direction: column
        padding 20px 0 10px
        overflow-y: scroll
        transition: .3s

        @media screen and (max-width: 600px)
          width 100%

        .title-bar
          margin 0 30px
          padding 15px 0
          flex 0 0 auto
          display: flex
          flex-direction: row
          justify-content: center
          align-items: center

          .title
            font-size: 16px
            font-weight: bold

        .drawer-view
          flex 0 0 auto
          padding 15px

</style>
