<template lang="pug">
  .page.bus
    ul.info-bar
      button.info(:class='{ selected: iswork }' @click="!iswork && switchDay()") 工作日
      button.info(:class='{ selected: !iswork }' @click="iswork && switchDay()") 休息日
    ul.detail-list(v-if="iswork")
      li.info(:class="{active: item.active}" v-for='item in workday')
        .top
          .left.time
            span {{item.start}}
            span(v-if="item.start !== item.end") -{{item.end}}
          .right.tip {{item.interval}}
    ul.detail-list(v-else)
      li.info(:class="{active: item.active}" v-for='item in holiday')
        .top
          .left.time
            span {{item.start}}
            span(v-if="item.start !== item.end") -{{item.end}}
          .right.tip {{item.interval}}
    div.svg_container#d3
</template>
<script>
import api from "@/api";

// 校车班次数据
const DATA = {
  WORKDAY:[
    {from:{h:7,m:10},to:{h:7,m:40},density:10},
    {from:{h:7,m:40},to:{h:8,m:40},density:5},
    {from:{h:8,m:40},to:{h:10,m:0},density:5},
    {from:{h:10,m:30},to:{h:11,m:30},density:30},
    {from:{h:11,m:30},to:{h:13,m:30},density:10},
    {from:{h:13,m:30},to:{h:13,m:30},density:0},
    {from:{h:14,m:0},to:{h:14,m:0},density:0},
    {from:{h:15,m:0},to:{h:16,m:0},density:10},
    {from:{h:17,m:0},to:{h:18,m:30},density:10},
    {from:{h:18,m:30},to:{h:20,m:0},density:30},
    {from:{h:21,m:0},to:{h:22,m:0},density:30}
  ],
  HOLIDAY:[
    {from:{h:8,m:0},to:{h:9,m:30},density:30},
    {from:{h:10,m:30},to:{h:10,m:30},density:0},
    {from:{h:11,m:30},to:{h:11,m:30},density:0},
    {from:{h:12,m:0},to:{h:13,m:30},density:30},
    {from:{h:13,m:30},to:{h:16,m:30},density:60},
    {from:{h:16,m:30},to:{h:19,m:0},density:30},
    {from:{h:19,m:0},to:{h:22,m:30},density:60}
  ]
}

function get_current_minut_of_day() {
  let now=new Date();
  return (now.getHours()*60+now.getMinutes());
}

