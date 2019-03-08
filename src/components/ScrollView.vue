<template lang="pug">

  .scroll-view(ref='scrollView')
    .scroll-wrapper(ref='scrollWrapper')
      .pull-to-refresh(:style='pullRefreshStyles')
        svg.ptr-svg(width=40 height=40 viewPort='0 0 40 40' :class='{ refreshing: refreshing }')
          circle.ptr-circle(ref='circle' r=10 cx=20 cy=20 fill='transparent' :style='circleStyles')
      .scroll-content(ref='scrollContent')
        slot

</template>
<script>
  import AlloyTouch from '../util/alloytouch'
  import Transform from '../util/transform'

  export default {
    data() {
      return {
        touch: null,
        value: 0,
        refreshing: false
      }
    },
    mounted() {
      let { scrollView, scrollWrapper, scrollContent } = this.$refs
      Transform(scrollWrapper)

      this.touch = new AlloyTouch({
        touch: scrollView,
        target: scrollWrapper,
        property: 'translateY',
        min: () => scrollView.clientHeight - scrollContent.clientHeight,
        max: () => this.refreshing ? 60 : 0,
        change: (value) => {
          this.value = value
        },
        touchEnd: () => {
          if (this.value > 60) {
            this.refreshing = true
            setTimeout(() => {
              window.location.reload()
            }, 1000)
          }
        }
      })

      scrollView.addEventListener('mousewheel', (e) => {
        scrollWrapper.translateY = Math.max(scrollView.clientHeight - scrollContent.clientHeight, Math.min(0, scrollWrapper.translateY - e.deltaY))
      })
    },
    watch: {
      scrollToTopKey() {
        this.touch && this.touch.to(0)
      },
      value() {
        // 这个属性不能使用 vue 的注入来做，用 parcel 编译生产环境的时候会崩
        // 只能通过 js 动态设置
        this.$refs.circle.style.strokeDasharray = this.circleDashArray
      }
    },
    computed: {
      pullRefreshProgress() {
        return this.value / 55
      },
      pullRefreshProgressBounded() {
        return Math.min(1, Math.max(0, this.pullRefreshProgress))
      },
      pullRefreshStyles() {
        let maxMargin = this.$refs.scrollView ? (this.$refs.scrollView.clientWidth - 30 - 40) / 2 : 0
        let progress = this.pullRefreshProgressBounded
        return {
          opacity: progress,
          margin: '0 ' + maxMargin * progress + 'px',
          borderRadius: 20 * progress + 'px'
        }
      },
      circleDashArray() {
        let length = 20 * Math.PI
        let progress = this.pullRefreshProgressBounded
        return length * 5 / 6 * progress + ' ' + length
      },
      circleStyles() {
        let progress = this.pullRefreshProgress
        return {
          transform: `rotate(${ progress * 160 }deg)`
        }
      }
    }
  }
</script>
<style lang="stylus" scoped>

  .scroll-view
    position relative
    overflow hidden
    width 100%
    height 100%

    .scroll-wrapper
      width 100%
      min-height 100%
      overflow visible

      .pull-to-refresh
        position absolute
        top -41px
        left 15px
        right 15px
        height 40px
        background #fff
        box-shadow 0 0 1px rgba(0, 0, 0, .1)
        display flex
        justify-content center

        @keyframes rotate
          from { transform: rotate(0deg) }
          to { transform: rotate(-360deg) }

        .ptr-svg
          &.refreshing
            animation rotate 1s linear infinite

        .ptr-circle
          margin 5px
          stroke var(--color-primary)
          stroke-width 3px
          stroke-linecap round
          transform-origin center

      .scroll-content
        width 100%
        min-height 100%
        overflow hidden

</style>
