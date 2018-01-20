<template lang="pug">
   
  .widget.lecture
    .title
      .zh 人文讲座
      .en Cultural lecture
      .reload(@click='reload()')
    .empty(v-if='!lectures')
      .zh 加载中
      .en Loading...
    ul.info-bar
      li.info
        .title
          .zh 已听讲座次数
          .en Lectures taken
        .content {{ lectures.length }}
      li.info
        .title
          .zh 剩余讲座次数
          .en Remaining lecs.
        .content {{ Math.max(0, 8 - lectures.length) }}
    ul.detail-list
      li(v-for='item in lectures')
        .top
          .left {{ item.date }}
          .right {{ item.place }}
   
</template>
<script>

  import api from '../../api'
  import formatter from "../../util/formatter";

  export default {
    data() {
      return {
        lectures: null
      }
    },
    created() {
      this.reload()
    },
    methods: {
      async reload() {
        this.lectures = (await api.post('/api/lecture')).data.content.detial
        this.lectures = this.lectures.map(k => {
          let [y, M, d, h, m, s] = k.date.split(/[- :]/g)
          let date = new Date(y, M - 1, d)
          date.setHours(h)
          date.setMinutes(m)
          date.setSeconds(s)
          k.date = formatter.formatTimeNatural(date)
          return k
        })
      }
    }
  }
  
</script>