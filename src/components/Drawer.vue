<template lang="pug">

  .drawer-wrapper
    .click-area(@click.stop='open()')
      slot
    transition(name="fade-slide-up")
      .mask(v-if='drawer' @click.stop='close()')
        .close-hint 轻触返回
        .drawer(@click.stop='')
          .title-bar
            .title {{ title }}
          .drawer-view
            slot(name='content')

</template>
<script>

  import Vue from 'vue'
  Vue.$drawer = { count: 0 }

  var currentOpen = null

  export default {
    props: ['title'],
    data() {
      return {
        drawer: false
      }
    },
    methods: {
      open () {
        // pad 环境下左右分栏，一个 drawer 已打开的时候，可能触发打开另一个 drawer，
        // 这样将导致 drawer 之间的叠放层次不确定，因此需要记录并关闭已打开的 drawer
        if (currentOpen) {
          currentOpen.close()
        }
        this.drawer = true
        currentOpen = this
        Vue.$drawer.count++
        this.$emit('open')
        if (Vue.$drawer.count === 1) {
          document.getElementsByTagName('html')[0].className += ' drawer-shown'
        }
      },
      close () {
        this.drawer = false
        currentOpen = null
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

  // PC 和 Phone 环境下，mask 覆盖了整个页面，不能允许滚动，否则体验不好
  // 但 Pad 环境下，mask 为右侧栏，仍需要允许滚动
  html.drawer-shown, html.drawer-shown body
    overflow: hidden

    @media screen and (max-width: 1200px) and (min-width: 601px)
      overflow visible

  .fade-slide-up-enter-active, .fade-slide-up-leave-active
    transition .3s

    .drawer
      transition .3s

  .fade-slide-up-enter, .fade-slide-up-leave-to
    opacity 0
    -webkit-backdrop-filter none

    .drawer
      transform translateY(100%)

      // Pad 环境下改为从右侧推入
      @media screen and (max-width: 1200px) and (min-width: 601px)
        transform translateX(100%)

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

      @media screen and (max-width: 1200px) and (min-width: 601px)
        top 60px
        left var(--left-column-width, 0)
        background var(--color-divider)
        -webkit-backdrop-filter none
        padding-top 0
        padding-left 10px

      @media screen and (max-width: 600px)
        width 100%
        justify-content: flex-end
        padding-left 0

      .close-hint
        position fixed
        left 0
        top 0
        right 0
        z-index 10002
        text-align center
        padding 20px 0
        color rgba(0, 0, 0, .2)
        font-size 14px

      .drawer
        background: #fff
        z-index: 10002
        box-sizing: border-box
        width: 600px
        max-width 100%
        cursor: default
        display: flex
        flex-direction: column
        padding 20px 0 10px
        overflow-y: scroll
        box-shadow 0 3px 12px rgba(0, 0, 0, .05)
        position relative

        @media screen and (max-width: 1200px) and (min-width: 601px)
          box-shadow none
          width 100%
          height 100%

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
            color: #333

        .drawer-view
          flex 0 0 auto
          padding 15px 25px

</style>
