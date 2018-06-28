<template lang="pug">

  .page
    div(v-if='gpa')
      ul.info-bar
        li.info(v-if="!isGraduate")
          .title 总平均绩点
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
          .content {{ gpa.credits.required }}
      ul.info-bar.predict(v-if="!isGraduate")
        li.info
          .title 校内估算
          .content {{ predictSEU }} / 4.8
        li.info
          .title 出国估算
          .content {{ predictWES }} / 4.0
      .hint(v-if="!isGraduate") 从列表中取消选择不算绩点的课程，将为你实时估算更准确的总平均绩点。
      ul.detail-list(v-if="!isGraduate" v-for='item in gpa.detail')
        .section {{ item.semester }}
        li(v-for='k in item.courses' :class='{ active: isSelected(k) }' @click='toggle(k)')
          .info
            .name {{ k.courseName }}
            .grade {{ k.score }} ({{ k.courseType + k.credit + '学分' }})
          .tube(:style='"width: " + percentageScore(k) + "%"')
      ul.detail-list(v-if="isGraduate" v-for='item in gpa.detail')
        .section 第 {{ item.semester }} 学期
        li.active(v-for='k in item.courses')
          .info
            .name {{ k.courseName }}
            .grade {{ k.score }} ({{ k.scoreType + k.credit + '学分' }})
          .tube(:style='"width: " + percentageScore(k) + "%"')

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
      selected: 'herald-default-gpa-selected'
    },
    async created() {
      let gpa = await api.get('/api/gpa')
      gpa.detail.map(k => {
        // 由于同一课程可能有首修和多次重修，为防止判断出错，给所有课程里面加入学期
        k.courses.map(c => Object.assign(c, { semester: k.semester }))
        k.courses.sort((a, b) => this.percentageScore(b) - this.percentageScore(a))
      })
      this.gpa = gpa

      if (!this.selected.length) {
        this.selected = this.gpa.detail
          .map(k => k.courses)
          .reduce((a, b) => a.concat(b), [])
          .filter(k => !k.courseType)
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
      percentageScore({ score }) {
        if (/优/.test(score)) {
          score = 95
        } else if (/良/.test(score)) {
          score = 85
        } else if (/中/.test(score)) {
          score = 75
        } else if (/不及格/.test(score)) {
          score = 0
        } else if (/及格|通过/.test(score)) {
          score = 60
        }
        return parseFloat(score) || 0
      },
      gpaSEU(course) {
        let score = this.percentageScore(course)
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
        let score = this.percentageScore(course)
        if (score >= 85) { return 4 }
        if (score >= 75) { return 3 }
        if (score >= 60) { return 2 }
        return 0
      }
    },
    computed: {
      isGraduate() {
        return this.gpa && !!this.gpa.credits
      },
      totalCredits() {
        return this.gpa.detail
          .map(k => k.courses).reduce((a, b) => a.concat(b), [])
          .map(k => k.credit).reduce((a, b) => a + b, 0)
      },
      predictSEU() {
        let { weightedGpa, credit } = this.selected.map(k => ({
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
        let { weightedGpa, credit } = this.selected.map(k => ({
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

      .grade
        color var(--color-text-secondary)
        margin-top 3px

</style>

