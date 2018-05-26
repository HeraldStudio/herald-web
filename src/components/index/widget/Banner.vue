<template lang="pug">

  widget.banner(title='编辑推荐' :show='banner && banner.length')
    banner.banner(:auto="5000", :loop="true", :speed="500", :dots="true", :watch-items="banner")
      banner-item.banner-item(v-for='page in banner' :key='page.bid')
        .img-container(@click='click(page)')
          img(:src='page.pic' ondragstart="return false")
        .text-container
          .banner-hint(v-if='page.schoolnumPrefix && page.schoolnumPrefix.indexOf("guest") === -1') 专属推荐
          .banner-title {{ page.title }}
          .banner-link(v-if='page.hasUrl' @click='click(page)') 详情 >

</template>
<script>

  import H from '@/api'
  import widget from './Widget.vue'
  import formatter from "@/util/formatter"
  import { Carousel, CarouselItem } from 'vue-l-carousel'

  export default {
    components: {
      widget,
      banner: Carousel,
      'banner-item': CarouselItem
    },
    data() {
      return {
        banner: []
      }
    },
    persist: ['banner'],
    created() {
      this.reload()
    },
    methods: {
      async reload() {
        this.banner = await H.api.banner()
      },
      async click({ hasUrl, bid }) {
        // 根据 Safari 安全机制，不允许异步打开窗口，必须先打开，然后异步设置 URL
        // https://blog.csdn.net/wgrzhuaq/article/details/7821725
        if (hasUrl) {
          let win = window.open('about:blank', '_blank')
          let url = await H.api.banner.put({ bid })

          // 由于 interceptor.js 的 hook，window.open 可能返回 null（小程序情况）
          // 此时，直接调用 window.open 来触发 hook 中的复制链接
          if (win) {
            win.location = url
          } else {
            window.open(url)
          }
        } else {
          this.$toasted.show('该横幅没有详情页面')
        }
      }
    }
  }

</script>
<style>

  @import "~vue-l-carousel/dist/main.css";

  .v-carousel {
    padding-bottom: 15px
  }

  .v-carousel-dots {
    bottom: 5px;
  }

  .v-carousel-dot {
    width: 10px;
    height: 3px;
  }

  .v-carousel-nav {
    display: none;
    padding: 0 12px;
    font-size: 14px;
    background: #fff;
    color: var(--color-text-bold);
  }

  .v-carousel-items {
    height: 100%
  }

</style>
<style lang="stylus" scoped>

  .widget.banner
    position relative
    padding 0

    @media screen and (max-width: 600px)
      margin-top 0

    .banner
      overflow hidden

      .banner-item
        width 100%
        height 100%

        .img-container
          position relative
          margin 20px 20px 0
          overflow hidden

          &::after
            display block
            content ' '
            width 100%
            padding-top 40%

          img
            position absolute
            left 0
            right 0
            top 0
            bottom 0
            width 100%
            height 100%
            object-fit cover
            -webkit-user-select: none
            -moz-user-select: none
            -ms-user-select: none
            user-select: none
            cursor pointer
            border-radius 3px

        .text-container
          display flex
          flex-direction row
          padding 15px 20px
          justify-content center
          align-items baseline
          min-width 0

          * + *
            margin-left 10px

          .banner-hint, .banner-link
            padding 3px 7px
            background var(--color-primary)
            border-radius 3px
            color #fff
            font-weight bold
            font-size 13px
            white-space nowrap
            overflow hidden
            cursor pointer

          .banner-title
            color var(--color-text-regular)
            font-size 15px
            font-weight bold
            // white-space nowrap
            overflow hidden
            text-overflow ellipsis
            line-height 1.7em
            height 1.7em

</style>
