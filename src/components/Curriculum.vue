<template lang="pug">

  .widget.curriculum(v-if='curriculum' :class='{ stale: curriculum && curriculum.isStale }')
    .curriculum-tabs
      .tab(:class='{ selected: type === "week" }' @click='type = "week"') 周视图
      .tab(:class='{ selected: type === "timeline" }' @click='type = "timeline"') 时间轴
      .tab(:class='{ selected: type === "outline" }' @click='type = "outline"') 课程概览
      router-link.tab(to='/course-stat') 课表预测
 
    //- 周视图/概览视图：学期和星期切换
    .week-picker(v-if='type === "week" || type === "outline"')

      //- 学期切换器
      .prev(@click='prevTerm()') ‹
      .cur(title='点击回到本学期' @click='displayTerm = currentTerm') {{ displayTerm || '...' }}
      .next(@click='nextTerm()') ›

      //- 星期切换器
      .prev(v-if='type === "week"' @click='prevWeek()') ‹
      .cur(v-if='type === "week"' title='点击回到本周' @click='Math.min(this.maxWeek, Math.max(1, this.currentWeek))') 第 {{ displayWeek }} 周
      .next(v-if='type === "week"' @click='nextWeek()') ›

    //- 周视图：课表格子
    div.curriculum-container(v-if='type === "week"')
      .week-header(v-if='fixedClasses.length || !floatClasses.length')
        .weekday(v-for='(item, i) in "一二三四五六日"' v-if="i < weekdayCount" :class='{ current: displayTerm == currentTerm && displayWeek == currentWeek && i + 1 == currentDayOfWeek }') {{ getDate(i + 1) }}
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

    //- 周视图：浮动课程
    ul.detail-list(v-if='type === "week" && floatClasses && floatClasses.length')
      .hint 以下课程无法确定上课时间：
      li(v-for='item in floatClasses')
        .top
          .left {{ item.courseName }}
          .right {{ item.teacherName }}
        .bottom
          .left {{ item.beginWeek }}-{{ item.endWeek }}周
          .right(v-if='item.credit') {{ item.credit }} 学分

    //- 时间轴视图
    ul.detail-list(v-if='type === "timeline"')
      li(v-for='item in upcomingClasses')
        .top
          .left {{ item.courseName }}
          .right {{ item.teacherName }}
        .bottom
          .left {{ formatPeriodNatural(item.startTime, item.endTime) }}
          .right {{ item.location }}
      li.empty(v-if='!upcomingClasses.length') 三天内没有课程

    //- 预览视图
    ul.detail-list(v-if='type === "outline"')
      li(v-for='item in allClasses')
        .top
          .left {{ item.courseName }}
          .right {{ item.teacherName }}
        .bottom
          .left {{ item.credit ? `${item.credit} 学分` : '' }}
          .right {{ item.location }}

