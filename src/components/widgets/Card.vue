<template lang="pug">

  .widget.card
    .title
      .zh 一卡通
      .en ID card
      .reload(@click='reload()')
    .empty(v-if='!card')
      .zh 加载中
      .en Loading...
    div(v-else)
      ul.info-bar
        li.info
          .title
            .zh 一卡通余额
            .en Balance
          .content {{ card.info.balance }}
        li.info
          .title
            .zh 一卡通状态
            .en State
          .content {{ card.info.status.mainStatus }}
        li.info
          .title
            .zh 今日消费次数
            .en Payments today
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

  import H from '../../api'
  import formatter from '../../util/formatter'

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
