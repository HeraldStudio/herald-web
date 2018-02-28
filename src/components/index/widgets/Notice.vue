<template lang="pug">

  .widget.notice(v-show='notices.length')
    .title 系统公告
      .reload(@click='reload()')
    ul.detail-list
      li(v-for='item in notices')
        a(:href='item.url' target='_blank')
          .top
            .left {{ item.title }}
            .right(v-if='item.schoolnumPrefix && item.schoolnumPrefix.indexOf("guest") === -1') 专属推送
          .bottom
            .left {{ item.content }}
    .empty(v-if='!notices.length') 暂无通知

</template>
<script>

  import H from '@/api'

  export default {
    data() {
      return {
        notices: []
      }
    },
    created() {
      this.reload()
    },
    methods: {
      async reload() {
        this.notices = await H.api.notice()
      }
    }
  }

</script>
<style lang='stylus' scoped>
  .widget.notice
    ul.detail-list li
      a[href=""]
        pointer-events none
        cursor normal

      .top .left
        font-weight bold
        color var(--color-text-regular)

      .bottom .left
        font-weight normal

      .top .right
        padding 3px 7px
        background var(--color-primary)
        border-radius 3px
        color #fff
        font-weight bold
        font-size 13px

</style>
