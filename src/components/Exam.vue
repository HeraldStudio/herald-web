<template lang="pug">

  .widget.exam(v-if='exams && exams.length' :class='{ stale: exams && exams.isStale }')
    ul.detail-list
      li(v-for='item in exams' v-if='item.endTime > now')
        .top
          .left {{ item.courseName }}
          .right {{ daysBefore(item) ? daysBefore(item) + ' 天后考试' : '今日考试' }}
        .bottom
          .left {{ formatPeriodNatural(item.startTime, item.endTime) }}
          .right {{ item.location }}

</template>
<script>

  import H from '@/api'
  import formatter from '@/util/formatter'

  export default {
    data() {
      return {
        exams: null,
        now: Date.now()
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
        this.now = Date.now()
        this.exams = await H.api.exam()
      },
      daysBefore(exam) {
        return Math.round((exam.startTime - this.now) / (1000 * 60 * 60 * 24))
      }
    }
  }

</script>
<style lang="stylus" scoped>
  // .widget.exam .bottom .left
  //   font-weight normal
</style>
