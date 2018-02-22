<template lang="pug">

  .widget.gpa
    .title
      .zh 成绩
      .en GPA
      .reload(@click='reload()')
    .empty(v-if='!gpa')
      .zh 加载中
      .en Loading...
    div(v-else)
      ul.info-bar
        li.info
          .title
            .zh 当前绩点
            .en Current GPA
          .content {{ gpa.gpa || '未计算' }}
        li.info
          .title
            .zh 首修绩点
            .en GPA without revamp
          .content {{ gpa.gpaBeforeMakeup || '未计算' }}
        li.info(v-if="gpa.calculationTime")
          .title
            .zh 计算时间
            .en Calculation time
          .content {{ formatTimeNatural(gpa.calculationTime) }}
      ul.detail-list
        li(v-for='k in gpa.detail[0].courses')
          .top
            .left {{ k.courseName }}
            .right {{ k.score }} ({{ k.courseType + k.credit + '学分' }})

</template>
<script>

  import H from '@/api'
  import formatter from '@/util/formatter'

  export default {
    data() {
      return {
        gpa: null
      }
    },
    created() {
      this.reload()
    },
    methods: {
      ...formatter,
      async reload() {
        this.gpa = await H.api.gpa()
      }
    }
  }

</script>
