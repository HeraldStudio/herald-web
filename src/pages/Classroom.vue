<template lang="pug">

  .page
    ul.query-bar
      li
        .picker
          //- 校区切换器
          .prev ‹
          .cur {{ campus[displayCampus].name }}
          .next ›

          //- 教学楼切换器
          .prev(@click='prevBuilding()') ‹
          .cur {{ building[displayBuilding].name }}
          .next(@click='nextBuilding()') ›
      li
        .picker
          //- 学期切换器
          .prev(@click='prevTerm()') ‹
          .cur(title='点击回到本学期' @click='displayTerm = currentTerm') {{ term[displayTerm].name }} 
          .next(@click='nextTerm()') ›    
      li
        .picker
          //- 周次切换器
          .prev(@click='prevWeek()') ‹
          .cur(title='点击回到本周' @click='displayWeek = currentWeek') 第 {{ displayWeek }} 周
          .next(@click='nextWeek()') ›

          //- 星期切换器
          .prev(@click='prevDay()') ‹
          .cur(title='点击回到当天' @click='displayDay = currentDay') 星期{{ days[displayDay] }} 
          .next(@click='nextDay()') ›
      li
        .picker
          //- 节次切换器
          .prev(@click='prevStartSeq()') ‹
          .cur 第{{ startSequence }}节
          .next(@click='nextStartSeq()') ›

          .cur(style='margin-left:15px') -

          .prev(@click='prevEndSeq()') ‹
          .cur 第{{ endSequence }}节
          .next(@click='nextEndSeq()') ›
      li
        button(style='margin-top:5px' @click='search') 查询

    ul.detail-list
      li(v-for='item in classroom')
        .top
          .left {{ item.name }}
          .right 座位数：{{ item.seatCount }}
      li.empty(v-if='isInit') 
      li.empty(v-else-if='!classroom.length') 该时间段这栋楼没有空教室……
      

</template>
<script>

  import api from '@/api'
  import formatter from '@/util/formatter'

  export default {
    data() {
      return {
        // 是否初次进入该页面，决定ul为空时的placeholder
        isInit: true,

        classroom: [],
        campus: [],
        building: [],
        term: [],
        days: ['', '一', '二', '三', '四', '五', '六', '日'],

        displayCampus: 0,
        displayBuilding: 0,
        displayTerm: 0,
        displayWeek: 1,
        displayDay: 1,

        startSequence: 1,
        endSequence: 1,

        currentTerm: 0,
        currentWeek: 1,
        currentDay: 1  
      }
    },
    async created() {
      let now = new Date()
      // 目前没有别的校区，直接初始化九龙湖的
      this.campus = [{id: 22, name: '九龙湖'}] // await api.get('api/classroom/campus')
      this.building = await api.get('api/classroom/building')
      // 查询到的学期数据里面，“2018-19暑假”的起始时间错误，暂时删除这一项
      this.term = (await api.get('api/classroom/term')).reverse().slice(1)

      this.displayTerm = this.currentTerm = this.term.findIndex(k => k.endDate.time > now.getTime() && k.startDate.time < now)
      this.displayWeek = this.currentWeek = Math.ceil((now.getTime() - this.term[this.currentTerm].startDate.time) / (1000 * 60 * 60 * 24 * 7))
      this.displayDay = this.currentDay = (now.getDay() + 6) % 7 + 1
    },
    methods: {
      ...formatter,
      prevBuilding() {
        if (this.displayBuilding > 0) {
          this.displayBuilding -= 1
        }
      },
      nextBuilding() {
        if (this.displayBuilding < this.building.length - 1) {
          this.displayBuilding += 1
        }
      },
      prevTerm() {
        if (this.displayTerm > 0) {
          this.displayTerm -= 1
        }
      },
      nextTerm() {
        if (this.displayTerm < this.term.length - 1) {
          this.displayTerm += 1
        }
      },
      prevWeek() {
        if (this.displayWeek > 1) {
          this.displayWeek -= 1
        }
      },
      nextWeek() {
        if (this.displayWeek < this.term[this.displayTerm].endWeek) {
          this.displayWeek += 1
        }
      },
      prevDay() {
        if (this.displayDay > 1) {
          this.displayDay -= 1
        }
      },
      nextDay() {
        if (this.displayDay < 7) {
          this.displayDay += 1
        }
      },
      prevStartSeq() {
        if (this.startSequence > 1) {
          this.startSequence -= 1
        }
      },
      nextStartSeq() {
        if (this.startSequence < 13) {
          this.startSequence += 1
          this.endSequence = this.endSequence < this.startSequence ? this.startSequence : this.endSequence
        }
      },
      prevEndSeq() {
        if (this.endSequence > 1) {
          this.endSequence -= 1
          this.startSequence = this.startSequence > this.endSequence ? this.endSequence : this.startSequence
        }
      },
      nextEndSeq() {
        if (this.endSequence < 13) {
          this.endSequence += 1
        }
      },
      async search() {
        this.classroom = await api.get('api/classroom', {
            campusId: this.campus[this.displayCampus].id,
            buildingId: this.building[this.displayBuilding].id,
            termId: this.term[this.displayTerm].id,
            startWeek: this.displayWeek,
            endWeek: this.displayWeek,
            dayOfWeek: this.displayDay,
            startSequence: this.startSequence,
            endSequence: this.endSequence
          })
      }
    }
  }

</script>
<style lang="stylus" scoped>

  .picker
    display flex
    flex-direction row
    align-items center
    justify-content center
    -webkit-user-select: none
    -moz-user-select: none
    -ms-user-select: none
    user-select: none
    padding 0 20px 15px 20px

    *:not(.prev) + *:not(.next)
      margin-left 15px

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
      padding 8px
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

  ul.query-bar
    display flex
    flex-direction column !important
    align-items center
    justify-content center

    padding 0 0 20px 0
    font-size 14px
    color var(--color-text-secondary)

    li
      list-style-type none

</style>
