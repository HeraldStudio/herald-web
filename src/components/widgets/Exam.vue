<template lang="pug">
   
  .widget.exam(v-if='exams && exams.length')
    .title
      .zh 考试
      .en Exams
      .reload(@click='reload()')
    ul.detail-list
      li(v-for='item in exams')
        .top
          .left {{ item.course }}
          .right.zh {{ item.daysLeft ? '还有' + item.daysLeft + '天' : '今日考试' }}
          .right.en {{ item.daysLeft ? item.daysLeft + ' day' + (item.daysLeft == 1 ? '' : 's') + ' left' : 'Today' }}
        .bottom
          .left {{ item.time }}
          .right {{ item.location }}
   
</template>
<script>

  import api from '../../api'
  import formatter from "../../util/formatter";

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
      async reload() {
        let now = new Date()
        this.exams = (await api.post('/api/exam')).data.content.map(k => {
          let [y, M, d, h, m] = k.time.split(/[- :(]/g)
          let date = new Date(y, M - 1, d)
          date.setHours(h)
          date.setMinutes(m)
          k.start = date
          k.end = new Date(date.getTime() + k.hour * 1000 * 60)
          return k
        }).filter(k => k.end > now).map(k => {
          k.time = formatter.formatPeriodNatural(k.start, k.end)
          k.daysLeft = Math.round((k.start - now) / (1000 * 60 * 60 * 24))
          return k
        })
      }
    }
  }
  
</script>