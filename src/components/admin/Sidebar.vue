<template lang='pug'>
  #admin-sidebar
    ul
      li.category 运维
        ul
          li(:class='{ current: current === "monitor" }'   @click='changePage("monitor")')   系统概况
          li(:class='{ current: current === "privilege" }' @click='changePage("privilege")') 权限管理
          li(:class='{ current: current === "notice" }'    @click='changePage("notice")')    通知公告
      li.category 运营
        ul
          li(:class='{ current: current === "advertise" }' @click='changePage("advertise")') 轮播广告
          li(:class='{ current: current === "actpass" }'   @click='changePage("actpass")')   活动审核
      li.category 合作
        ul
          li(:class='{ current: current === "actpush" }'   @click='changePage("actpush")')   活动宣传
          li(:class='{ current: current === "lecture" }'   @click='changePage("lecture")')   讲座发布
          li(:class='{ current: current === "pe" }'        @click='changePage("pe")')        跑操发布
          li(:class='{ current: current === "vote" }'      @click='changePage("vote")')      投票系统
          li(:class='{ current: current === "ticket" }'    @click='changePage("ticket")')    票务系统
          li(:class='{ current: current === "canteen" }'   @click='changePage("canteen")')   食堂系统
</template>
<script>
  export default {
    props: ['current'],
    methods: {
      changePage (newPage) {
        this.$emit('changePage', newPage)
      }
    }
  }
</script>
<style lang='stylus'>
  #admin-sidebar
    display flex
    flex-direction column

    ul
      list-style none
      padding-left 0
      color #333
      font-size 15px

      li.category
        padding 15px 20px
        border-bottom 1px solid var(--divider-color)
        font-size 17px
        color #888
        text-align left

        ul
          li
            padding-top 15px
            transition .3s
            cursor pointer

            &:hover
              color var(--theme-color)

            &.current
              color var(--theme-color)
              font-weight bold

</style>
