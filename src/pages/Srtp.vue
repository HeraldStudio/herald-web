<template lang="pug">

  .page
    div(v-if='srtp')
      .info-bar
        button.info
          .title SRTP学分
          .content {{ srtp.info.points }}
        button.info
          .title SRTP状态
          .content {{ srtp.info.grade }}
      ul.detail-list
        li(v-for='k in srtp.projects')
          .top
            .left {{ k.project }}
          .bottom
            .left {{ k.credit + (k.proportion !== 1 ? ' (' + k.proportion * 100 + '%)' : '') }}
            .right {{ formatDate(k.date) + ' · ' + k.type }}
      div.svg_container#d3

</template>
<script>

  import api from '@/api'
  import formatter from '@/util/formatter'

  function render_d3(data,div="#d3"){

    // 演示未完成学分用测试数据
    //data=[{project:"Alexander",credit:0.2},{project:"Bob",credit:0.3},{project:"Charlie",credit:0.4}]

    const TOTAL_CREDITS=2;

    let remained_credits=TOTAL_CREDITS;
    for(let i in data){
      remained_credits-=data[i].credit;
    }

    if(remained_credits>0){
      data.push({
        project:"未完成学分",
        credit:remained_credits,
        is_remained:true
      });
    }

    let R=240;
    let r=R/2;

    $(div).empty();

    let svg=d3.select("#d3")
              .append("svg")
              .attr("width",R)
              .attr("height",R)
              .append("g")
              .attr("transform","translate("+r+","+r+")");

    let pie=(d3.pie().value(function(d){return d.credit}));
    let pie_data=pie(data);

    let arc=d3.arc().innerRadius(r*0.6).outerRadius(r*0.9);

    let color=d3.scaleSequential()
                .domain([0,data.length-1])
                .interpolator(d3.interpolateViridis);

    const REMAINED_COLOR="#ddd";

    // 绘制饼图
    svg.selectAll("slice")
       .data(pie_data)
       .enter()
       .append("path")
       .attr("d",arc)
       .attr("stroke","black")
       .attr("fill",function(d){return (d.data.is_remained)?(REMAINED_COLOR):(color(d.index))})
       .attr("stroke-width","2px")
       .attr("opacity",0.65);

    const LABLE_R=20;
    const LABLE_r=LABLE_R/2;

    // 绘制注记
    let lables=d3.select("#d3")
                 .append("div")
                 .selectAll("div")
                 .data(pie_data)
                 .enter()
                 .append("div")
                 .style("margin-bottom",10+"px");

    lables.append("svg")
          .attr("width",LABLE_R+10).attr("height",LABLE_R)
          .style("vertical-align","middle")
          .append("circle")
          .attr("cx",LABLE_r).attr("cy",LABLE_r).attr("r",LABLE_r)
          .attr("fill",function(d){return (d.data.is_remained)?(REMAINED_COLOR):(color(d.index))})
          .attr("opacity",0.65);

    lables.append("span")
          .text(function(d){return d.data.project});
  }

  export default {
    data() {
      return {
        srtp: null
      }
    },
    persist: {
      srtp: 'herald-default-srtp'
    },
    async created() {
      this.srtp = await api.get('/api/srtp')
    },
    watch:{
      srtp(val) {
        render_d3(val.projects)
      }
    },
    methods: {
      formatDate(d) {
        return formatter.formatYearAndMonth(d)
      }
    }
  }

</script>
<style>
.svg_container{
  text-align: center;
}
</style>
