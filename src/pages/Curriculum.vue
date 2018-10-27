<template lang="pug">

  .page.curriculum.curriculum-page(v-if='curriculum' :class='{ stale: curriculum && curriculum.isStale }')
    .week-picker
      .prev(@click='prevTerm()') ‹
      button.cur(title='点击回到本学期' @click='displayTerm = currentTerm') {{ `${displayTerm} 学期` }}
      .next(v-if='!listView' @click='nextTerm()') ›
    ul.detail-list
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

      // 不要根据返回的 current 来判断显示哪个学期，而是找结束时间大于当前时间的最早学期来显示，这样对于假期期间的情况也适合
      let now = Date.now()
      this.term = await api.get('/api/term')
      this.term.list.sort((a, b) => a.endDate - b.endDate)
      this.currentTerm = this.term.list.find(k => k.endDate > now).name
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
        this.curriculum = await api.get('/api/curriculum', { term: this.displayTerm })
      }
    },
    methods: {
      prevTerm() {
        let term = this.term.list.map(k => k.name)
        // JS 取模是对绝对值取模保留符号，所以要先加上 length 保证结果为正
        this.displayTerm = term[(term.indexOf(this.displayTerm) + term.length - 1) % term.length]
      },
      nextTerm() {
        let term = this.term.list.map(k => k.name)
        this.displayTerm = term[(term.indexOf(this.displayTerm) + 1) % term.length]
      }
    },
    computed: {
      allClasses() {
        let now = Date.now()
        let allClasses = {}
        this.curriculum.curriculum.forEach(k => {
            allClasses[`${k.courseName}-${k.teacherName}`] = k
        })
        let result = []
        Object.keys(allClasses).forEach( k=> {
            result.push(allClasses[k])
        })
        return result
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

  .curriculum-page
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

      .term-hint
        text-align left
        font-size 15px
        font-weight bold
        color var(--color-text-bold)

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