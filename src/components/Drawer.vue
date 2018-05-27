<template lang="pug">

  .drawer-wrapper
    .click-area(@click='toggle()')
      slot
    transition(name="slide-left")
      //- 这里的空点击事件是防止 drawer 里面的点击事件被冒泡上来导致关闭 drawer
      .drawer(v-if='drawer' @click='' :class='{ underlay: underlay }' :style='"z-index: " + (10000 + index)')
        .title-bar
          .close-btn(@click='close()') ‹
          .title {{ title }}
        .drawer-view
          slot(name='content')

</template>
<script>
  // 魔法代码，小心修改

  let drawerStack = []
  export default {
    props: ['title'],
    data() {
      return {
        drawer: false,
        index: 0,
        underlay: false // 用于修正 Safari 外层抽屉裁剪内层抽屉的问题，见样式表
      }
    },
    methods: {
      async open () {
        // pad 环境下左右分栏，一个 drawer 已打开的时候，可能触发打开另一个 drawer，这样将导致 drawer 之间的叠放层次不确定
        // 但也不应该强行关闭已打开的 drawer，因为如果新的 drawer 在已经打开的 drawer 内部（如一卡通充值），关闭已打开 drawer 会导致新 drawer 不显示
        // 应该维护一个栈，这个栈类似于 Android Activity Stack，新打开的抽屉在顶部
        
        // 若需要打开已有的抽屉（提升），则将其上层的所有抽屉关闭
        if (this.drawer) {
          let count = drawerStack.length

          // 将上层的所有抽屉抽出，并全部关闭
          drawerStack.splice(this.index + 1, count - this.index - 1).map(k => k.close())

          // 等待其他抽屉的关闭动画结束
          await this.waitForAnimation()
        } else {
          // 更新当前抽屉的叠放次序
          this.index = drawerStack.length

          // 将抽屉加入栈，需要更新栈中其他抽屉的状态
          drawerStack.push(this)
          drawerStack.map((k, i) => {
            k.underlay = i < drawerStack.length - 1
          })

          // 更新 html 的总 class 以便控制页面的可滚动性
          this.updateClasses()

          // 启动打开抽屉的动画效果
          this.drawer = true

          // 发出事件
          this.$emit('open')

          // 等待打开的动画效果结束
          await this.waitForAnimation()
        }
      },
      async close () {
        if (!this.drawer) {
          return
        }

        // 启动关闭抽屉的动画效果
        this.drawer = false

        // 发出事件
        this.$emit('close')

        // 等待关闭的动画效果结束
        await this.waitForAnimation()

        // 将抽屉移出栈，栈中其他抽屉可能受到影响，所以要更新他们的叠放次序
        drawerStack = drawerStack.filter(k => k !== this)
        drawerStack.map((k, i) => {
          k.index = i
          k.underlay = i < drawerStack.length - 1
        })

        // 更新 html 的总 class 以便控制页面的可滚动性
        this.updateClasses()
      },
      async waitForAnimation() {
        // 假假的等待 300ms，用于让当前动画结束
        await new Promise(r => setTimeout(r, 300))
      },
      async toggle() {
        // 模仿 Windows 下的任务栏图标点击行为，未打开 -> 打开，不在上层 -> 提升，在上层 -> 关闭
        if (!~drawerStack.slice(-1).indexOf(this)) {
          // 打开或提升都是 open() 函数
          await this.open()
        } else {
          await this.close()
        }
      },
      updateClasses() {
        let html = document.getElementsByTagName('html')[0]
        if (!drawerStack.length) {
          html.classList.remove('drawer-shown')
        } else {
          html.classList.add('drawer-shown')
        }
      }
    }
  }
</script>
<style lang="stylus">

  // PC 和 Pad 环境下，mask 为右侧栏，仍需要允许滚动
  // 手机环境下，mask 覆盖了整个页面，不能允许滚动，否则体验不好
  html, body
    height 100%
    overflow auto
    -webkit-overflow-scrolling touch

  .slide-left-enter-active, .slide-left-leave-active
    transition transform .3s
    box-shadow 0 0 10px rgba(#000, .2)

  .slide-left-enter, .slide-left-leave-to
    transform translateX(100%)

  .drawer-wrapper
    .click-area
      cursor pointer

    .drawer
      position fixed
      top 0
      bottom 0
      left var(--left-column-width, 0)
      right 0
      margin 0

      overflow hidden
      background #fff
      z-index 10001
      box-sizing border-box
      max-width 100%
      cursor default
      display flex
      flex-direction column
      overscroll-behavior contain
      -webkit-overflow-scrolling touch
      margin-left 10px

      @media screen and (max-width: 600px)
        left 0
        margin-left 0

      // 对于 Safari，若两个抽屉嵌套，外层抽屉必须变成 overflow-y: visible，否则内层抽屉将被外层抽屉裁剪
      &.underlay
        overflow-y visible

      @media screen and (max-width: 600px)
        box-shadow 0 3px 12px rgba(0, 0, 0, .05)
        height auto

      .title-bar
        flex 0 0 auto
        display: flex
        flex-direction: row
        align-items: center
        height 59px
        border-bottom 1px solid var(--color-divider)

        .close-btn
          width 35px
          height 30px
          font-size 20px
          font-weight bold
          color var(--color-text-bold)
          text-align center
          cursor pointer

          @media screen and (max-width: 600px)
            margin 0 20px

        .title
          flex 1 1 0
          padding 0 7px
          text-align left
          font-size 16px
          font-weight bold
          color var(--color-text-bold)

      .drawer-view
        flex 1 1 0
        padding 25px
        overflow-x hidden
        overflow-y scroll

</style>
