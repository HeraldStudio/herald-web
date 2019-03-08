<template lang="pug">

  .scroll-view(ref='scrollView')
    .scroll-wrapper(ref='scrollWrapper')
      .pull-to-refresh(:style='pullRefreshStyles' :class='{ refreshing: refreshing }')
        //- 切记 parcel vue 在生产环境无法为 svg 及内部节点注入任何属性，也无法拿到 svg 及内部节点的 ref
        //- 对 svg 的任何动态更改，需要通过注入 .pull-to-refresh 的 CSS 变量来实现
        svg.ptr-svg(width=40 height=40 viewPort='0 0 40 40')
          circle.ptr-circle(r=10 cx=20 cy=20 fill='transparent')
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
              if (window.__wxjs_environment === 'miniprogram') {
                window.wx.miniProgram.relaunch({
                  url: '/pages/index/index'
                })
              } else {
                window.location.reload()
              }
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
        let length = 20 * Math.PI
        let progress = this.pullRefreshProgress
        let progressBounded = this.pullRefreshProgressBounded
        if (this.refreshing) {
          progress = progressBounded = 1
        }
        return {
          opacity: progressBounded,
          margin: '0 ' + maxMargin * progressBounded + 'px',
          borderRadius: 20 * progressBounded + 'px',
          '--circle-dash': length * 5 / 6 * progressBounded + ' ' + length,
          '--circle-transform': `rotate(${ progress * 160 }deg)`
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

        &.refreshing
          animation rotate 1s linear infinite

        .ptr-circle
          margin 5px
          stroke var(--color-primary)
          stroke-width 3px
          stroke-linecap round
          stroke-dasharray var(--circle-dash)
          transform var(--circle-transform)
          animation var(--circle-animation)
          transform-origin center

      .scroll-content
        width 100%
        min-height 100%
        overflow hidden

</style>
