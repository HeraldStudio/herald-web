<template lang="pug">

  widget.activity(title='校园活动' :show='activities.length')
    activity.activity(:auto="5000", :loop="true", :speed="500", :dots="true", :watch-items="activities")
      activity-item.activity-item(v-for='activity in activities' :key='activity.aid')
        .activity-container(@click='click(activity)')
          .img-container
            img(:src='activity.pic' ondragstart="return false")
          .text-container
            .activity-title {{ activity.title }}
            .activity-content {{ activity.content }}

</template>
<script>

  import H from '@/api'
  import widget from './Widget.vue'
  import formatter from "@/util/formatter"
  import { Carousel, CarouselItem } from 'vue-l-carousel'

  export default {
    components: {
      widget,
      activity: Carousel,
      'activity-item': CarouselItem
    },
    data() {
      return {
        activities: []
      }
    },
    persist: ['activities'],
    created() {
      this.reload()
    },
    methods: {
      async reload() {
        let now = new Date().getTime()
        this.activities = (await H.api.activity()).filter(k =>
          k.startTime <= now && k.endTime > now)
      },
      async click({ hasUrl, aid }) {
        if (hasUrl) {
          window.open(await H.api.activity.put({ aid }), '_blank')
        } else {
          this.$toasted.show('该活动没有详情页面')
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

  .widget.activity
    position relative
    padding 0

    .activity
      overflow hidden

      .activity-item
        width 100%
        height 100%

        .activity-container
          display flex
          flex-direction row
          padding 20px
          cursor pointer

          .img-container
            position relative
            width 80px
            height 80px
            flex 0 0 80px
            overflow hidden
            border-radius 3px

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
            flex 1 1 0
            display flex
            flex-direction column
            margin-left 15px
            overflow hidden

            * + *
              margin-top 5px

            .activity-title
              color var(--color-text-regular)
              font-size 15px
              font-weight bold
              white-space nowrap
              overflow hidden
              text-overflow ellipsis
              min-width 0

            .activity-content
              color var(--color-text-regular)
              font-size 13px
              max-height 4.5em
              line-height 1.5em
              overflow hidden
              text-overflow ellipsis
              min-width 0

</style>
