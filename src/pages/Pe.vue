<template lang="pug">

  .page(v-if='pe')
    ul.info-bar
      li.info
        .title 跑操次数
        .content {{ pe.count }}
      li.info
        .title 剩余次数
        .content {{ Math.max(0, 45 - pe.count) }}
      li.info
        .title 剩余天数
        .content {{ pe.remainDays }}
    ul.pe-list
      li.prev
        .btn(@click='prevWeek()') ‹
      li(v-for='item, i in curWeek')
        .date(:class='{ highlight: item.hasExercise }')
          span.month(v-if='i == 0') {{ item.date.getMonth() + 1 }}/
          span {{ item.date.getDate() }}
      li.next
        .btn(@click='nextWeek()') ›
    ul.detail-list
      li(v-for='item in pe.health')
        .top
          .left {{ item.name }}

          //- 有等级的时候显示分数，这样最符合数据实际情况
          .right(v-if='item.grade') {{ item.score }} 分
        .bottom
          .left {{ item.value }}
          .right {{ item.grade }}

</template>
<script>

  import api from '@/api'

  export default {
    data() {
      return {
        pe: null,
        curDate: 0
      }
    },
    persist: {
      pe: 'herald-default-pe'
    },
    async created() {
      this.curDate = new Date().getTime()
      this.pe = await api.get('/api/pe')

      if (this.pe && this.pe.detail.length) {
        this.curDate = this.pe.detail.slice(-1)[0]
      }
    },
    computed: {
      curWeek() {
        let baseDay = new Date(1970, 0, 4)
        let delta = this.curDate - baseDay
        let spare = delta % (1000 * 60 * 60 * 24 * 7)
        let firstDay = new Date(baseDay.getTime() + delta - spare)
        return [0, 1, 2, 3, 4, 5, 6].map(i => {
          let date = new Date(firstDay.getTime() + i * 1000 * 60 * 60 * 24)
          let exercises = this.pe.detail.filter(k => {
            let d = new Date(k)
            return d.getFullYear() === date.getFullYear() &&
              d.getMonth() === date.getMonth() &&
              d.getDate() === date.getDate()
          })
          let hasExercise = !!exercises.length
          return {
            date, hasExercise, exercises
          }
        })
      }
    },
    methods: {
      prevWeek() {
        this.curDate -= 1000 * 60 * 60 * 24 * 7
      },
      nextWeek() {
        this.curDate += 1000 * 60 * 60 * 24 * 7
      }
    }
  }

</script>
<style lang="stylus" scoped>

  ul.pe-list
    width 100%
    margin 15px 0
    padding 0
    display flex
    flex-direction row
    justify-content space-around
    border-top 0.5px solid var(--color-divider)
    border-bottom 0.5px solid var(--color-divider)

    -webkit-user-select: none
    -moz-user-select: none
    -ms-user-select: none
    user-select: none

    li + li
      margin-left 10px

    li
      list-style none
      flex 1 1 0
      padding 20px 0

      .btn
        cursor pointer
        color #ccc
        font-size 16px
        font-weight bold

      .date
        background var(--color-tool-bg)
        color var(--color-text-regular)
        border-radius 3px
        padding 3px 0
        text-align center
        font-size 14px

        span.month
          font-size 10px
          color #aaa

        &.highlight
          background var(--color-primary-bg)
          color var(--color-primary-dark)

</style>
