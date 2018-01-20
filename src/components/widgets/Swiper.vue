<template lang="pug">
   
  .widget.swiper(v-show='swiper.length')
    .title
      .zh 编辑推荐
      .en Trend
      .reload(@click='reload()')
    swiper.swiper(:auto="5000", :loop="true", :speed="500", :dots="false", :watch-items="swiper")
      swiper-item.swiper-item(v-for='page in swiper')
        a(v-if='page.url', :href='page.url' target="_blank")
          img(:src='page.imageurl' ondragstart="return false")
        img(v-else :src='page.imageurl' ondragstart="return false")
   
</template>
<script>

  import api from '../../api'
  import formatter from "../../util/formatter"
  import { Carousel, CarouselItem } from 'vue-l-carousel'

  export default {
    components: {
      'swiper': Carousel,
      'swiper-item': CarouselItem
    },
    data() {
      return {
        swiper: []
      }
    },
    created() {
      this.reload()
    },
    methods: {
      async reload() {
        this.swiper = (await api.post('https://myseu.cn/checkversion', {
          versiontype: 'web',
          versionname: 'web',
          versioncode: '',
          schoolnum: ''
        })).data.content.sliderviews
      }
    }
  }
  
</script>
<style>

  @import "~vue-l-carousel/dist/main.css";

  .v-carousel-nav {
    padding: 0 12px;
    font-size: 14px;
    background: rgba(0, 0, 0, .6);
  }

</style>
<style lang="stylus" scoped>

  .widget
    padding 0 !important
    position relative

    &::after
      display block
      content ' '
      width 100%
      padding-top 40%

    .swiper
      position absolute
      top 0
      left 0
      right 0
      bottom 0
      overflow hidden

      .swiper-item
        width 100%
        height 100%

        img
          width 100%
          height 100%
          object-fit cover
          -webkit-user-select: none
          -moz-user-select: none
          -ms-user-select: none
          user-select: none

</style>