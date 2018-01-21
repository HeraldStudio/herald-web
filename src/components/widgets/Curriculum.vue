<template lang="pug">
   
  .widget.curriculum
    .title
      .zh 课程表
      .en Curriculum
      .reload(@click='reload()')
    .week-picker
      .prev-week(@click='prevWeek()') <
      .cur-week.zh 第 {{ curWeekIndex }} 周
      .cur-week.en Week {{ curWeekIndex }}
      .next-week(@click='nextWeek()') >
    .week-header
      .weekday.zh(v-for='item in "一二三四五六日"') {{ item }}
      .weekday.en(v-for='item in ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]') {{ item }}
    .curriculum-list(:class='{ empty: !curWeek.length }')
      .block(v-for='item in curWeek',
        :style="'left: ' + item.weekday / 7 * 100 + '%; top: ' + (item.beginPeriod - 1) / 13 * 100 + '%; height: ' + (item.endPeriod - item.beginPeriod + 1) / 13 * 100 + '%'")
        .name {{ item.name }}
        .place {{ item.place }}
      .empty(v-if='!curWeek.length') 暂无课程
   
</template>
<script>

  import api from '../../api'
  import formatter from "../../util/formatter";
  import cookie from 'js-cookie'

  export default {
    data() {
      return {
        curriculum: null,
        current: null
      }
    },
    created() {
      this.current = new Date().getTime()
      this.loadCache()
    },
    methods: {
      async loadCache() {
        this.curriculum = cookie.getJSON('curriculum') || null
        if (!this.curriculum) {
          await this.reload()
        }
      },
      async reload() {
        const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        let res = (await api.post('/api/curriculum')).data
        let curriculum = res.content
        let term = res.term
        let sidebar = res.sidebar.map(k => {
          let {lecturer, course, week, credit} = k
          let teacher = lecturer
          let name = course.trim()
          let [beginWeek, endWeek] = week.match(/\d+/g)
          return {teacher, name, beginWeek, endWeek, credit}
        })

        let [beginYear, endYear, semester] = term.split('-')
        beginYear = '20' + beginYear
        endYear = '20' + endYear
        let semBeginYear = parseInt(semester) === 3 ? endYear : beginYear
        let {month, day} = curriculum.startdate
        let startDate = new Date(semBeginYear, month, day).getTime()

        let courses = weekdays.map((k, i) => (curriculum[k] || []).map(j => {
          let weekday = i
          let [name, period, place] = j
          name = name.trim()
          let [beginWeek, endWeek, beginPeriod, endPeriod] = period.match(/\d+/g)
          let flip = 'none'
          if (/^\(单\)/.test(place)) {
            flip = 'odd'
          } else if (/^\(双\)/.test(place)) {
            flip = 'even'
          }
          place = place.replace(/^\([单双]\)/, '')

          let info = sidebar.filter(s => s.name === name && s.beginWeek === beginWeek && s.endWeek === endWeek)[0] || {}
          let teacher = info.teacher || ''
          let credit = info.credit || ''

          j = {name, place, weekday, beginPeriod, endPeriod, beginWeek, endWeek, flip, teacher, credit}
          return j
        })).reduce((a, b) => a.concat(b), [])

        this.curriculum = {courses, startDate}
        cookie.set('curriculum', this.curriculum, { expires: 365 })
      },
      prevWeek() {
        if (this.curWeekIndex > 1) {
          this.current -= 1000 * 60 * 60 * 24 * 7
        }
      },
      nextWeek() {
        this.current += 1000 * 60 * 60 * 24 * 7
      }
    },
    computed: {
      curWeekIndex() {
        return Math.max(1, Math.ceil((this.current - this.curriculum.startDate) / (1000 * 60 * 60 * 24 * 7)))
      },
      curWeek() {
        if (!this.curriculum) {
          return []
        }

        let curWeek = this.curWeekIndex
        return this.curriculum.courses.filter(k => {
          let available = true
          if (k.beginWeek > curWeek || k.endWeek < curWeek) {
            available = false
          }
          if (k.flip === 'even' && curWeek % 2 === 1 || k.flip === 'odd' && curWeek % 2 === 0) {
            available = false
          }
          return available
        })
      }
    }
  }
  
</script>
<style lang="stylus" scoped>

  .night .widget
    --curriculum-background-color #212121
    .curriculum-list
      .block
        border-top 1px solid #555
        background #333
        .place
          color #888

  .widget
    padding 0 !important

    --curriculum-background-color #fafafa

    .week-picker
      display flex
      flex-direction row
      justify-content space-between
      padding 20px 15px
      -webkit-user-select: none
      -moz-user-select: none
      -ms-user-select: none
      user-select: none
      color #555
      font-size 16px

      .prev-week, .next-week
        cursor pointer

    .week-header
      display flex
      flex-direction row

      .weekday
        flex 1 1 0
        text-align center
        color #555
        background var(--curriculum-background-color)
        font-size 12px
        padding 5px

        +.weekday
          margin-left 1px

    .curriculum-list
      height 432px
      position relative
      overflow hidden
      -webkit-transition: .3s
      -moz-transition: .3s
      -ms-transition: .3s
      -o-transition: .3s
      transition: .3s
      background var(--curriculum-background-color)

      &.empty
        height 70px

      .block
        position absolute
        overflow hidden
        box-sizing border-box
        margin 0 -1px -1px 0
        width 14%
        line-height 1.4em
        background #fff
        border-top 2px solid var(--theme-color)
        box-shadow 0 0 2px rgba(0, 0, 0, .05)
        display flex
        flex-direction column
        align-items center
        justify-content space-between
        text-align center
        font-size 10px
        color #333

        &::active
          background #333

        .name
          flex 0 1 auto
          overflow hidden
          font-weight bold
          color var(--theme-color)
          padding 2px
          width 100%

        .place
          padding 2px
          flex 0 0 0
          max-height 4.2em

      .empty
        position absolute
        top 50%
        left 0
        right 0
        margin-top -0.75em
        color #aaa
        font-size 14px
        text-align center

</style>