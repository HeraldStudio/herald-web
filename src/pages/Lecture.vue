<template lang="pug">

  .page.lecture
    div(v-if='lecture')
      ul.info-bar
        li.info
          .title 已听讲座次数
          .content {{ lecture.length }}
        li.info
          .title 剩余讲座次数
          .content {{ Math.max(0, 8 - lecture.length) }}
      .hint
        p 数据来自两个人文讲座专用教室的打卡记录，偶现显示为空属于正常现象，不影响讲座次数认定。请仔细甄别，剔除非讲座时间打卡，即为校方认可的有效人文讲座次数。
      ul.detail-list
        li(v-for='item in lecture')
          .top
            .left {{ formatTime(item.time, 'yyyy/M/d H:mm') }}
            .right {{ item.location }}
        li.empty(v-if='!lecture.length') 暂无讲座记录

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
      font-size 14px
      color var(--color-text-secondary)
      margin 10px 0

      p
        line-height 1.5em
        margin 0.5em 0

</style>

