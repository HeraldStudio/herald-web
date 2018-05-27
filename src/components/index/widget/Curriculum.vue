<template lang="pug">

  widget.curriculum(title='课程表' :show='curriculum')
    .week-picker
      .prev(@click='prevTerm()') ‹
      .cur(title='点击回到本学期' @click='reload()') {{ curriculum.term && curriculum.term.code || '…' }}
      .next(@click='nextTerm()') ›
      .prev(@click='prevWeek()') ‹
      .cur(title='点击回到本周' @click='displayWeek = currentWeek') 第 {{ displayWeek }} 周
      .next(@click='nextWeek()') ›
    div.curriculum-container
      .week-header(v-if='fixedClasses.length || !floatClasses.length')
        .weekday(v-for='(item, i) in "一二三四五六日"' v-if="i < weekdayCount" :class='{ current: displayWeek == currentWeek && i + 1 == currentDayOfWeek }') {{ item }}
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
    ul.detail-list(v-if='floatClasses && floatClasses.length')
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
  import widget from './Widget.vue'
  import drawer from '@/components/Drawer.vue'

  export default {
    components: { widget, drawer },
    data() {
      return {
        term: [],
        curriculum: {
          curriculum: [],
          term: {}
        },
        displayWeek: 1,
        currentWeek: 1,
        currentDayOfWeek: 1
      }
    },
    persist: {
      curriculum: 'herald-default-curriculum', 
      term: 'herald-default-term'
    },
    created() {
      this.reload()
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
      }
    },
    methods: {
      async reload(preferredTerm = '') {
        this.term = await H.api.term()
        this.curriculum = await H.api.curriculum({ term: preferredTerm })
      },
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
        this.reload(term[(term.indexOf(this.curriculum.term.code) - 1) % term.length])
      },
      nextTerm() {
        let term = this.term.map(k => k.name)
        this.reload(term[(term.indexOf(this.curriculum.term.code) + 1) % term.length])
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
      justify-content space-around
      -webkit-user-select: none
      -moz-user-select: none
      -ms-user-select: none
      user-select: none
      padding 20px 15px
      align-items center

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
            border-bottom 1px solid var(--color-primary)

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
            border 1px solid #f0f0f0

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
          border-top 1px solid var(--color-primary)
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

      .hint
        font-size 14px
        color #888
        margin-bottom 3px

</style>
