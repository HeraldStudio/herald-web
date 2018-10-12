<template lang="pug">
  .page
    ul.info-bar
      li.info(v-bind:class="{ active : iswork }" @click="switchDay") 工作日
      li.info(v-bind:class="{ active : !iswork }" @click="switchDay") 休息日
    div.detail(v-if="iswork")
      h3.title 前往地铁站
      ul.detail-list 
        li.timetable-item(v-bind:class="{active: item.active}" v-for='item in workday.go')
          .top
            .left.time {{item.start}}-{{item.end}}
            .right.tip {{item.interval}}
      h3.title 返回九龙湖
      ul.detail-list 
        li.timetable-item(v-bind:class="{active: item.active}" v-for='item in workday.back')
          .top
            .left.time {{item.start}}-{{item.end}}
            .right.tip {{item.interval}}
    div.detail(v-else)
      h3.title 前往地铁站
      ul.detail-list  
        li.timetable-item(v-bind:class="{active: item.active}" v-for='item in holiday.go')
         .top
            .left.time {{item.start}}-{{item.end}}
            .right.tip {{item.interval}}
      h3.title 返回九龙湖
      ul.detail-list  
        li.timetable-item(v-bind:class="{active: item.active}" v-for='item in holiday.back')
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
      workday: {
        go: [
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
        back:[
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
            interval:'每 10min 一班'
          },
          {
            active:false,
            start:'18:30',
            end:'22:00',
            interval:'每 30min 一班(20:30 没有班车)'
          }
        ]
      },
      holiday: {
        go:[
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
        ],
        back:[
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
      this.iswork = false　// 休息日
    }
    //  判断当前时间,高亮有校车的时间段
    this.heightLight(this.workday.go)
    this.heightLight(this.workday.back)
    this.heightLight(this.holiday.go)
    this.heightLight(this.holiday.back)
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

    .info.active
      background-color var(--color-primary)
      color #ffffff
      transition background .3s, color .3s

  .detail
    h3.title
      margin 22px auto
      font-size 17px  

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
