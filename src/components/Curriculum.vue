<template lang="pug">

  .widget.curriculum(v-if='curriculum' :class='{ stale: curriculum && curriculum.isStale }')
    .week-picker
      .switch(@click='listView = !listView; displayTerm = currentTerm') {{ listView ? '近期课程' : '周视图' }}
      .prev(v-if='!listView' @click='prevTerm()') ‹
      button.cur(v-if='!listView' title='点击回到本学期' @click='displayTerm = currentTerm') {{ displayTerm }}
      .next(v-if='!listView' @click='nextTerm()') ›
      .prev(v-if='!listView' @click='prevWeek()') ‹
      button.cur(v-if='!listView' title='点击回到本周' @click='displayWeek = currentWeek') {{ displayWeek }} 周
      .next(v-if='!listView' @click='nextWeek()') ›
    div.curriculum-container(v-if='!listView')
      .week-header(v-if='fixedClasses.length || !floatClasses.length')
        .weekday(v-for='(item, i) in "一二三四五六日"' v-if="i < weekdayCount" :class='{ current: displayTerm == currentTerm && displayWeek == currentWeek && i + 1 == currentDayOfWeek }') {{ item }}
      .curriculum-list(v-if='fixedClasses.length || !floatClasses.length' :class='{ empty: !fixedClasses.length }')
        table.block-bg
          tr(v-for='_ in 13' v-if='fixedClasses.length')
            td(v-for='_ in weekdayCount')
        .block(v-for='item in fixedClasses' v-if='item.dayOfWeek'
          :style="'width: ' + 1 / weekdayCount * 99 + '%; left: ' + ((item.dayOfWeek - 1) / weekdayCount * 100 + 0.1) + '%; top: ' + (item.beginPeriod - 1) / 13 * 99.8 + '%; height: ' + (item.endPeriod - item.beginPeriod + 1) / 13 * 99.8 + '%'")
          .name {{ item.courseName }}
          .teacher {{ item.teacherName }}
          .place {{ item.location }}
        .empty(v-if='!fixedClasses.length') 暂无课程
    ul.detail-list(v-if='listView')
      li(v-for='item in upcomingClasses')
        .top
          .left {{ item.courseName }}
          .right {{ item.teacherName }}
        .bottom
          .left {{ formatPeriodNatural(item.startTime, item.endTime) }}
          .right {{ item.location }}
      li.empty(v-if='!upcomingClasses.length') 三天内没有课程
    ul.detail-list(v-if='!listView && floatClasses && floatClasses.length')
      .hint 以下课程无法确定上课时间：
      li(v-for='item in floatClasses')
        .top
          .left {{ item.courseName }}
          .right {{ item.teacherName }}
        .bottom
          .left {{ item.beginWeek }}-{{ item.endWeek }}周
          .right(v-if='item.credit') {{ item.credit }} 学分

</template>
<script>

  import H from '@/api'
  import formatter from '@/util/formatter'

  export default {
    data() {
      return {
        term: [],
        curriculum: {
          curriculum: [],
          term: {}
        },
        currentTerm: '',
        displayTerm: '',
        currentWeek: 1,
        displayWeek: 1,
        currentDayOfWeek: 1,
        listView: false
      }
    },
    persist: {
      curriculum: 'herald-default-curriculum', 
      term: 'herald-default-term'
    },
    async created() {
      // term 有缓存，先为缓存数据计算一遍 displayTerm
      this.displayTerm = this.currentTerm

      this.term = await H.api.term()
      this.currentTerm = this.term.find(k => k.current).name
      this.displayTerm = this.currentTerm
    },
    watch: {
      curriculum() {
        if (this.curriculum.term.startDate) {
          let now = new Date()
          this.currentWeek =
            Math.min(this.maxWeek,
              Math.max(1,
                Math.ceil(
                  (now.getTime() - this.curriculum.term.startDate) / (1000 * 60 * 60 * 24 * 7)
                )
              )
            )
          this.currentDayOfWeek = (now.getDay() + 6) % 7 + 1
          this.displayWeek = this.currentWeek
        } else {
          this.currentWeek = 1
          this.currentDayOfWeek = 0
          this.displayWeek = this.currentWeek
        }
      },
      async displayTerm() {
        this.curriculum = await H.api.curriculum({ term: this.displayTerm })
      }
    },
    methods: {
      ...formatter,
      prevWeek() {
        if (this.displayWeek > 1) {
          this.displayWeek -= 1
        }
      },
      nextWeek() {
        if (this.displayWeek < this.curriculum.term.maxWeek) {
          this.displayWeek += 1
        }
      },
      prevTerm() {
        let term = this.term.map(k => k.name)
        // JS 取模是对绝对值取模保留符号，所以要先加上 length 保证结果为正
        this.displayTerm = term[(term.indexOf(this.displayTerm) + term.length - 1) % term.length]
      },
      nextTerm() {
        let term = this.term.map(k => k.name)
        this.displayTerm = term[(term.indexOf(this.displayTerm) + 1) % term.length]
      }
    },
    computed: {
      displayClasses() {
        return this.curriculum.curriculum.filter(k =>
          k.beginWeek <= this.displayWeek &&
          k.endWeek >= this.displayWeek &&
          this.displayWeek % 2 !== ['odd', 'even'].indexOf(k.flip)
        )
      },
      upcomingClasses() {
        let now = Date.now()
        return this.curriculum.curriculum
          .filter(k => k.events)
          .map(k => k.events.map(e => {
            e = Object.assign(e, k)
            delete e.events
            return e
          }))
          .reduce((a, b) => a.concat(b), [])
          .sort((a, b) => a.startTime - b.startTime)
          .filter(k => k.endTime > now && k.endTime < now + 3 * 24 * 60 * 60 * 1000)
      },
      weekdayCount() {
        return Math.max(5, this.fixedClasses.map(k => k.dayOfWeek).reduce((a, b) => Math.max(a, b), 0))
      },
      fixedClasses() {
        return this.displayClasses.filter(k => k.dayOfWeek)
      },
      floatClasses() {
        return this.displayClasses.filter(k => !k.dayOfWeek)
      },
      maxWeek() {
        return this.curriculum.curriculum.map(k => k.endWeek).reduce((a, b) => Math.max(a, b), 0)
      }
    }
  }

