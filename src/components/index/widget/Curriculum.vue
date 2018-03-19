<template lang="pug">

  widget.curriculum(title='课程表' :show='curriculum')
    .week-picker
      .prev-week(@click='prevWeek()') <
      .cur-week 第 {{ displayWeek }} 周
      .next-week(@click='nextWeek()') >
    .week-header
      .weekday(v-for='item in "一二三四五六日"') {{ item }}
    .curriculum-list(v-if='displayClasses' :class='{ empty: !displayClasses.length }')
      table.block-bg
        tr(v-for='_ in 13')
          td(v-for='_ in 7')
      .block(v-for='item in displayClasses' v-if='item.dayOfWeek'
        :style="'left: ' + (item.dayOfWeek - 1) / 7 * 100 + '%; top: ' + (item.beginPeriod - 1) / 13 * 99.5 + '%; height: ' + (item.endPeriod - item.beginPeriod + 1) / 13 * 99.5 + '%'")
        .name {{ item.courseName }}
        .teacher {{ item.teacherName }}
        .place {{ item.location }}
      .empty(v-if='!displayClasses.length') 暂无课程
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
        term: null,
        curriculum: null,
        displayWeek: 1,
        currentWeek: 1,
        currentDayOfWeek: 1
      }
    },
    created() {
      this.reload()
    },
    methods: {
      async reload() {
        let { curriculum, term } = await H.api.curriculum()
        this.curriculum = curriculum
        this.term = term

        if (term.startDate) {
          let now = new Date()
          this.currentWeek = Math.max(1, Math.ceil((now.getTime() - term.startDate) / (1000 * 60 * 60 * 24 * 7)))
          this.currentDayOfWeek = (now.getDay() + 6) % 7 + 1
          this.displayWeek = this.currentWeek
        } else {
          this.currentWeek = 1
          this.currentDayOfWeek = 0
          this.displayWeek = this.currentWeek
        }
      },
      prevWeek() {
        if (this.displayWeek > 1) {
          this.displayWeek -= 1
        }
      },
      nextWeek() {
        if (this.displayWeek < this.term.maxWeek) {
          this.displayWeek += 1
        }
      }
    },
    computed: {
      displayClasses() {
        return this.curriculum && this.curriculum.filter(k =>
          k.beginWeek <= this.displayWeek &&
          k.endWeek >= this.displayWeek &&
          this.displayWeek % 2 !== ['odd', 'even'].indexOf(k.flip)
        )
      },
      floatClasses() {
        return this.displayClasses && this.displayClasses.filter(k => !k.dayOfWeek)
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
      justify-content space-between
      -webkit-user-select: none
      -moz-user-select: none
      -ms-user-select: none
      user-select: none
      padding 20px 15px
      align-items center

      .cur-week
        font-size 14px
        font-weight bold
        padding 3px 7px
        border-radius 3px
        color var(--color-primary-dark)
        background var(--color-primary-bg)

      .prev-week, .next-week
        cursor pointer

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

    .detail-list
      padding 20px 25px 25px !important
      box-sizing border-box

      .hint
        font-size 14px
        color #888
        margin-bottom 3px

    .curriculum-list
      height 432px
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
        border 1px solid #f0f0f0

        td
          border 1px solid #f0f0f0

      &.empty
        height 70px

      .block
        position absolute
        overflow hidden
        box-sizing border-box
        margin 0 -1px -1px 0
        width 14%
        line-height 1.3em
        background #fff
        border-top 1px solid var(--color-primary)
        box-shadow 0 1px 3px rgba(0, 0, 0, .1)
        display flex
        flex-direction column
        align-items center
        justify-content space-between
        text-align center
        font-size 11px
        color var(--color-text-regular)

        .name
          flex 0 1 auto
          font-weight bold
          color var(--color-primary)
          padding 2px
          width 100%

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

</style>
