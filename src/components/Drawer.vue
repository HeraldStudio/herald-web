<template lang="pug">

  .drawer-wrapper
    .click-area(@click.stop='open()')
      slot
    transition(name="fade-slide-up")
      .mask(v-if='drawer' @click.stop='close()')
        .drawer(@click.stop='')
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
    methods: {
      open () {
        this.drawer = true
        Vue.$drawer.count++
        this.$emit('open')
        if (Vue.$drawer.count === 1) {
          document.getElementsByTagName('html')[0].className += ' drawer-shown'
        }
      },
      close () {
        this.drawer = false
        Vue.$drawer.count--
        this.$emit('close')
        if (Vue.$drawer.count === 0) {
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

  .fade-slide-up-enter-active, .fade-slide-up-leave-active
    transition .3s

    .drawer
      transition .3s

  .fade-slide-up-enter, .fade-slide-up-leave-to
    opacity 0
    -webkit-backdrop-filter none

    .drawer
      transform translateY(100%)

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
      z-index: 10001
      cursor: default
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
      background: rgba(#000, .1)
      -webkit-backdrop-filter blur(20px)
      padding-top 60px

      @media screen and (max-width: 600px)
        width 100%
        z-index: 9998
        justify-content: flex-end
        padding-top 160px

      .drawer
        overflow: hidden
        background: #fff
        z-index: 10002
        box-sizing: border-box
        width: 600px
        cursor: default
        display: flex
        flex-direction: column
        padding 20px 0 10px
        overflow-y: scroll
        box-shadow 0 3px 12px rgba(0, 0, 0, .05)

        @media screen and (max-width: 600px)
          width 100%
          box-shadow: 0 -1px 0 rgba(0, 0, 0, .05)

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
            color: #333

        .drawer-view
          flex 0 0 auto
          padding 15px 25px

</style>
