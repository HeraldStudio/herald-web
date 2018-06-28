<template lang="pug">

  .page
    .amount-select
      .amount(v-for='amount in [50, 100, 200, 300, 500]' :class='{ selected: charge.amount === amount }' @click='charge.amount = amount') {{ amount }}
    input(placeholder='金额' v-model='charge.amount')
    input.password(placeholder='六位查询密码' type='password' v-model='charge.password')
    .buttons
      confirmButton(:disabled='disabled' @click='confirmCharge()' confirm-text='确定充值') 充值到一卡通
      confirmButton(:disabled='disabled' @click='confirmCharge(true)' confirm-text='确定充值到电子钱包') 充值到电子钱包
    hr
    p.hint.
      一卡通在线预充值并非实时到账，在校内食堂多数窗口和部分超市刷卡时均可到账；
      极少数情况不能到账时，你也可以手动在圈存机存入任意金额；
      本功能仅在银行卡与学校一卡通中心之间产生交易，若圈存机出错，可能是一卡通中心大面积维护，与小猴偷米无关；
      查询密码将自动保存在本地浏览器，请勿在公共设备上使用此功能；
      充值电子钱包后可直接在<a href="https://selfservice.seu.edu.cn/selfservice/service_recharge_rfid.php">网络与信息中心自助服务区（需内网，无需登录）</a>用一卡通充值校园网账户。

</template>
<script>

  import api from '@/api'
  import confirmButton from '@/components/ConfirmButton'

  export default {
    components: {
      confirmButton
    },
    data() {
      return {
        charge: {
          amount: 100,
          password: '',
          disabled: false,
          eacc: false
        }
      }
    },
    persist: {
      password: 'herald-card-charge-password'
    },
    methods: {
      changeAmount(ev) {
        this.charge.amount = ev.target.value
      },
      async confirmCharge(eacc = false) {
        this.$toasted.show('正在处理，请稍候…')
        this.disabled = true
        this.charge.eacc = eacc
        try {
          let res = await api.put('/api/card', this.charge)
        } finally {
          this.disabled = false
        }
        this.$toasted.show(res)
        if (/成功/.test(res)) {
          this.$router.back()
        }
      }
    }
  }

</script>
<style lang="stylus" scoped>

  .page
    display flex
    flex-direction column
    align-items center

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
      margin-bottom 10px

    .hint
      display block
      font-size 13px
      white-space normal
      color var(--color-text-secondary)

      &::before
        content '!'
        display inline-block
        width 20px
        height 20px
        line-height 20px
        margin-right 5px
        border-radius 50%
        background var(--color-warning-light)
        color var(--color-warning-dark)
        text-align center

      a
        color var(--color-primary)

    .buttons
      > * + *
        margin-left 5px

</style>