</script>
<style lang="stylus" scoped>

  .widget
    padding 15px 0 0 !important
    --curriculum-background-color #fff

    .week-picker
      display flex
      flex-direction row
      justify-content center
      -webkit-user-select: none
      -moz-user-select: none
      -ms-user-select: none
      user-select: none
      padding 10px 10px 20px 25px
      // align-items center

      .switch
        flex 1 1 0
        text-align left
        font-size 15px
        font-weight bold
        color var(--color-text-bold)
        cursor pointer

      .cur
        cursor pointer
        font-size 14px
        font-weight bold
        padding 3px 7px
        border-radius 3px
        color var(--color-primary-dark)
        background var(--color-primary-bg)

      .prev, .next
        cursor pointer
        color #ccc
        font-size 16px
        font-weight bold
        padding 0 10px

    .curriculum-container
      width 100%
      max-width 480px
      margin 0 auto

      .week-header
        display flex
        flex-direction row

        .weekday
          flex 1 1 0
          text-align center
          color var(--color-text-bold)
          background var(--curriculum-background-color)
          font-size 12px
          padding 5px

          +.weekday
            margin-left 1px

          &.current
            color var(--color-primary)
            font-weight bold
            border-bottom 0.5px solid var(--color-primary)
            box-shadow inset 0 -3px 0 var(--color-primary-bg)

      .curriculum-list
        height 520px
        margin 0
        position relative
        overflow hidden
        -webkit-transition: .3s
        -moz-transition: .3s
        -ms-transition: .3s
        -o-transition: .3s
        transition: .3s

        table.block-bg
          border-collapse collapse
          width 100%
          height 100%
          box-sizing border-box
          background var(--color-tool-bg)
          table-layout fixed

          td
            border 0.5px solid #f0f0f0

            &:first-child
              border-left none

            &:last-child
              border-right none

        &.empty
          height 70px

        .block
          position absolute
          overflow hidden
          box-sizing border-box
          margin 0 -1px -1px 0
          line-height 1.2em
          background #fff
          border-top 0.5px solid var(--color-primary)
          box-shadow 0 1px 3px rgba(0, 0, 0, .1)
          display flex
          flex-direction column
          align-items center
          justify-content space-between
          text-align center
          font-size 12px
          color var(--color-text-regular)

          .name
            flex 0 1 auto
            font-weight bold
            color var(--color-primary)
            padding 2px
            width 100%
            overflow hidden

          .teacher
            flex 1 100 0
            font-weight bold
            overflow hidden
            color var(--color-text-bold)

          .place
            padding 2px
            flex 0 0 auto

        .empty
          position absolute
          top 50%
          left 0
          right 0
          margin-top -0.75em
          color #aaa
          font-size 14px
          text-align center

    .detail-list
      padding 20px 25px 25px !important
      box-sizing border-box

      .empty
        color #aaa
        font-size 14px
        text-align center
        margin-top -10px

      .hint
        font-size 14px
        color #888
        margin-bottom 3px

</style>
