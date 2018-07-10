<template lang="pug">

  .page
    div(v-if='gpa')
      ul.info-bar
        li.info(v-if="!isGraduate")
          .title 总平均绩点
          .content {{ gpa.gpa || '暂无' }}
        li.info(v-if="!isGraduate")
          .title 首修平均绩点
          .content {{ gpa.gpaBeforeMakeup || '未计算' }}
        li.info(v-if="isGraduate")
          .title 规格化平均成绩
          .content {{ gpa.score }}
        li.info
          .title 已获学分
          .content {{ isGraduate ? gpa.credits.total : gpa.achievedCredits }}
        li.info(v-if="isGraduate")
          .title 应修学分
          .content {{ gpa.credits.required }}
        li.info(v-if="!isGraduate && gpa.calculationTime")
          .title 计算时间
          .content {{ formatTimeNatural(gpa.calculationTime) }}
      ul.info-bar.predict(v-if="!isGraduate")
        li.info
          .title 校内估算
          .content {{ predictSEU(false) }} / 4.8
        li.info
          .title 首修估算
          .content {{ predictSEU(true) }} / 4.8
        li.info
          .title 出国估算
          .content {{ predictWES() }} / 4.0
      .hint(v-if="!isGraduate") 从列表中取消选择不算绩点的课程，将实时显示更准确的估算绩点；选中补考将自动忽略首修，总绩点和出国绩点将自动取已选的最高成绩。
      ul.detail-list(v-if="!isGraduate" v-for='item in gpa.detail')
        .section {{ item.semester }}
        li(v-for='k in item.courses' :class='{ active: isSelected(k), bad: k.equivalentScore < 60 }' @click='toggle(k)')
          .info
            .name {{ k.courseName }}
            .grade {{ k.score }} ({{ k.courseType + k.credit + '学分' }})
          .tube(:style='"width: " + k.equivalentScore + "%"')
      ul.detail-list(v-if="isGraduate" v-for='item in gpa.detail')
        .section 第 {{ item.semester }} 学期
        li.active(v-for='k in item.courses')
          .info
            .name {{ k.courseName }}
            .grade {{ k.score }} ({{ k.scoreType + k.credit + '学分' }})
          .tube(:style='"width: " + k.equivalentScore + "%"')

