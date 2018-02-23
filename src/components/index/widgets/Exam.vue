<template lang="pug">

  .widget.exam(v-if='exams && exams.length')
    .title 考试
      .reload(@click='reload()')
    ul.detail-list
      li(v-for='item in exams')
        .top
          .left {{ item.courseName }}
          .right {{ item.daysLeft ? '还有' + item.daysLeft + '天' : '今日考试' }}
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
        exams: null
      }
    },
    created() {
      this.reload()
    },
    methods: {
      ...formatter,
      async reload() {
        let now = new Date()
        this.exams = (await H.api.exam()).filter(k => k.endTime > now).map(k => {
          k.daysLeft = Math.round((k.startTime - now) / (1000 * 60 * 60 * 24))
          return k
        })
      }
    }
  }

</script>
