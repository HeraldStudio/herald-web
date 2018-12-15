<template lang="pug">

  .page.cet
    ul.detail-list
      li(v-for='item in displayData')
        .top
          .left {{ item.name }}
          .right {{ item.value }}
      li.empty(v-if='!displayData') 暂无考试信息

</template>
<script>

  import api from '@/api'
  import formatter from '../util/formatter'

  export default {
    data() {
      return {
        cet: null
      }
    },
    persist: {
      cet: 'herald-default-cet'
    },
    async created() {
      this.cet = await api.get('/api/cet')
    },
    computed: {
      displayData() {
        return this.cet && [
          {
            name: '考试类别',
            value: this.cet.examType
          },
          {
            name: '准考证号',
            value: this.cet.ticketNo
          },
          {
            name: '考试时间',
            value: formatter.formatTime(this.cet.examTime, 'yyyy/M/d H:mm')
          },
          {
            name: '考试地点',
            value: this.cet.location
          },
          {
            name: '考场号',
            value: this.cet.roomNo
          },
          {
            name: '座位号',
            value: this.cet.seatNo
          }
        ]
      }
    }
  }

</script>