</template>
<script>

  import api from '@/api'
  import formatter from '@/util/formatter'

  export default {
    data() {
      return {
        gpa: null,
        selected: []
      }
    },
    persist: {
      gpa: 'herald-default-gpa-sorted',
      selected: 'herald-default-gpa-selected-new'
    },
    async created() {
      let gpa = await api.get('/api/gpa')
      gpa.detail.map(k => {
        // 由于同一课程可能有首修和多次重修，为防止判断出错，给所有课程里面加入学期
        k.courses.map(c => Object.assign(c, { semester: k.semester }))
        k.courses.sort((a, b) => b.equivalentScore - a.equivalentScore)
      })
      this.gpa = gpa

      if (!this.selected.length) {
        this.selected = this.gpa.detail
          .map(k => k.courses)
          .reduce((a, b) => a.concat(b), [])
          .filter(k => !k.courseType && k.isFirstPassed || k.isHighestPassed)
      }
    },
    methods: {
      ...formatter,
      isSelected(course) {
        let { cid, semester } = course
        return !!this.selected.find(k => k.cid === cid && k.semester === semester)
      },
      toggle(course) {
        let { cid, semester } = course
        if (this.isSelected(course)) {
          this.selected = this.selected.filter(k => k.cid !== cid || k.semester !== semester)
        } else {
          this.selected.push(course)
        }
      },
      gpaSEU(course) {
        let score = course.equivalentScore

        // 补考过了按 60 分计
        if (course.scoreType === '补考' && course.equivalentScore >= 60) {
          return 1.0
        }

        if (score >= 96) { return 4.8 }
        if (score >= 93) { return 4.5 }
        if (score >= 90) { return 4.0 }
        if (score >= 86) { return 3.8 }
        if (score >= 83) { return 3.5 }
        if (score >= 80) { return 3.0 }
        if (score >= 76) { return 2.8 }
        if (score >= 73) { return 2.5 }
        if (score >= 70) { return 2.0 }
        if (score >= 66) { return 1.8 }
        if (score >= 63) { return 1.5 }
        if (score >= 60) { return 1.0 }
        return 0
      },
      gpaWES(course) {
        let score = course.equivalentScore
        if (score >= 85) { return 4 }
        if (score >= 75) { return 3 }
        if (score >= 60) { return 2 }
        return 0
      },
      predictSEU(noMakeup = false) {
        // 估算首修绩点时，把补考成绩算在首修上，否则过滤首修时不知道是否有补考，无法决定是否过滤
        if (noMakeup) {
          this.selected.filter(k => k.scoreType === '补考').map(k => {
            // 这里我们用 makeup 表示重修，makeup exam 表示补考
            let first = this.selected.find(m => m.cid === k.cid && m.scoreType === '首修')
            if (first) first.hasMakeupExam = true
          })
        }
        let { weightedGpa, credit } = this.selected
          // 若估算首修绩点，有补考看补考，没补考看首修，挂了就是挂了；若估算总绩点，相同课程取最高一次成绩
          .filter(k => noMakeup ? (k.scoreType === '首修' && !k.hasMakeupExam || k.scoreType === '补考') : k.isHighestPassed)
          .map(k => ({
            weightedGpa: this.gpaSEU(k) * k.credit,
            credit: k.credit
          })).reduce((a, b) => ({
            weightedGpa: a.weightedGpa + b.weightedGpa,
            credit: a.credit + b.credit
          }), {
            weightedGpa: 0,
            credit: 0
          })
        return (credit && weightedGpa / credit).toFixed(3)
      },
      predictWES() {
        let { weightedGpa, credit } = this.selected
          .filter(k => k.isHighestPassed) // 相同课程仅最高一次通过有效
          .map(k => ({
            weightedGpa: this.gpaWES(k) * k.credit,
            credit: k.credit
          })).reduce((a, b) => ({
            weightedGpa: a.weightedGpa + b.weightedGpa,
            credit: a.credit + b.credit
          }), {
            weightedGpa: 0,
            credit: 0
          })
        return (credit && weightedGpa / credit).toFixed(3)
      }
    },
    computed: {
      isGraduate() {
        return this.gpa && !!this.gpa.credits
      }
    }
  }

</script>
<style lang="stylus" scoped>

  // Safari 下 sticky 的粘附位置会受到父元素 padding 影响
  // 这里去掉父元素 padding，改为首元素 margin，以消除此影响
  .page
    padding-top 0 !important

    > :first-child
      margin-top 20px !important

  .hint
    text-align left
    color var(--color-text-secondary)
    padding 20px 10px
    border-bottom 0.5px solid var(--color-divider)
    white-space normal
    line-height 1.5em

  .info-bar.predict
    position sticky
    position -webkit-sticky
    top 0
    z-index 99999
    background rgba(#fff, .8)
    padding 5px 0 0
    --webkit-backdrop-filter blur(20px)

  .detail-list
    text-align left
    padding-bottom 15px !important

    &:not(:last-child)
      border-bottom 0.5px solid var(--color-divider)

    .section
      width 100%
      padding 15px 0

    li
      color var(--color-text-regular)
      cursor pointer
      transition .3s
      display flex
      flex-direction column
      border none !important
      overflow hidden

      &.active
        .name
          font-weight bold

      &:not(.active)
        .tube
          transform translateX(-100%)
          margin-top 0

        .name
          color var(--color-text-secondary)

      &.bad
        .name
          text-decoration line-through

      .info
        display flex
        flex-direction row
        align-items center
      
      .tube
        min-width 4px
        height 4px
        background var(--color-primary)
        border-radius 2px
        transition .5s
        margin-top 10px

      .name
        font-size 15px
        color var(--color-primary)
        margin-right 5px
        white-space nowrap
        overflow hidden
        text-overflow ellipsis

      .grade
        color var(--color-text-secondary)
        margin-top 3px
        white-space nowrap

</style>

