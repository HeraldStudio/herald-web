<template lang="pug">

  widget.banner(title='编辑推荐' :show='banners.length')
    banner.banner(:auto="5000", :loop="true", :speed="500", :dots="true", :watch-items="banners")
      banner-item.banner-item(v-for='page in banners' :key='page.bid')
        .img-container
          a(v-if='page.url' :href='page.url' target="_blank")
            img(:src='page.pic' ondragstart="return false")
          img(v-else :src='page.pic' ondragstart="return false")
        .text-container
          .banner-hint(v-if='page.schoolnumPrefix && page.schoolnumPrefix.indexOf("guest") === -1') 专属推荐
          .banner-title {{ page.title }}
          a.banner-link(v-if='page.url' :href='page.url' target="_blank") 详情 >

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
        banners: []
      }
    },
    created() {
      this.reload()
    },
    methods: {
      async reload() {
        this.banners = await H.api.banner()
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
          width 100%
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

        .text-container
          display flex
          flex-direction row
          padding 15px 10px
          justify-content center
          align-items center
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

          .banner-title
            color var(--color-text-regular)
            font-size 15px
            font-weight bold
            white-space nowrap
            overflow hidden
            text-overflow ellipsis
            max-width 100%

</style>
