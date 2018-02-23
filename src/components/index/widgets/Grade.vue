<template lang="pug">

  .widget.gpa
    .title 成绩
      .reload(@click='reload()')
    .empty(v-if='!gpa') 加载中
    div(v-else)
      ul.info-bar
        li.info
          .title 绩点
          .content {{ gpa.gpa || '未计算' }}
        li.info
          .title 首修
          .content {{ gpa.gpaBeforeMakeup || '未计算' }}
        li.info(v-if="gpa.calculationTime")
          .title 计算时间
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
