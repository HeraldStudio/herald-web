<template lang="pug">

  .page
    div(v-if='gpa')
      ul.detail-list
        li.info(v-if="!isGraduate")
          .top
            .tag 教务
            .left GPA {{ Number(gpa.gpa).toFixed(3) || '暂无' }}
          .bottom
            .left 首修 {{ Number(gpa.gpaBeforeMakeup).toFixed(3) || '未计算' }} / 已获学分 {{ gpa.achievedCredits }}
            .right 计算至 {{ lastCalculateSemester }}

        li.info(v-if="!isGraduate && shouldShowDelta")
          .top
            .tag 递推
            .left GPA {{ predictByDelta() }}
            .right = {{ (weighedCoveredByJWC() + weighedNotCoveredByJWC()).toFixed(3) }} ÷ {{ sumCredits() }}
          .bottom
            .left 由教务处绩点递推，更适合高年级用户

        li.info(v-if="!isGraduate")
          .tip.selection(:class="{ visible: !isGraduate && shouldShowTip }") 取消选择非必修课，结果更准确。
          .top
            .tag 估算
            .left GPA {{ predictSEUWithMakeup() }}
            .right = {{ weighedSEU().toFixed(2) }} ÷ {{ sumCredits() }}
          .bottom
            .left 首修 {{ predictSEUWithoutMakeup() }} / WES {{ predictWES() }}

        li.info(v-if="isGraduate")
          .top
            .left GPA {{ gpa.gpa || '暂无' }}
          .bottom
            .left 规格化平均成绩 {{ gpa.score || '未计算' }} / 已获学分 {{ gpa.credits.total }} / 应修学分 {{ gpa.credits.required }}
            .right 教务处计算于 {{ formatTimeNatural(gpa.calculationTime) }}

        .check-list(v-if="!isGraduate" v-for='item in gpa.detail')
          .tip.filtered(:class="{ visible: hasFilteredCourse(item.semester) }") 学期局部估算不包含被后续学期重修覆盖的课程。
          .section
            .name {{ item.semester }}
            .grade(v-if='creditsInSemester(item.semester)') {{ predictInSemester(item.semester) }} = {{ weighedInSemester(item.semester) }} ÷ {{ creditsInSemester(item.semester) }}
            .select-all(@click='toggleSelectAllInSemester(item)') {{ hasSelectAllInSemester(item) ? '全不选' : '全选' }}
          
          //- 先放非选修，可以选择
          button.check-box.required(v-for='k in item.courses' v-if='!k.courseType' :class='{ disabled: !isSelected(k), bad: !k.isPassed, makeup: k.scoreType !== "首修" }' :style='{ opacity: k.equivalentScore / 100 }' @click='toggle(k)')
            .name {{ k.courseName }}{{ k.scoreType !== '首修' ? ' (' + k.scoreType + ')' : '' }}
            .grade {{ k.equivalentScore }}{{ k.score != k.equivalentScore ? ' (' + k.score + ')' : '' }} × {{ k.credit }}

          //- 然后放选修
          button.check-box.optional(v-for='k in item.courses' v-if='k.courseType' :class='{ disabled: true, bad: !k.isPassed, makeup: k.scoreType !== "首修" }')
            .name {{ k.courseName }}{{ k.scoreType !== '首修' ? '(' + k.scoreType + ')' : '' }}
            .grade {{ k.equivalentScore }} ({{ k.courseType }} {{ k.credit }} 学分)

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
        term: [],
        selected: [],
        shouldShowTip: false
      }
    },
    persist: {
      gpa: 'herald-default-gpa-sorted',
      selected: 'herald-default-gpa-selected-new-new',
      term: 'herald-default-term'
    },
    async created() {
      this.initSelection()
      let gpa = await api.get('/api/gpa')
      gpa.detail.map(k => {
        // 由于同一课程可能有首修和多次重修，为防止判断出错，给所有课程里面加入学期
        k.courses.map(c => Object.assign(c, { semester: k.semester }))
        k.courses.sort((a, b) => b.equivalentScore - a.equivalentScore)
      })
      this.gpa = gpa
      this.initSelection()
      this.term = await api.get('/api/term')
    },
    methods: {
      ...formatter,

      // 初始化选中的课程列表
      initSelection() {
        if (this.gpa) {
          // 如果之前没有选中课程，初始化
          if (!this.selected.length) {
            this.selected = (this.gpa.detail || [])
              .map(k => k.courses)
              .reduce((a, b) => a.concat(b), [])
              // 默认选中所有非选修
              .filter(k => !k.courseType)
            this.shouldShowTip = true
          } else {
            let courses = this.gpa.detail
              .map(k => k.courses)
              .reduce((a, b) => a.concat(b), [])

            // 如果之前有选中的课程，需要清洗一遍，过滤掉 gpa 查询结果里面没有的
            this.selected = this.selected.filter(k => 
              courses.find(course => k.cid === course.cid && k.semester === course.semester)
            )
          }
        }
      },

      // 课程是否可选中，目前是非选修课程均可选
      isSelectable(course) {
        return !course.courseType
      },

      // 课程是否已选中
      isSelected(course) {
        let { cid, semester } = course
        return !!this.selected.find(k => k.cid === cid && k.semester === semester)
      },

      // 选择课程
      select(course) {
        if (this.isSelectable(course) && !this.isSelected(course)) {
          this.selected.push(course)
        }
      },

      // 取消选择课程
      deselect(course) {
        let { cid, semester } = course
        this.selected = this.selected.filter(k => k.cid !== cid || k.semester !== semester)
        this.shouldShowTip = false
      },

      // 切换课程选中态
      toggle(course) {
        if (this.isSelected(course)) {
          this.deselect(course)
        } else {
          this.select(course)
        }
      },

      // 是否已经全选某学期
      hasSelectAllInSemester(semester) {
        let { courses } = semester
        return !courses.find(k => this.isSelectable(k) && !this.isSelected(k))
      },

      // 切换全选某学期
      toggleSelectAllInSemester(semester) {
        let { courses } = semester
        let hasSelect = this.hasSelectAllInSemester(semester)
        for (let course of courses) {
          if (hasSelect) {
            this.deselect(course)
          } else {
            this.select(course)
          }
        }
      },

      // 计算单课程绩点（校内算法）
      gpaSEU(course) {
        let score = course.equivalentScore

        // 补考过了不再按 60 分计
        // if (course.scoreType === '补考' && course.isPassed) {
        //   return 1.0
        // }
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

      // 计算单课程绩点（出国算法）
      gpaWES(course) {
        let score = course.equivalentScore
        if (score >= 85) { return 4 }
        if (score >= 75) { return 3 }
        if (score >= 60) { return 2 }
        return 0
      },

      // 给定课程列表，对于其中重复课程，按照特定的 reducer 来去重
      // 对于重复的课程，reducer 每次接受两个，返回其中需要留下的一个
      reduceDuplicateCourses(courses, reducer) {
        return courses
          // 取课程号
          .map(k => k.cid)
          // 去重
          .filter((k, i, a) => a.indexOf(k) === i)
          // 根据课程号反查对应的课程
          .map(cid => courses.filter(k => k.cid === cid))
          // 对每个课程号的反查结果列表执行 reduce 操作，留下其中之一
          .map(duplicates => duplicates.slice(1).reduce(reducer, duplicates[0]))
      },

      // 筛选特定学期的课程
      filterSemester(courses, semester) {
        return courses.filter(k => k.semester === semester)
      },

      // 筛选通过的课程
      filterPassed(courses) {
        return courses.filter(k => k.isPassed)
      },

      // 筛选最早的课程（通过的课程优先）
      filterFirst(courses) {
        return this.reduceDuplicateCourses(courses, (a, b) => {
          // 如果有一次通过，另一次不通过，优先取通过的成绩
          if (a.isPassed && !b.isPassed) return a
          if (b.isPassed && !a.isPassed) return b
          // 如果两次都通过或都不通过，优先取学期较早的成绩
          return a.semester < b.semester ? a : b
        })
      },

      // 筛选最高分数的课程
      filterHighest(courses) {
        return this.reduceDuplicateCourses(courses, (a, b) => {
          return a.equivalentScore > b.equivalentScore ? a : b
        })
      },

      // 筛选计入首修成绩的课程
      filterBeforeMakeup(courses) {
        // 首修和补考都算做首修成绩
        return courses.filter(k => k.scoreType !== '重修')
      },

      // 筛选已经被教务处计算的课程
      filterCoveredByJWC(courses) {
        return courses.filter(k => k.semester <= this.lastCalculateSemester)
      },

      // 筛选没被教务处计算的课程
      filterNotCoveredByJWC(courses) {
        return courses.filter(k => k.semester > this.lastCalculateSemester)
      },

      // 对于给定的课程列表，对学分求和
      sumCredits(courses = this.selected) {
        return this.filterFirst(courses).map(k => k.credit).reduce((a, b) => a + b, 0)
      },

      // 对于给定的课程列表，求出 (学分*绩点) 的加权和，其中绩点用校内算法求
      weighedSEU(courses = this.selected) {
        return courses.map(k => this.gpaSEU(k) * k.credit).reduce((a, b) => a + b, 0)
      },

      // 对于给定的课程列表，求出 (学分*绩点) 的加权和，其中绩点用出国算法求
      weighedWES(courses = this.selected) {
        return courses.map(k => this.gpaWES(k) * k.credit).reduce((a, b) => a + b, 0)
      },

      // 对于给定的课程列表，计算加权平均绩点
      // 注意这个方法不会去重，去重需要用下面的另一个方法
      calculateSEU(courses) {
        let credits = this.sumCredits(courses)
        return (credits && this.weighedSEU(courses) / credits).toFixed(3)
      },

      // 对于给定的课程列表，计算加权平均绩点
      // 注意这个方法不会去重，去重需要用下面的另一个方法
      calculateWES(courses) {
        let credits = this.sumCredits(courses)
        return (credits && this.weighedWES(courses) / credits).toFixed(3)
      },

      // 对于给定的课程列表，按照校内算法去重（最早成绩，通过优先），并按校内算法计算加权平均绩点
      predictSEUWithMakeup(courses = this.selected) {
        return this.calculateSEU(this.filterFirst(courses))
      },

      // 对于给定的课程列表，去除重修成绩，再按照校内算法去重（最早成绩，通过优先），并按校内算法计算加权平均绩点
      predictSEUWithoutMakeup(courses = this.selected) {
        return this.predictSEUWithMakeup(this.filterBeforeMakeup(courses))
      },

      // 对于给定的课程列表，按照出国算法去重（最高一次成绩），并按出国算法计算加权平均成绩
      predictWES(courses = this.selected) {
        return this.calculateWES(this.filterHighest(courses))
      },

      // 取某学期已选中课程中已获得学分
      creditsInSemester(semester) {
        // 为了和总计算结果一致，这里需要首先全局去重
        // 也就是说，如果本学期选中了某个课程，但该课程被以后某个学期已选中的重修课程覆盖，那么这个课程不计入。
        return this.sumCredits(this.filterSemester(this.filterFirst(this.selected), semester))
      },

      // 取某学期已选中课程中 (学分*绩点) 的加权和
      // 由于学分和绩点都是至多一位小数，这里四舍五入到两位小数
      weighedInSemester(semester) {
        // 为了和总计算结果一致，这里需要首先全局去重
        // 也就是说，如果本学期选中了某个课程，但该课程被以后某个学期已选中的重修课程覆盖，那么这个课程不计入。
        return this.weighedSEU(this.filterSemester(this.filterFirst(this.selected), semester)).toFixed(2)
      },

      // 反算某学期已选中课程的加权平均绩点
      // 注意这里局部加权除会带来误差，这个计算结果仅供展示，不能用于二次计算
      predictInSemester(semester) {
        // 为了和总计算结果一致，这里需要首先全局去重
        // 也就是说，如果本学期选中了某个课程，但该课程被以后某个学期已选中的重修课程覆盖，那么这个课程不计入。
        return this.predictSEUWithMakeup(this.filterSemester(this.filterFirst(this.selected), semester))
      },

      // 判断某学期是否有已选中课程被后续学期的重修覆盖
      hasFilteredCourse(semester) {
        return this.filterSemester(this.filterFirst(this.selected), semester).length !== this.filterFirst(this.filterSemester(this.selected, semester)).length
      },

      // 根据已选中课程列表，用教务处已算绩点反推教务处已算范围内的绩点加权和，用于增量推算
      // 在推算的过程中，误差先放大后缩小，精确度不变
      // 如果用户已修课程很多（尤其高年级），而且用户自己不是十分清楚哪些已经算了绩点，这个结果会比全量估算更接近准确值。
      weighedCoveredByJWC() {
        return this.gpa.gpa * this.sumCredits(this.filterCoveredByJWC(this.filterFirst(this.selected)))
      },

      // 根据已选中课程列表，计算教务处未算范围内的绩点加权和，用于增量推算
      weighedNotCoveredByJWC() {
        return this.weighedSEU(this.filterNotCoveredByJWC(this.filterFirst(this.selected)))
      },

      // 根据上述两部分的加权和，进行增量推算，得到新的总 GPA
      // 这里有个比较神奇的特殊情况，如果教务处已算的里面包含挂科，而未算的里面包含对应的重修
      // 这种情况下由于 sumCredits 依然是合并计算的，不会导致分母变大，而分子只多了个挂科 0，不会影响结果。
      predictByDelta() {
        let credits = this.sumCredits(this.selected)
        return (credits && (this.weighedCoveredByJWC() + this.weighedNotCoveredByJWC()) / credits).toFixed(3)
      }
    },
    computed: {
      // 简单判断是否研究生
      isGraduate() {
        return this.gpa && !!this.gpa.credits
      },
      // 求用户最新选择的成绩在哪个学期
      latestSemester() {
        return this.selected.map(k => k.semester).sort().slice(-1)[0]
      },
      // 已知教务处绩点计算时间，求教务处计算截止到哪个学期
      lastCalculateSemester() {
        if (!this.gpa.gpa) {
          return
        }
        // 如果还没拉到学期列表，先显示计算时间
        if (!this.term) {
          return formatter.formatTimeNatural(this.gpa.calculationTime)
        }
        
        // 这里有两种情况，可能是在某个学期内计算的，也可能是在某个学期结束后的假期里计算的
        // 这两种情况下都认为计算截止到那个学期
        // 换句话说，计算时间跟计算截止学期之间的关系是不确定的，可能那个学期还没结束，但也可能结束了
        // 但是计算时间跟下个学期的关系是确定的：下个学期肯定还没开始
        // 所以我们首先根据计算时间，找到当时还没有开始的下个学期
        let term = this.term.list
          .sort((a, b) => a.endDate - b.endDate)
          .find(k => k.startDate >= this.gpa.calculationTime)
        if (term) {
          // 如果找到了下个学期，反推上一个学期，作为计算截止学期
          term = this.term.list[this.term.list.indexOf(term) - 1]
        } else {
          // 如果找不到这个“下个学期”，说明要找的就是最后一个学期，下个学期还没有收录
          term = this.term.list.slice(-1)[0]
        }
        return term.name
      },
      // 是否需要显示增量推算结果
      shouldShowDelta() {
        // 如果教务处已经算到最新的绩点了，就不显示
        if (this.lastCalculateSemester === this.latestSemester) {
          return false
        }
        // 其余情况，高年级才显示
        return this.gpa.detail.length > 6
      }
    }
  }

