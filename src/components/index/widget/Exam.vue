<template lang="pug">

  widget.exam(title='考试' :show='exams && exams.length')
    ul.detail-list
      li(v-for='item in exams')
        .top
          .left {{ item.courseName }}
          .right.zh {{ item.daysLeft ? '还有' + item.daysLeft + '天' : '今日考试' }}
          .right.en {{ item.daysLeft ? item.daysLeft + ' day' + (item.daysLeft == 1 ? '' : 's') + ' left' : 'Today' }}
        .bottom
          .left {{ formatPeriodNatural(item.startTime, item.endTime) }}
          .right {{ item.location }}

</template>
<script>

  import H from '@/api'
  import widget from './Widget.vue'
  import formatter from '@/util/formatter'

  export default {
    components: { widget },
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