function render_d3(data,current=get_current_minut_of_day(),div="#d3") {

  // 把每一天看作24*60分钟
  let time=[]
  for(let i=0;i<data.length;i++){
    let d=data[i];
    for(let v=(d.from.h*60+d.from.m);v<=(d.to.h*60+d.to.m);v+=d.density){
      if(time.indexOf(v)<0){
        time.push(v);
      }
      if(d.density<=0){
        break;
      }
    }
  }

  const WIDTH=300;
  const HEIGHT=80;
  const MARGIN={TOP:10,BOTTOM:10,LEFT:10,RIGHT:10};

  $(div).empty();

  let svg=d3.select(div)
            .append("svg")
            .attr("width",WIDTH+MARGIN.LEFT+MARGIN.RIGHT)
            .attr("height",HEIGHT+MARGIN.TOP+MARGIN.BOTTOM)
            .append("g")
            .attr("transform","translate("+MARGIN.LEFT+","+MARGIN.TOP+")");

  let x=d3.scaleLinear()
          .domain([current-15,current+15])
          .range([0,WIDTH]);

  svg.append("defs").append("marker")
     .attr("id","arrow")
     .attr("markerUnits","strokeWidth")
     .attr("markerWidth","12")
     .attr("markerHeight","12")
     .attr("viewBox","0 0 12 12")
     .attr("refX","6")
     .attr("refY","6")
     .attr("orient","6")
     .append("path")
     .attr("d","M2,2 L10,6 L2,10 L6,6 L2,2")
     .attr("fill","#555");

  // 绘制坐标轴
  svg.append("g")
     .append("line")
     .attr("x1",0).attr("x2",WIDTH)
     .attr("y1",HEIGHT/2).attr("y2",HEIGHT/2)
     .attr("stroke","#555")
     .attr("stroke-width",2)
     .attr("marker-end","url(#arrow)");

  const FADE_MARGIN=25;

  // 绘制代表班车时刻的圆点
  svg.append("g")
     .selectAll("dot")
     .data(time)
     .enter()
     .append("circle")
     .attr("cx",function(d){return x(d)})
     .attr("cy",HEIGHT/2)
     .attr("r",8)
     .attr("stroke","#555")
     .attr("stroke-width",3)
     .attr("fill","white")
     .attr("opacity",function(d){return ((x(d)>(WIDTH-FADE_MARGIN)||x(d)<FADE_MARGIN)?("0"):("1"))});

  // 绘制班车时刻的文字
  svg.append("g")
     .selectAll("dot_text")
     .data(time)
     .enter()
     .append("text")
     .text(function(d){return Math.floor(d/60)+":"+("0"+d%60).slice(-2)})
     .attr("x",function(d){return x(d)})
     .attr("y",(HEIGHT/2)-15)
     .attr("text-anchor","middle")
     .attr("font-size",18)
     .attr("opacity",function(d){return ((x(d)>(WIDTH-FADE_MARGIN)||x(d)<FADE_MARGIN)?("0"):("1"))});

  // 绘制代表当前时间的标记
  svg.append("g")
     .append("polygon")
     .attr("fill","#00a4ca")
     .attr("stroke-width",0)
     .attr("points",(WIDTH/2)+","+(HEIGHT/2)+" "+(WIDTH/2-10)+","+(HEIGHT/2+15)+" "+(WIDTH/2+10)+","+(HEIGHT/2+15));

  // 绘制当前时间的文字
  svg.append("g")
     .append("text")
     .text(function(d){return Math.floor(current/60)+":"+("0"+current%60).slice(-2)})
     .attr("x",WIDTH/2)
     .attr("y",(HEIGHT/2)+30)
     .attr("text-anchor","middle")
     .attr("font-size",18);
}

// 把新格式的校车班次数据适配为旧形式的校车班次数据以供界面渲染
function bus_data_adapter(data) {
  return data.map((d)=>({
      active:false,
      start:d.from.h+':'+('0'+d.from.m).slice(-2),
      end:d.to.h+':'+('0'+d.to.m).slice(-2),
      interval:(d.density>0)?('每 '+d.density+'min 一班'):('')
    }))
}

export default {
  data() {
    return {
      iswork:true,
      now:null,
      today:null, // 当天的时间戳
      day:null, // 用来判断工作日/休息日
      current:false,
      workday: bus_data_adapter(DATA.WORKDAY),
      holiday:bus_data_adapter(DATA.HOLIDAY)
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
  mounted () {
    // 渲染由d3.js库绘制的数据可视化图形
    render_d3((this.iswork)?(DATA.WORKDAY):(DATA.HOLIDAY));
    // 随时间刷新
    let last=get_current_minut_of_day();
    setInterval(()=>{
      let current=get_current_minut_of_day();
      if(current!=last){
        last=current;
        render_d3((this.iswork)?(DATA.WORKDAY):(DATA.HOLIDAY));
      }
    },1*1000);
  },
  watch:{
    iswork(is) {
      render_d3((is)?(DATA.WORKDAY):(DATA.HOLIDAY))
    }
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
  .page.bus
    .title
      margin 20px auto
      font-size 16px
      color var(--color-text-bold)

    ul.detail-list
      li.info
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

  .svg_container
    text-align center

  .tooltip
    position absolute
    opacity 0
    background-color #fff
    border #000 2px solid
    border-radius 5px
    padding 5px
</style>