</script>
<style lang="stylus" scoped>

  .tip
    background #fff
    color #555
    font-size 13px
    line-height 16px
    box-shadow 0 1px 7px 0 rgba(0, 0, 0, .15)
    border-radius 5px
    position relative
    transition .3s
    opacity 0
    height 0
    box-sizing border-box
    white-space nowrap

    &.visible
      padding 10px 15px
      height 36px
      opacity 1

    &::after
      content ''
      position absolute
      width 10px
      height 10px
      background #fff
      box-shadow -3px 3px 5px 0 rgba(0, 0, 0, .1)
      transform rotate(-45deg)
      bottom -5px
      left 15px

    &.selection
      &.visible
        margin-bottom 10px

    &.filtered
      background var(--color-warning-bg)
      color var(--color-warning-dark)
      width 100%

      &.visible
        margin-top 15px

      &::after
        background var(--color-warning-bg)
        left unset
        right 155px

  .check-list
    display flex
    flex-direction row
    flex-wrap wrap

    .section
      width 100%
      padding 15px 0
      display flex
      flex-direction row
      align-items baseline

      .name
        font-size 16px
        flex 1 1 0

      .grade
        margin-right 7px

      .select-all
        background #f7f7f7
        height 16px
        line-height 16px
        border-radius 20px
        padding 4px 8px
        color var(--color-text-regular)
        cursor pointer

    .check-box
      background var(--color-primary)
      box-shadow 0 5px 10px -5px var(--color-primary)
      color #fff
      margin-left 0 !important
      margin-right 7px
      margin-bottom 7px
      transition .3s
      display flex
      flex-direction row
      align-items baseline
      overflow hidden
      position relative

      &.required
        cursor pointer
      
      &.bad
        opacity 0.6 !important
        background var(--color-error)
        border-color var(--color-error)
        box-shadow 0 5px 10px -5px var(--color-error)
      
      &.makeup
        background var(--color-warning)
        border-color var(--color-warning)
        box-shadow 0 5px 10px -5px var(--color-warning)

      &.disabled
        background var(--color-tool-bg)
        border-color var(--color-tool-bg)
        box-shadow none
        color var(--color-text-bold)
        opacity 1 !important

      .name
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
        flex 0 0 1
        min-width 0
        text-align justify

      .grade
        opacity .7
        margin-left 5px
        white-space nowrap
        flex 1 1 auto
        font-weight normal

</style>

