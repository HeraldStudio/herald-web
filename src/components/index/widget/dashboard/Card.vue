<template lang="pug">

  item(title='一卡通' name='余额' :value='card && card.info && card.info.balance')
    div(v-if='card')
      ul.info-bar
        li.info
          .title 卡余额
          .content {{ card.info.balance }}
        li.info
          .title 今日消费次数
          .content {{ card.detail.length }}
        li.info.charge
          drawer(title='一卡通充值')
            .title 充值
            .content(slot='content')
              .amount-select
                .amount(v-for='amount in [50, 100, 200, 300, 500]' :class='{ selected: charge.amount === amount }' @click='charge.amount = amount') {{ amount }}
              input(placeholder='金额' v-model='charge.amount')
              input.password(placeholder='六位查询密码' type='password' v-model='charge.password')
              button(@click.stop='confirmCharge()') 确认充值
      ul.detail-list
        li(v-for='item in card.detail')
          .top
            .left {{ item.desc }}
          .bottom
            .left {{ item.amount.toFixed(2) }}
            .right {{ formatTimeNatural(item.time) }}
        li.prev-day
          .hint {{ formatDateNatural(oldestDate) }}至今 总支出 {{ totalPayments.toFixed(2) }}
          button(@click.stop='loadPrevDay()' :class='{ loading: loading }') {{ loading ? '...' : '加载前一天' }}

</template>
<script>

  import H from '@/api'
  import formatter from '@/util/formatter'
  import item from '../DashboardItem.vue'
  import drawer from '@/components/Drawer.vue'

  export default {
    components: {
      item, drawer
    },
    data() {
      return {
        card: null,
        oldestDate: null,
        loading: false,
        charge: {
          amount: 100,
          password: ''
        }
      }
    },
    created() {
      this.oldestDate = new Date().getTime()
      this.reload()
    },
    computed: {
      totalPayments () {
        if (!this.card) {
          return 0
        }
        return Math.abs(this.card.detail.map(k => k.amount).filter(k => k < 0).reduce((a, b) => a + b, 0))
      }
    },
    methods: {
      ...formatter,
      async reload() {
        this.card = await H.api.card()
      },
      async loadPrevDay() {
        this.loading = true
        try {
          let prevDayTimestamp = this.oldestDate - 1000 * 60 * 60 * 24
          let prevDay = new Date(prevDayTimestamp)
          let prevDayName = `${prevDay.getFullYear()}-${prevDay.getMonth() + 1}-${prevDay.getDate()}`
          let res = await H.api.card({ date: prevDayName })
          if (res) {
            this.card.detail = this.card.detail.concat(res.detail)
            this.oldestDate = prevDayTimestamp
          }
        } finally {
          this.loading = false
        }
      },
      changeAmount(ev) {
        this.charge.amount = ev.target.value
      },
      async confirmCharge() {
        this.$toasted.show('正在处理，请稍候…')
        let res = await H.api.card.put(this.charge)
        this.$toasted.show(res)
      }
    }
  }

</script>
<style lang="stylus" scoped>

  ul.detail-list li.prev-day
    display flex
    flex-direction row !important
    align-items center
    justify-content center

    padding-top 20px !important
    font-size 14px
    color var(--color-text-secondary)

    * + *
      margin-left 10px

    button
      cursor pointer

      &.loading
        pointer-events none

  .charge

    .content
      display flex
      flex-direction column
      align-items center

      > * + *
        margin-top 10px

      .amount-select
        width 100%
        display flex
        flex-direction row
        flex-wrap wrap
        justify-content center
        margin-bottom 15px

        *
          flex 1 1 0
          width 0
          display flex
          align-items center
          justify-content center
          text-align center
          color #333
          padding 10px 0
          border-radius 3px
          border 1px solid var(--color-divider)

          &.selected
            border 1px solid var(--color-primary)
            color var(--color-primary)

          + *
            margin-left 5px

      input
        text-align center

</style>
