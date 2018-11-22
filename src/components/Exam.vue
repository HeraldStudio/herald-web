<template lang="pug">

  .widget.exam(v-if='exams && exams.length' :class='{ stale: exams && exams.isStale }')
    ul.detail-list
      li(v-for='item in exams')
        .top
          .left {{ item.courseName }}
          .right {{ daysBefore(item) }}
        .bottom
          .left {{ formatPeriodNatural(item.startTime, item.endTime) }}
          .right {{ item.location }}

</template>
<script>

  import api from '@/api'
  import formatter from '@/util/formatter'

  export default {
    data() {
      return {
        exams: null
      }
    },
    persist: {
      exams: 'herald-default-exams'
    },
    created() {
      this.reload()
    },
    methods: {
      ...formatter,
      async reload() {
        this.exams = await api.get('/api/exam')
      },
      daysBefore(exam) {
        let now = Date.now()
        if (exam.startTime > now) {
          let days = Math.round((exam.startTime - now) / (1000 * 60 * 60 * 24))
          return days ? days + ' 天后考试' : '今日考试'
        }
        if (exam.endTime > now) {
          return '正在考试'
        }
        return '考试已结束'
      }
    }
  }

</script>
<style lang="stylus" scoped>
  // .widget.exam .bottom .left
  //   font-weight normal
</style>
