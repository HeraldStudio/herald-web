<template lang="pug">
  .page
    ul.info-bar
      li.info(:class="{ selected : iswork }" @click="switchDay") 工作日
      li.info(:class="{ selected : !iswork }" @click="switchDay") 休息日
    div.detail(v-if="iswork")
      ul.detail-list 
        li.timetable-item(:class="{active: item.active}" v-for='item in workday')
          .top
            .left.time {{item.start}}-{{item.end}}
            .right.tip {{item.interval}}
    div.detail(v-else)
      ul.detail-list  
        li.timetable-item(:class="{active: item.active}" v-for='item in holiday')
         .top
            .left.time {{item.start}}-{{item.end}}
            .right.tip {{item.interval}}
</template>
<script>
import api from "@/api";

export default {
  data() {
    return {
      iswork:true,
      now:null,
      today:null, // 当天的时间戳
      day:null, // 用来判断工作日/休息日
      current:false,
      workday: [
        {
          active:false,
          start:'7:10',
          end:'10:00',
          interval:'每 10min 一班'
        },
        {
          active:false,
          start:'10:00',
          end:'11:30',
          interval:'每 30min 一班'
        },
        {
          active:false,
          start:'11:30',
          end:'13:30',
          interval:'每 10min 一班'
        },
        {
          active:false,
          start:'13:30',
          end:'15:00',
          interval:'13:30，14:00'
        },
        {
          active:false,
          start:'16:00',
          end:'17:00',
          interval:'16:00'
        },
        {
          active:false,
          start:'17:00',
          end:'18:30',
          interval:'每 10min 一班',
        },
        {
          active:false,
          start:'18:30',
          end:'22:00',
          interval:'每 30min 一班(20:30 没有班车)',
        }
      ],
      holiday:[
        {
          active:false,
          start:'8:00',
          end:'9:30',
          interval:'每 30min 一班'
        },
        {
          active:false,
          start:'9:30',
          end:'11:30',
          interval:'每 1h 一班'
        },
        {
          active:false,
          start:'11:30',
          end:'13:30',
          interval:'每 30min 一班'
        },
        {
          active:false,
          start:'13:30',
          end:'16:30',
          interval:'每 1h 一班'
        },
        {
          active:false,
          start:'17:00',
          end:'19:00',
          interval:'每 30min 一班'
        },
        {
          active:false,
          start:'19:00',
          end:'22:00',
          interval:'每 1h 一班'
        }
      ]
    }
  },
  created () {
    this.today = new Date()
    this.now = new Date()
    this.day = this.now.getDay()
    // 判断当前是工作日还是休息日
    if ( this.day >= 1 && this.day <= 5) {
      this.iswork = true // 工作日
    }else {
      this.iswork = false // 休息日
    }
    //  判断当前时间,高亮有校车的时间段
    this.heightLight(this.workday)
    this.heightLight(this.holiday)
  },
  methods: {
    switchDay(event){
      this.iswork = !this.iswork
    },
    heightLight(array){
      let tempStart = new Date()
        ,tempEnd = new Date()
      array.forEach(item => {
        tempStart.setHours(item.start.split(':')[0])
        tempStart.setMinutes(item.start.split(':')[1])
        tempEnd.setHours(item.end.split(':')[0])
        tempEnd.setMinutes(item.end.split(':')[1])

        if( tempStart.getTime() > this.now.getTime() || this.now.getTime() > tempEnd.getTime()){
          item.active = false;
        }else{
          item.active = true;
        }
      });
    }
  }
};
</script>
<style lang="stylus" scoped>  
  .info-bar
    li.info

      &.selected
        font-weight bold

      &:not(.selected)
        background none
        color var(--color-text-bold)

        .title
          font-weight normal

  .detail
    .title
      margin 20px auto
      font-size 16px
      color var(--color-text-bold)

    ul.detail-list
      li.timetable-item
        .time
          font-size 16px
          color var(--color-primary)
        
        .tip
          font-size 13px
          font-weight normal
          color #000

      li.active
        .time
          font-weight bold
</style>
