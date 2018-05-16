<template lang="pug">

  #course-stat(v-if='user')
    .title 小猴偷米课表预测 v3.0 build 369e263f
    .hint(v-if='stat.length')
      p.
        此列表根据你所在院系最近一段时间成绩查询记录的匿名统计，根据教务处排课编号排除你已经上过的课程，
        从而推测出你下学期（短学期和长学期）可能上到的必选、限选、任选课程，供选课时参考。
    .list(v-if='stat.length')
      .course(v-for='(course, i) in stat' :key='course.cid')
        .head(v-if='i == 0 || course.semester != stat[i - 1].semester') 第{{ course.semester }}学期
        .line
          .name {{ course.courseName }}
          .credit {{ course.credit }} 学分
        .line
          .info(v-if='course.avgScore') 样本容量 {{ course.sampleCount }} / 粗略平均成绩 {{ course.avgScore }}
          .info(v-else) 样本容量 {{ course.sampleCount }}
    .hint(v-if='stat.length')
      p.
        1. 由于隐私保护以及性能要求，调查并未覆盖全部学生，且存在可控范围内的重复计算。
        样本容量为未去重值，仅作为选课人数比例参考，不代表实际人数。
      p.
        2. 粗略平均成绩仅供参考，按等级计分的课程，以教务处绩点算法下等价的百分制分数换算。
    .hint(v-else) 找不到与你的院系年级对应的数据

</template>
<script>

  import H from '@/api'
  import Login from '@/components/index/widget/Login'

  export default {
    props: ['user'],
    components: { login: Login },
    data() {
      return {
        stat: []
      }
    },
    created() {
      if (this.user) {
        this.load()
      }
    },
    watch: {
      user() {
        if (this.user) {
          this.load()
        }
      }
    },
    methods: {
      async load() {
        this.stat = await H.api.course({ term: 'next' })
      }
    }
  }

</script>
<style lang="stylus">

  #course-stat
    padding 25px
    max-width 600px
    margin 0 auto

    .title
      font-size 18px
      font-weight bold
      color var(--color-text-bold)

    .hint
      font-size 14px
      color var(--color-text-secondary)
      margin 15px 0

      p
        line-height 1.5em
        margin 1em 0
    
    .course
      padding 10px 0
      border-bottom 1px solid var(--color-divider)

      .head
        padding-bottom 10px
        margin-bottom 10px
        border-bottom 1px solid var(--color-divider)
        font-weight bold
        font-size 13px
        color var(--color-text-bold)

      .line
        display flex
        flex-direction row

        .name
          flex 1 1 auto
          color var(--color-primary)
          font-size 16px

        .credit, .info
          color var(--color-text-bold)
          font-size 13px
    
</style>
