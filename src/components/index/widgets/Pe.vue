<template lang="pug">

  .widget.pe(v-if='pe && pe.content > 0')
    .title 跑操
      .reload(@click='reload()')
    ul.info-bar
      li.info
        .title 跑操次数
        .content {{ pe.content }}
      li.info
        .title 击败人数
        .content {{ pe.rank }}%
      li.info
        .title 剩余次数
        .content {{ Math.max(0, 45 - pe.content) }}
      li.info
        .title 剩余天数
        .content {{ pe.remain }}
    ul.pe-list(v-if='pedetail')
      li.prev
        .btn(@click='prevWeek()') <

      li(v-for='item, i in curWeek')
        .date(:class='{ highlight: item.hasExercise }')
          span.month(v-if='i == 0') {{ item.date.getMonth() + 1 }}/
          span {{ item.date.getDate() }}

      li.next
        .btn(@click='nextWeek()') >

</template>
<script>

  import api from '@/api'

  export default {
    data() {
      return {
        pe: null,
        pc: null,
        pedetail: null,
        curDate: 0
      }
    },
    created() {
      this.reload()
    },
    computed: {
      curWeek() {
        let baseDay = new Date(1970, 0, 4)
        let delta = this.curDate - baseDay
        let spare = delta % (1000 * 60 * 60 * 24 * 7)
        let firstDay = new Date(baseDay.getTime() + delta - spare)
        return [0, 1, 2, 3, 4, 5, 6].map(i => {
          let date = new Date(firstDay.getTime() + i * 1000 * 60 * 60 * 24)
          let exercises = (this.pedetail || []).filter(k =>
            k.getFullYear() === date.getFullYear() &&
            k.getMonth() === date.getMonth() &&
            k.getDate() === date.getDate()
          )
          let hasExercise = !!exercises.length
          return {
            date, hasExercise, exercises
          }
        })
      }
    },
    methods: {
      async reload() {
        this.curDate = new Date().getTime()
        this.pe = (await api.post('/api/pe')).data
        this.pc = (await api.post('/api/pc')).result
        this.pedetail = (await api.post('/api/pedetail')).result.map(k => {
          let date = new Date()
          let [y, M, d] = k.sign_date.split('-').map(i => parseInt(i))
          let h = Math.floor(k.sign_time)
          let m = Math.floor(k.sign_time * 100 % 100)
          date.setFullYear(y)
          date.setMonth(M - 1)
          date.setDate(d)
          date.setHours(h)
          date.setMinutes(m)
          date.setSeconds(0)
          date.setMilliseconds(0)
          return date
        }).sort((a, b) => a - b)

        if (this.pedetail.length) {
          this.curDate = this.pedetail.slice(-1)[0].getTime()
        }
      },
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
    margin 15px 0 0
    padding 0
    display flex
    flex-direction row
    justify-content space-around
    border-top 1px solid var(--color-divider)

    -webkit-user-select: none
    -moz-user-select: none
    -ms-user-select: none
    user-select: none

    li + li
      margin-left 10px

    li
      list-style none
      flex 1 1 0
      padding-top 20px

      .btn
        color var(--color-primary)
        padding 3px 5px
        text-align center
        font-size 14px
        cursor pointer

      .date
        background var(--color-tool-bg)
        color var(--color-text-regular)
        padding 3px 0
        text-align center
        font-size 14px

        span.month
          font-size 10px
          color #aaa

        &.highlight
          background var(--color-primary)
          color #fff

</style>
