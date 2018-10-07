<template lang="pug">

  .live2d(:class='forceState || curState', @click='animateRandom()')
    img.bg(:src='live2dImg')
    .eyes(:style='"transform: translate(" + mouseX * 2 + "%, " + mouseY * 2 + "%)"')
      .eye.left-eye
        .line1
        .line2
      .eye.right-eye
        .line1
        .line2
    .loading(:class='{ shown: loading }')
      .inner

</template>
<script>

  import api from '../api'
  import live2dImg from 'static/images/live2d.png'

  const timeout = (t) => new Promise(r => setTimeout(r, t))

  function getOffsetTop(obj){
    let tmp = obj.offsetTop - obj.scrollTop;
    let val = obj.offsetParent;
    while (val){
      tmp += val.offsetTop - val.scrollTop;
      val = val.offsetParent;
    }
    return tmp;
  }
  function getOffsetLeft(obj){
    let tmp = obj.offsetLeft - obj.scrollLeft;
    let val = obj.offsetParent;
    while (val){
      tmp += val.offsetLeft - val.scrollLeft;
      val = val.offsetParent;
    }
    return tmp;
  }

  export default {
    props: {
      followCursor: {
        type: Boolean,
        default: true
      },
      autoEmotion: {
        type: Boolean,
        default: false
      },
      loading: {
        type: Boolean,
        default: false
      },
      forceState: String
    },
    data() {
      return {
        animating: false,
        curState: 'curious',
        lastRandom: '',
        mouseX: 0,
        mouseY: 0,
        live2dImg
      }
    },
    created() {
      this.autoBlink()
      if (this.autoEmotion) {
        this.autoEmote()
      }
      if (this.followCursor) {
        ['touchstart', 'touchmove', 'touchend', 'mousemove'].map(k => document.addEventListener(k, (ev) => {
          let el = this.$el
          let x = (ev.clientX || ev.touches && ev.touches[0] && ev.touches[0].clientX) - (getOffsetLeft(el) + el.clientWidth / 2)
          let y = (ev.clientY || ev.touches && ev.touches[0] && ev.touches[0].clientY) - (getOffsetTop(el) + el.clientHeight / 2)
          let l = Math.max(Math.sqrt(x * x + y * y), 40)
          this.mouseX = x / l
          this.mouseY = y / l
        }))
      }
    },
    methods: {
      async animate(name, time = 1500) {
        if (!this.animating) {
          this.animating = true
          this.curState = name
          await timeout(time)
          this.curState = 'curious'
          this.animating = false
        }
      },
      async animateRandom() {
        let animations = ['wink', 'logo', 'sleep'].filter(k => k !== this.lastRandom)
        let random = animations[Math.floor(Math.random() * animations.length)]
        this.lastRandom = random
        await this.animate(random)
      },
      async autoBlink() {
        while (true) {
          await this.animate('blink', 100)
          await timeout(100)
          await this.animate('blink', 100)
          await timeout(Math.random() * 3000 + 5000)
        }
      },
      async autoEmote() {
        while (true) {
          await this.animateRandom()
          await timeout(Math.random() * 3000 + 10000)
        }
      }
    }
  }

</script>
<style lang="stylus" scoped>

  @keyframes rotate
    from
      transform rotate(0deg)
    to
      transform rotate(360deg)

  .live2d
    margin 0
    padding 0
    position absolute

    // 完美适配 Chrome 浏览器
    // 画布尺寸扩大 5 倍，渲染后再缩放到 1/5，防止 Chrome 等浏览器对小元素（眼睛）等四舍五入导致变形
    left -200%
    top -200%
    right -200%
    bottom -200%
    transform scale(0.2)

    // 用 padding-top 撑起使宽高相等
    &::before
      display block
      content ''
      padding-top 100%

    .bg
      position absolute
      left 0
      right 0
      top 0
      bottom 0
      width 100%
      height 100%

    .eyes
      position absolute
      left 0
      right 0
      top 0
      bottom 0

    .eye
      position absolute
      top 37%
      width 20%
      height 20%

      &.left-eye
        left 24%

      &.right-eye
        right 24%
        -webkit-transform: scale(-1, 1)
        -moz-transform: scale(-1, 1)
        -ms-transform: scale(-1, 1)
        -o-transform: scale(-1, 1)
        transform: scale(-1, 1)

      .line1, .line2
        position absolute
        background #6b6b6b
        left 36%
        top 36%
        width 25%
        height 25%
        min-width 1.5px
        min-height 1.5px
        border-radius 10000px
        -webkit-transition: .2s
        -moz-transition: .2s
        -ms-transition: .2s
        -o-transition: .2s
        transition: .2s

      .line2
        opacity 0

    &.wink
      .eyes
        transform none !important

      .line1
        left 25%
        top 35%
        width 54%
        height 10%
        transform-origin 100% 50%
        transform rotate(30deg)

      .line2
        left 25%
        top 35%
        width 54%
        height 10%
        transform-origin 100% 50%
        transform rotate(-30deg)
        opacity 1

    &.curious
      .line1
        top 20%
        left 42%
        width 14%
        height 56%

    &.sleep
      .eyes
        transform none !important

      .line1
        left 24%
        width 56%
        height 14%

    &.shiny
      .line1
        top 9%
        left 48%
        width 14%
        height 64%

      .line2
        left 24%
        width 64%
        height 14%
        opacity 1

    &.blink
      .eyes
        transform none !important

      .line1
        top 45%
        left 42%
        width 14%
        height 0
        -webkit-transition: .1s
        -moz-transition: .1s
        -ms-transition: .1s
        -o-transition: .1s
        transition: .1s

    &.bad
      .eyes
        transform none !important

      .line1
        top 9%
        left 48%
        width 14%
        height 64%
        transform rotate(45deg)

      .line2
        left 24%
        width 64%
        height 14%
        opacity 1
        transform rotate(45deg)

    &.logo
      .eyes
        transform none !important

      .left-eye
        .line1
          left 25%
          top 40%
          width 56%
          height 10%
          transform-origin 100% 50%
          transform rotate(30deg)

        .line2
          left 25%
          top 35%
          width 56%
          height 10%
          transform-origin 100% 50%
          transform rotate(-30deg)
          opacity 1

      .right-eye
        .line1
          width 20%
          height 20%
      
    .loading
      position absolute
      left 20%
      top 23%
      right 20%
      bottom 20%
      background #fff
      border-radius 50%
      transition .2s

      &:not(.shown)
        opacity 0

      .inner
        position absolute
        left 20%
        top 45%
        right 20%
        bottom 45%
        background #31a6f2
        // border-radius 50%
        animation-name rotate
        animation-duration 1s
        animation-iteration-count infinite
        animation-timing-function linear

</style>
