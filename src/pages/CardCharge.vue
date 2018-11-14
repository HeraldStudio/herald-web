<template lang="pug">

  .page
    .amount-select
      .amount(v-for='amount in [50, 100, 200, 300, 500]' :class='{ selected: charge.amount === amount }' @click='onSelectAmount(amount)') {{ amount }}
      input(placeholder='自定' v-model='charge.customAmount' @input='onInputAmount' :class='{ selected: charge.custom }')
    //- 密码框前面多放一个隐藏的输入框，防止浏览器自动填充账号到金额框里去
    input.fake
    input.password(placeholder='六位查询密码' type='password' v-model='charge.password')
    .buttons
      confirmButton(:disabled='disabled' @click='confirmCharge()' confirm-text='确定充值') 充值到一卡通
      confirmButton(:disabled='disabled' @click='confirmCharge(true)' confirm-text='确定充值到电子钱包') 充值到电子钱包
    hr
    .hint
      .hint-title 使用前必读
      .line 1. 一卡通在线预充值并非实时到账，在校内食堂多数窗口和部分超市刷卡时均可到账。极少数情况不能到账时，你也可以手动在圈存机存入任意金额；
      .line 2. 本功能仅在银行卡与学校一卡通中心之间产生交易，若圈存机出错，可能是一卡通中心大面积维护，与小猴偷米无关；
      .line 3. 查询密码将自动保存在本地浏览器，请勿在公共设备上使用此功能；
      .line 4. 充值电子钱包后可直接在<a href="https://selfservice.seu.edu.cn/selfservice/service_recharge_rfid.php">网络与信息中心自助服务区</a> (需内网，无需登录 seu-wlan 认证) 用一卡通充值校园网账户。

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
          custom: false,
          customAmount: '',
          password: '',
          eacc: false
        }
      }
    },
    persist: {
      charge: 'herald-card-charge-obj'
    },
    methods: {
      onSelectAmount(amount) {
        this.charge.custom = false
        this.charge.customAmount = ''
        this.charge.amount = amount
      },
      onInputAmount(ev) {
        let amount = parseFloat(ev.target.value)
        this.charge.customAmount = ev.target.value
        if (amount) {
          this.charge.custom = true
          this.charge.amount = amount
        } else {
          this.charge.custom = false
          this.charge.amount = 100
        }
      },
      async confirmCharge(eacc = false) {
        let loading = this.$toasted.show('正在处理，请稍候…', { duration: Infinity })
        this.disabled = true
        this.charge.eacc = eacc
        let res
        try {
          res = await api.put('/api/card', this.charge)
        } finally {
          this.disabled = false
          loading.goAway()

          if (/成功/.test(res)) {
            this.$toasted.show('预充值成功，请注意及时刷卡到账')
            this.$router.back()
            return
          }
          this.$toasted.show(res)
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
      max-width 360px
      display flex
      flex-direction row
      flex-wrap wrap
      justify-content center
      margin-bottom 15px

      *
        flex 1 1 0
        width 0
        font-size 14px
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

    // 密码框前面多放一个隐藏的输入框，防止浏览器把一卡通号自动填充到金额框里去
    // 这个不能简单的 display: none，在 chrome 上是无效的
    // 浏览器之所以不顾一切的自动填充，是为了防止网站随便禁用自动填充导致用户倾向于使用弱密码。
    input.fake
      position fixed
      width 0
      height 0
      user-select none
      opacity 0

    input.password
      width 100%
      max-width 300px
      text-align center
      margin-bottom 10px

    .hint
      .hint-title
        display inline-block
        height 20px
        line-height 20px
        margin-bottom 5px
        border-radius 10px
        padding 0 10px
        background var(--color-warning-light)
        color var(--color-warning-dark)
        text-align center

      .line
        color #aaa
        margin 5px 0

      a
        color var(--color-primary)

    .buttons
      > * + *
        margin-left 5px

</style>
