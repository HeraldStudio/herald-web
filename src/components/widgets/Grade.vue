<template lang="pug">

  .widget.grade
    .title
      .zh 成绩
      .en GPA
      .reload(@click='reload()')
    .empty(v-if='!grade')
      .zh 加载中
      .en Loading...
    ul.info-bar
      li.info
        .title
          .zh 当前绩点
          .en Current GPA
        .content {{ grade[0].gpa || '未计算' }}
      li.info
        .title
          .zh 首修绩点
          .en GPA without revamp
        .content {{ grade[0]['gpa without revamp'] || '未计算' }}
      li.info(v-if="grade[0]['calculate time']")
        .title
          .zh 计算时间
          .en Calculation time
          span {{ grade[0]['calculate time'] }}
    ul.detail-list
      li(v-for='k in grade.slice(1)' v-if='k.semester == grade[1].semester')
        .top
          .left {{ k.name }}
        .bottom
          .left {{ k.semester + ' ' + k.type + ' ' + k.credit + '学分' }}
          .right {{ '成绩：' + k.score }}

</template>
<script>

  import api from '../../api'
  import formatter from "../../util/formatter";

  export default {
    data() {
      return {
        grade: null
      }
    },
    created() {
      this.reload()
    },
    methods: {
      async reload() {
        this.grade = (await api.post('/api/gpa')).data.content
      }
    }
  }
  
</script>