<template lang="pug">

  widget.experiment(title='物理实验' :show='experiment.length')
    ul.detail-list
      li(v-for='k in experiment')
        .top
          .left {{ k.labName }}
          .right {{ k.score ? '成绩：' + k.score : k.teacherName }}
        .bottom(v-if='!k.score')
          .left {{ formatPeriodNatural(k.startDate, k.endDate) }}
          .right {{ k.location + '室' }}

</template>
<script>

  import H from '@/api'
  import widget from './Widget.vue'
  import formatter from '@/util/formatter'

  export default {
    components: { widget },
    data() {
      return {
        experiment: []
      }
    },
    persist: {
      experiment: 'herald-default-experiment'
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
