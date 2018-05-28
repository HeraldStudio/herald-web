<template lang="pug">

  item(title='成绩' :name='isGraduate ? "成绩" : "绩点"' :value='gpa && (gpa.gpa || gpa.score || "暂无")' :isStale='gpa && gpa.isStale')
    div(v-if='gpa')
      ul.info-bar
        li.info(v-if="!isGraduate")
          .title 绩点
          .content {{ gpa.gpa || '暂无' }}
        li.info(v-if="!isGraduate")
          .title 首修
          .content {{ gpa.gpaBeforeMakeup || '未计算' }}
        li.info(v-if="!isGraduate && gpa.calculationTime")
          .title 计算时间
          .content {{ formatTimeNatural(gpa.calculationTime) }}
        li.info(v-if="isGraduate")
          .title 规格化平均成绩
          .content {{ gpa.score }}
        li.info(v-if="isGraduate")
          .title 已修学分
          .content {{ gpa.credits.total }}
        li.info(v-if="isGraduate")
          .title 应修学分
          .content {{ gpa.credits.total }}
      ul.detail-list(v-if='gpa.detail[0]')
        li(v-for='k in gpa.detail[0].courses')
          .top
            .left {{ k.courseName }}
            .right {{ k.score }} ({{ k.courseType + k.credit + '学分' }})

</template>
<script>

  import H from '@/api'
  import formatter from '@/util/formatter'
  import item from '../DashboardItem.vue'

  export default {
    props: ['isGraduate'],
    components: {
      item
    },
    data() {
      return {
        gpa: null
      }
    },
    persist: {
      gpa: 'herald-default-gpa'
    },
    created() {
      this.reload()
    },
    methods: {
      ...formatter,
      async reload() {
        this.gpa = await H.api.gpa()
      }
    },
    computed: {
      totalCredits() {
        return this.gpa.detail
          .map(k => k.courses).reduce((a, b) => a.concat(b), [])
          .map(k => k.credit).reduce((a, b) => a + b, 0)
      }
    }
  }

</script>
