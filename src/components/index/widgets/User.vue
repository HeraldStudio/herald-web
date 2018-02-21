<template lang="pug">

  .widget.user
    .title
      .zh 用户
      .en Your account
      .reload(@click='reload()')
    .empty(v-if='!user')
      .zh 加载中
      .en Loading...
    .

</template>
<script>

  import api from '@/api'
  import formatter from "@/util/formatter";

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
        this.exams = (await api.post('/api/exam')).result.map(k => {
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
