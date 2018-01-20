<template lang="pug">
   
  .widget.card
    .title
      .zh 一卡通
      .en ID card
      .reload(@click='reload()')
    .empty(v-if='!card')
      .zh 加载中
      .en Loading...
    ul.info-bar
      li.info
        .title
          .zh 一卡通余额
          .en Balance
        .content {{ card.left }}
      li.info
        .title
          .zh 一卡通状态
          .en State
        .content {{ card.state }}
      li.info
        .title
          .zh 今日消费次数
          .en Payments today
        .content {{ card.detail.length }}
    ul.detail-list
      li(v-for='item in card.detail')
        .top
          .left {{ item.system || item.type }}
          .right {{ item.system && item.type }}
        .bottom
          .left {{ item.date }}
          .right {{ item.price }}
   
</template>
<script>

  import api from '../../api'
  import formatter from "../../util/formatter";

  export default {
    data() {
      return {
        card: null
      }
    },
    created() {
      this.reload()
    },
    methods: {
      async reload() {
        this.card = (await api.post('/api/card', { timedelta: 1 })).data.content
        if (typeof this.card !== 'object') {
          this.card = null
          return
        }
        this.card.detail = this.card.detail.map(k => {
          let [y, M, d, h, m, s] = k.date.split(/[\/ :]/g)
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