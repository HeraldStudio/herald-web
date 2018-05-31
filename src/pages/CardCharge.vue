<template lang="pug">

  .page
    p.hint.
      一卡通在线预充值并非实时到账，在校内多数食堂超市网点刷卡时均可到账；
      极少数情况不能到账时，你也可以手动在圈存机存入任意金额；
      本功能仅在银行卡与学校一卡通中心之间产生交易，与小猴偷米无关。
    .amount-select
      .amount(v-for='amount in [50, 100, 200, 300, 500]' :class='{ selected: charge.amount === amount }' @click='charge.amount = amount') {{ amount }}
    input(placeholder='金额' v-model='charge.amount')
    input.password(placeholder='六位查询密码' type='password' v-model='charge.password')
    button(@click='confirmCharge()') 确认充值

</template>
<script>

  import H from '@/api'

  export default {
    data() {
      return {
        charge: {
          amount: 100,
          password: ''
        }
      }
    },
    methods: {
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

  .page
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
        border 0.5px solid var(--color-divider)

        &.selected
          border 0.5px solid var(--color-primary)
          color var(--color-primary)

        + *
          margin-left 5px

    input
      text-align center

    .hint
      display block
      font-size 14px
      margin-bottom 15px
      white-space normal
      color var(--color-text-secondary)

      &::before
        content '!'
        display inline-block
        width 20px
        height 20px
        margin-right 5px
        border-radius 50%
        background var(--color-warning-light)
        color var(--color-warning-dark)
        text-align center

</style>
