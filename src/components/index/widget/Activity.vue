<template lang="pug">

  widget.activity(title='校园活动' :show='activities.length')
    .activity-item(v-for='(activity, i) in activities' :key='activity.aid' :style='"z-index: " + (i + 1)' :class='{ collapsed: activity.endTime <= now }')
      .activity-container(@click='click(activity)')
        .activity-title
          .tag.ongoing(v-if='activity.startTime <= now && activity.endTime > now') 进行中
          .tag.upcoming(v-if='activity.startTime > now') 未开始
          .tag.ended(v-if='activity.endTime <= now') 已结束
          span {{ activity.title }}
        img(:src='activity.pic' ondragstart="return false")
        .activity-content {{ activity.content }}

</template>
<script>

  import H from '@/api'
  import widget from './Widget.vue'
  import formatter from "@/util/formatter"

  export default {
    components: {
      widget
    },
    data() {
      return {
        now: +new Date(),
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
        this.activities = await H.api.activity({ pagesize: 20 })
      },
      async click({ hasUrl, aid }) {
        // 根据 Safari 安全机制，不允许异步打开窗口，必须先打开，然后异步设置 URL
        // https://blog.csdn.net/wgrzhuaq/article/details/7821725
        if (hasUrl) {
          let win = window.open('about:blank', '_blank')
          let url = await H.api.activity.put({ aid })
          win.location = url
        } else {
          this.$toasted.show('该活动没有详情页面')
        }
      }
    }
  }

</script>
<style lang="stylus" scoped>

  .widget.activity
    position relative
    padding 0
    border 0
    box-shadow none

    .activity-item
      overflow hidden
      background #fff
      position relative
      box-shadow 0 0 20px rgba(0, 0, 0, .05)
      margin-bottom 10px
      transform perspective(600px)
      transition .5s

      &.collapsed:not(:last-child):not(:hover)
        transform perspective(600px) rotateX(-15deg)
        transform-origin 50% 0
        height 250px
        margin-bottom -195px

      .activity-container
        display flex
        flex-direction column
        padding 20px
        cursor pointer

        * + *
          margin-top 15px

        .activity-title
          color var(--color-text-regular)
          font-size 15px
          font-weight bold
          // white-space nowrap
          overflow hidden
          text-overflow ellipsis
          min-width 0
        
        .tag
          display inline-block
          border-radius 3px
          margin-right 5px
          color #ffffff
          font-size 13px
          padding 1px 3px
          vertical-align baseline

          &.ongoing
            background var(--color-primary)

          &.upcoming
            background var(--color-success)

          &.ended
            background #ccc

        img
          border-radius 3px
          width 100%
          object-fit cover
          -webkit-user-select: none
          -moz-user-select: none
          -ms-user-select: none
          user-select: none

        .activity-content
          color var(--color-text-regular)
          font-size 13px
          max-height 4.5em
          line-height 1.5em
          overflow hidden
          text-overflow ellipsis
          min-width 0

</style>
