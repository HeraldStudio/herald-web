<template lang="pug">

  .page.activity(v-if='activities && activities.length')
    .activity-item(v-for='(activity, i) in activities' :key='activity.aid' :style='"z-index: " + i' :class='{ collapsed: activity.endTime <= now }')
      .activity-container(@click='click(activity)')
        .activity-title
          .tag.ongoing(v-if='activity.startTime <= now && activity.endTime > now') 进行中
          .tag.upcoming(v-if='activity.startTime > now') 未开始
          .tag.ended(v-if='activity.endTime <= now') 已结束
          span {{ activity.title }}
        .img-container
          img(:src='activity.pic' ondragstart="return false")
        .activity-content {{ activity.content }}

</template>
<script>

  import api from '@/api'
  import formatter from "@/util/formatter"

  export default {
    data() {
      return {
        now: +new Date(),
        activities: []
      }
    },
    persist: {
      activities: 'herald-default-activities'
    },
    created() {
      this.reload()
    },
    methods: {
      async reload() {
        let now = new Date().getTime()
        this.activities = await api.get(`api/activity?pagesize=20`)
      },
      async click({ hasUrl, aid }) {
        if (hasUrl) {

          // iOS WebApp 端，需要用 location.href 赋值才能在 Safari 中打开，否则将会在 WebApp 中打开，导致无法返回
          if (window.__herald_env === 'webapp' || window.__herald_env === 'wx') {
            window.location.href = await api.put('/api/activity', { aid })
          }
          
          // 其他情况下，需要用 window.open 在新窗打开
          // 根据 WS3 API，必须 PUT 才能拿到链接，因此需要先获取到链接再异步打开窗口
          // 根据 Safari 安全机制，不允许异步打开窗口，必须先打开，然后异步设置 URL
          // https://blog.csdn.net/wgrzhuaq/article/details/7821725
          else {
            let win = window.open('about:blank', '_blank')
            let url = await api.put('/api/activity', { aid })

            // 由于 interceptor.js 的 hook，window.open 可能返回 null（小程序情况）
            // 此时，直接调用 window.open 来触发 hook 中的复制链接
            if (win) {
              win.location = url
            } else {
              window.open(url)
            }
          }
        } else {
          this.$toasted.show('该活动没有详情页面')
        }
      }
    }
  }

</script>
<style lang="stylus" scoped>

  .page.activity
    position relative
    padding 0

    @media screen and (max-width: 600px)
      padding 0
      border 0

    .activity-item
      overflow hidden
      position relative
      transition .5s
      border-bottom 0.5px solid var(--color-divider)

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
          font-size 12px
          padding 3px 5px
          vertical-align baseline

          &.ongoing
            background var(--color-primary)

          &.upcoming
            background var(--color-success)

          &.ended
            background #ccc

        .img-container
          position relative
          margin 20px 0 0
          // overflow hidden

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
            box-shadow 0 5px 15px rgba(#000, .1)

        .activity-content
          color var(--color-text-regular)
          font-size 13px
          max-height 4.5em
          line-height 1.5em
          overflow hidden
          text-overflow ellipsis
          min-width 0

</style>
