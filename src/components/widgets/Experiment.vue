<template lang="pug">
   
  .widget.experiment(v-if='experiment.length')
    .title
      .zh 物理实验
      .en Physics experiment
      .reload(@click='reload()')
    ul.detail-list
      li(v-for='k in experiment.slice(1)')
        .top
          .left {{ k.name }}
          .right.zh {{ k.Grade ? '成绩：' + k.Grade : k.Teacher }}
          .right.en {{ k.Grade ? 'Score: ' + k.Grade : k.Teacher }}
        .bottom(v-if='!k.Grade')
          .left {{ k.time }}
          .right.zh {{ k.Address + '室' }}
          .right.en {{ 'Room ' + k.Address }}
   
</template>
<script>

  import api from '../../api'
  import formatter from "../../util/formatter";

  export default {
    data() {
      return {
        experiment: []
      }
    },
    created() {
      this.reload()
    },
    methods: {
      async reload() {
        let now = new Date()
        let experiment = (await api.post('/api/phylab')).data.content
        this.experiment = Object.keys(experiment)
          .map(k => experiment[k] || [])
          .reduce((a, b) => a.concat(b), [])
          .map(k => {
            let [y, M, d] = k.Date.split(/[年月日（ (]/g)
            let [h, m] = {
              '上午': [9, 45],
              '下午': [13, 45],
              '晚上': [18, 15]
            }[k.Day]
            let start = new Date(y, M - 1, d)
            start.setHours(h)
            start.setMinutes(m)
            k.start = start
            k.end = new Date(start.getTime() + 1000 * 60 * 60 * 3)
            return k
          }).filter(k => k.end > now || k.Grade.length).map(k => {
            k.time = formatter.formatPeriodNatural(k.start, k.end)
            return k
          })
      }
    }
  }
  
</script>