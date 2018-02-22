<template lang="pug">

  .widget.experiment(v-if='experiment.length')
    .title
      .zh 物理实验
      .en Physics experiment
      .reload(@click='reload()')
    ul.detail-list
      li(v-for='k in experiment')
        .top
          .left {{ k.labName }}
          .right.zh {{ k.score ? '成绩：' + k.score : k.teacherName }}
          .right.en {{ k.score ? 'Score: ' + k.score : k.teacherName }}
        .bottom(v-if='!k.score')
          .left {{ formatPeriodNatural(k.startDate, k.endDate) }}
          .right.zh {{ k.location + '室' }}
          .right.en {{ 'Room ' + k.location }}

</template>
<script>

  import H from '@/api'
  import formatter from '@/util/formatter'

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
      ...formatter,
      async reload() {
        let now = new Date()
        let experiment = await H.api.phylab()
        this.experiment = experiment.filter(k => k.endDate > now || k.score.length)
      }
    }
  }

</script>
