<template lang="pug">

  .page
    .title 小猴偷米课表预测 v3.0
    .hint(v-if='stat.length')
      p.
        此列表根据你所在院系最近一段时间成绩查询记录的匿名统计，根据教务处排课编号排除你已经上过的课程，
        从而推测出你下学期（短学期和长学期）可能上到的必选、限选、任选课程，供选课时参考。
    .search-tools
      .hint 高级查询（查询其他院系年级或学期）
      .fields
        input.schoolnum(v-model='query.schoolnum' placeholder='学号前五位')
        input.term(v-model='query.term' placeholder='预测学期，如 17-18-3')
        button(@click='loadCourse()') ＞
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
    hr
    .title 热门选修课排行
    .list(v-if='optional.length')
      .course(v-for='course in optional' :key='course.cid')
        .line
          .name {{ course.courseName }}
          .credit {{ course.courseType.split('').slice(0, 2).join('').replace('经济', '经管') }}
        .line
          .info(v-if='course.avgScore') 样本容量 {{ course.sampleCount }} / 粗略平均成绩 {{ course.avgScore }}
          .info(v-else) 样本容量 {{ course.sampleCount }}
      .load-more(v-if='!ended' @click='loadOptional()') ↓ 加载更多

</template>
<script>

  import api from '@/api'

  export default {
    props: ['user'],
    data() {
      return {
        query: {
          term: '',
          schoolnum: ''
        },
        stat: [],
        optional: [],
        ended: false
      }
    },
    created() {
      this.loadOptional()
      if (this.user) {
        this.loadCourse()
      }
    },
    watch: {
      user() {
        if (this.user) {
          this.loadCourse()
        }
      }
    },
    methods: {
      async loadCourse() {
        let q = {}
        if (this.query.term) {
          q.term = this.query.term
        }
        if (this.query.schoolnum) {
          q.schoolnum = this.query.schoolnum
        }
        this.stat = await api.get('/api/course', q)
      },
      async loadOptional() {
        if (!this.ended) {
          this.ended = true // 先禁用加载更多按钮防止重复获取同一页
          let nextPage = await api.get('/api/course/optional', {
            pagesize: 10,
            page: Math.ceil(this.optional.length / 10) + 1
          })
          if (nextPage.length == 10) {
            this.ended = false
          }
          this.optional = this.optional.concat(nextPage)
        }
      }
    }
  }

</script>
<style lang="stylus" scoped>

  .title
    font-size 18px
    font-weight bold
    color var(--color-text-bold)

  .hint
    font-size 14px
    color var(--color-text-secondary)
    margin 10px 0

    p
      line-height 1.5em
      margin 0.5em 0

  .search-tools
    padding 10px
    margin 10px 0
    border-radius 3px
    border 0.5px solid var(--color-divider)

    .hint
      font-weight: bold
      color var(--color-text-bold)
      margin 0 0 20px
  
    .fields
      display flex
      flex-direction row
      align-items center

      * + *
        margin-left 5px

      input.term
        width 50px
        flex 2 2 0
        font-size 13px

      input.schoolnum
        width 50px
        flex 1 1 0
        font-size 13px
  
  .course
    padding 10px 0
    border-bottom 0.5px solid var(--color-divider)

    .head
      padding-top 5px
      padding-bottom 15px
      margin-bottom 10px
      border-bottom 0.5px solid var(--color-divider)
      font-weight bold
      font-size 13px
      color var(--color-text-bold)
      text-align left

    .line
      display flex
      flex-direction row

      .name
        flex 1 1 auto
        text-align left
        color var(--color-primary)
        font-size 16px
        margin-bottom 2px

      .info
        color var(--color-text-bold)
        font-size 13px

      .credit
        flex 0 0 auto
        color var(--color-text-bold)
        font-size 13px

  .load-more
    text-align center
    padding 20px
    color var(--color-text-bold)
    font-size 13px
    
</style>
