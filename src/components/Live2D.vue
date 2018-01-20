<template lang="pug">

  #live2d(:class='curState', @click='animateRandom()')
    img.bg(src='static/images/live2d.png')
    .eyes(:style='"transform: translate(" + mouseX * 1.5 + "px, " + mouseY * 1.5 + "px)"')
      .eye.left-eye
        .line1
        .line2
      .eye.right-eye
        .line1
        .line2
   
</template>
<script>

  import api from '../api'

  const timeout = (t) => new Promise(r => setTimeout(r, t))

  function getOffsetTop(obj){
    let tmp = obj.offsetTop;
    let val = obj.offsetParent;
    while(val){
      tmp += val.offsetTop;
      val = val.offsetParent;
    }
    return tmp;
  }
  function getOffsetLeft(obj){
    let tmp = obj.offsetLeft;
    let val = obj.offsetParent;
    while(val){
      tmp += val.offsetLeft;
      val = val.offsetParent;
    }
    return tmp;
  }

  export default {
    data() {
      return {
        animating: false,
        curState: 'curious',
        lastRandom: '',
        mouseX: 0,
        mouseY: 0
      }
    },
    created() {
      this.autoBlink()
      document.onmousemove = (ev) => {
        let el = document.getElementById('live2d')
        let x = ev.clientX - (getOffsetLeft(el) + el.clientWidth / 2)
        let y = ev.clientY - (getOffsetTop(el) + el.clientHeight / 2)
        let l = Math.max(Math.sqrt(x * x + y * y), 40)
        this.mouseX = x / l
        this.mouseY = y / l
      }
    },
    methods: {
      async animate(name, time = 1000) {
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
      }
    }
  }
  
</script>
<style lang="stylus" scoped>

  #live2d
    position absolute
    left 16px
    top 2px
    width 56px
    height 56px

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
        border-radius 10000px
        -webkit-transition: .2s
        -moz-transition: .2s
        -ms-transition: .2s
        -o-transition: .2s
        transition: .2s

      .line2
        opacity 0

    &.wink
      .line1
        left 25%
        top 40%
        width 56%
        height 13%
        transform-origin 100% 50%
        transform rotate(30deg)

      .line2
        left 25%
        top 33%
        width 56%
        height 13%
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
      .line1
        left 24%
        width 56%
        height 14%

    &.shiny
      .line1
        top 9%
        left 48%
        width 13%
        height 64%

      .line2
        left 24%
        width 64%
        height 13%
        opacity 1

    &.blink
      .line1
        top 45%
        left 42%
        width 16%
        height 0
        -webkit-transition: .1s
        -moz-transition: .1s
        -ms-transition: .1s
        -o-transition: .1s
        transition: .1s

    &.bad
      .line1
        top 9%
        left 48%
        width 13%
        height 64%
        transform rotate(45deg)

      .line2
        left 24%
        width 64%
        height 13%
        opacity 1
        transform rotate(45deg)

    &.logo
      .left-eye
        .line1
          left 25%
          top 40%
          width 56%
          height 13%
          transform-origin 100% 50%
          transform rotate(30deg)

        .line2
          left 25%
          top 33%
          width 56%
          height 13%
          transform-origin 100% 50%
          transform rotate(-30deg)
          opacity 1


</style>