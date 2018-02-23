<template lang="pug">

  .widget.card
    .title 一卡通
      .reload(@click='reload()')
    .empty(v-if='!card') 加载中
    div(v-else)
      ul.info-bar
        li.info
          .title 卡余额
          .content {{ card.info.balance }}
        li.info
          .title 卡状态
          .content {{ card.info.status.mainStatus }}
        li.info
          .title 今日消费次数
          .content {{ card.detail.length }}
      ul.detail-list
        li(v-for='item in card.detail')
          .top
            .left {{ item.desc }}
          .bottom
            .left {{ formatTimeNatural(item.time) }}
            .right {{ item.amount }}

</template>
<script>

  import H from '@/api'
  import formatter from '@/util/formatter'

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
      ...formatter,
      async reload() {
        this.card = await H.api.card()
      }
    }
  }

</script>
