<template lang="pug">

  .page.lecture
    div(v-if='lecture')
      .info-bar
        button.info
          .title 已听讲座次数
          .content {{ lecture.length }}
        button.info
          .title 剩余讲座次数
          .content {{ Math.max(0, 8 - lecture.length) }}
      ul.detail-list
        li(v-for='item in lecture')
          .top
            .left {{ formatTime(item.time, 'yyyy/MM/dd H:mm') }}
            .right {{ item.location }}
        li.empty(v-if='!lecture.length') 暂无讲座记录
      .hint
        p 数据来自两个报告厅的打卡记录，请仔细甄别，防止无关记录干扰。具体讲座信息，可关注<b>东南大学文化素质教育中心</b>公众号，查看<b>全部消息</b>。

</template>
<script>

  import api from '@/api'
  import formatter from '@/util/formatter'

  export default {
    data() {
      return {
        lecture: null
      }
    },
    persist: {
      lecture: 'herald-default-lecture'
    },
    async created() {
      this.lecture = (await api.get('/api/lecture')).sort((a, b) => a.time - b.time)
    },
    methods: {
      ...formatter
    }
  }

</script>
<style lang="stylus" scoped>

  .page.lecture
    .hint
      text-align justify
      font-size 13px
      color var(--color-text-secondary)
      margin-top 25px

      p
        line-height 1.5em
        margin 0.5em 0

</style>