</template>
<script>

  import api from '@/api'
  import formatter from '@/util/formatter'

  // 魔法组件，谨慎修改
  export default {
    data() {
      return {
        // 'week'     周视图
        // 'outline'  概览视图
        // 'timeline' 时间轴视图
        type: 'week',

        // 当前已知的学期列表
        term: [],

        // 当前学期的课表和学期信息
        curriculum: {
          curriculum: [],
          term: {}
        },

        // 今天所在学期，固定不变
        currentTerm: '',

        // 当前显示的学期，可切换
        displayTerm: '',

        // 今天所在周，如果处于假期，可能为负值或超过最大周数
        currentWeek: 1,

        // 当前显示周，一定是范围内的自然数
        displayWeek: 1,

        // 今天的星期，1~7
        currentDayOfWeek: 1
      }
    },
    persist: {
      curriculum: 'herald-default-curriculum', 
      term: 'herald-default-term'
    },
    async created() {
      // term 有缓存，先为缓存数据计算一遍 displayTerm
      this.displayTerm = this.currentTerm

      // 不要根据返回的 current 来判断显示哪个学期，而是找结束时间大于当前时间的最早学期来显示，这样对于假期期间的情况也适合
      let now = Date.now()

      // 拉取已知学期列表并排序
      this.term = await api.get('/api/term')
      this.term.list.sort((a, b) => a.endDate - b.endDate)

      // 计算当前所在学期，如果当前处于假期，取下个学期
      this.currentTerm = this.term.list.find(k => k.endDate > now).name

      // 初始情况下显示当前所在学期，这一步会触发 curriculum 拉取
      this.displayTerm = this.currentTerm
    },
    watch: {
      // 改变显示学期时，触发课表拉取
      async displayTerm() {
        this.curriculum = await api.get('/api/curriculum', { term: this.displayTerm })
      },
      // 改变课表时，触发计算当前周次、当前星期，并初始化显示周次
      curriculum() {
        if (this.curriculum.term.startDate) {
          let now = new Date()

          // 计算当前周次，可能为负或超出最大值
          // 当前周次会用于判断当前显示的周是否需要高亮今天，因此不做边界检查，只对当前显示周次做边界检查
          this.currentWeek = Math.ceil((now.getTime() - this.curriculum.term.startDate) / (1000 * 60 * 60 * 24 * 7))

          // 计算当前星期
          this.currentDayOfWeek = (now.getDay() + 6) % 7 + 1

          // 将当前所在周次进行边界检查，得到初始显示周次
          this.displayWeek = Math.min(this.maxWeek, Math.max(1, this.currentWeek))
        } else {
          // 当前学期开学日期未知时，默认展示第一周，当前星期零，以防出现高亮
          this.currentWeek = 1
          this.displayWeek = 1
          this.currentDayOfWeek = 0
        }
      },
      type() {
        // 切换显示模式时，如果切换到时间轴模式，回到当前所在学期
        if (this.type === 'timeline') {
          this.displayTerm = this.currentTerm
        }
      }
    },
    methods: {
      ...formatter,
      // 显示上一周，带边界检查
      prevWeek() {
        if (this.displayWeek > 1) {
          this.displayWeek -= 1
        }
      },
      // 显示下一周，带边界检查
      nextWeek() {
        if (this.displayWeek < this.curriculum.term.maxWeek) {
          this.displayWeek += 1
        }
      },
      // 显示上一学期，带边界检查
      prevTerm() {
        let term = this.term.list.map(k => k.name)
        // JS 取模是对绝对值取模保留符号，所以要先加上 length 保证结果为正
        this.displayTerm = term[(term.indexOf(this.displayTerm) + term.length - 1) % term.length]
      },
      // 显示下一学期，带边界检查
      nextTerm() {
        let term = this.term.list.map(k => k.name)
        this.displayTerm = term[(term.indexOf(this.displayTerm) + 1) % term.length]
      },
      // 获取当前显示周中某日的日期
      getDate(dayOfWeek) {
        let { startDate } = this.curriculum.term
        if (!startDate) return '星期' + '一二三四五六日'[dayOfWeek - 1]
        let t = startDate + ((this.displayWeek - 1) * 7 + (dayOfWeek - 1)) * (1000 * 60 * 60 * 24)
        let dt = new Date(t)
        let today = new Date()
        if (dt.getFullYear() !== today.getFullYear()) {
          return formatter.formatTime(t, 'yy/M/d')
        } else if (dt.getMonth() !== today.getMonth()) {
          return formatter.formatTime(t, 'M/d E')
        } else {
          return formatter.formatTime(t, 'd E')
        }
      }
    },
    computed: {
      // 概览视图用，所有课程按名称和教师去重
      allClasses() {
        let allClasses = this.curriculum.curriculum.map(k => ({
            [`${k.courseName}-${k.teacherName}`]: k
        })).reduce((a, b) => Object.assign(a, b), {})

        return Object.keys(allClasses).map(k => allClasses[k])
      },
      // 当前周需要显示的课程
      // 条件：已开课、未结课、单双周匹配
      displayClasses() {
        return this.curriculum.curriculum.filter(k =>
          k.beginWeek <= this.displayWeek &&
          k.endWeek >= this.displayWeek &&
          this.displayWeek % 2 !== ['odd', 'even'].indexOf(k.flip)
        )
      },
      // 每个课程的 events 是 startTime 和 endTime 的对象数组
      // 为了提高传输效率，其他字段没有在 events 中冗余出现
      // 首先将每个课程的其他字段（不含 events 本身）冗余到 events 数组中
      // 然后对所有课程的 events 数组合并排序，取三天内要开始的和已开始未结束的
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
          .filter(k => k.endTime > now && k.startTime < now + 3 * 24 * 60 * 60 * 1000)
      },
      // 取固定课程（有具体时间的课程）
      fixedClasses() {
        return this.displayClasses.filter(k => k.dayOfWeek)
      },
      // 取浮动课程（无具体时间的课程）
      floatClasses() {
        return this.displayClasses.filter(k => !k.dayOfWeek)
      },
      // 计算本周需要显示几天
      // 策略：至少显示周一到周五；如果周六有课，至少显示到周六；如果周日有课，显示到周日。
      weekdayCount() {
        return Math.max(5, this.fixedClasses.map(k => k.dayOfWeek).reduce((a, b) => Math.max(a, b), 0))
      },
      // 取当前显示学期的最大周数
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
    margin-top 65px
    
    .curriculum-tabs
      display flex
      flex-direction row
      margin-top -65px
      margin-bottom 25px

      .tab
        flex 1 1 0
        text-align center
        font-size 14px
        border-radius 5px 5px 0 0
        padding 15px 0
        // box-shadow inset 0 -2px 3px rgba(0, 0, 0, .03)
        height 50px
        line-height 20px
        box-sizing border-box
        color #777
        cursor pointer
        transition background .2s

        &:hover
          background #f8f8f8

        &.selected
          height 55px
          background #fff
          box-shadow none
          color #333

      .tab:not(.selected) + .tab:not(.selected)
        position relative

        &::before
          content ''
          position absolute
          left 0
          top 10px
          bottom 10px
          width 1px
          background #ddd
          transform scaleX(0.5)
          transform-origin left

    .week-picker
      display flex
      flex-direction row
      align-items center
      justify-content center
      -webkit-user-select: none
      -moz-user-select: none
      -ms-user-select: none
      user-select: none
      padding 0 20px 20px
      // align-items center

      *:not(.prev) + *:not(.next)
        margin-left 20px

      .switch
        flex 1 1 0
        text-align left
        font-size 14px
        height 14px
        line-height 14px
        cursor pointer
        padding 10px
        flex 1 1 0
        border-radius 5px
        background #f7f7f7
        color var(--color-text-secondary)
        text-align center
        transition .2s
        white-space nowrap

        &:active
          filter brightness(0.95)

      .cur, .prev, .next
        font-size 14px
        cursor pointer
        padding 10px
        color var(--color-text-secondary)
        background #f7f7f7
        height 14px
        line-height 14px
        transition .2s
        white-space nowrap

        &:active
          filter brightness(0.95)
      
      .cur
        font-size 14px

      .prev
        border-radius 5px 0 0 5px

      .next
        border-radius 0 5px 5px 0

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
          padding 5px 0

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
          table-layout fixed

          td
            border 0.5px solid #f7f7f7

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
      padding 20px 20px 25px !important
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
