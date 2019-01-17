<template lang="pug">

  .page(v-if='card')
    ul.info-bar
      li.info
        .title 卡余额
        .content {{ card.info.balance }}
      li.info
        .title 电子钱包余额
        .content {{ card.info.eacc }}
      li.info.charge
        a(href='http://yktwechat.seu.edu.cn/wechat/url/redirectJkbh.html?jkbh=0006')
          .title 充值
    ul.detail-list
      li(v-for='item in card.detail')
        .top
          .left {{ item.desc }}
        .bottom
          .left {{ item.amount.toFixed(2) }}
          .right {{ formatTimeNatural(item.time) }}
      li.empty(v-if='!card.detail.length') 暂无消费数据
      li.prev-day
        .hint {{ formatDateNatural(oldestDate) }}至今 总支出 {{ totalPayments.toFixed(2) }}
        button(@click='loadPrevDay()' :class='{ loading: loading }') {{ loading ? '...' : '加载前一天' }}

</template>
<script>

  import api from '@/api'
  import formatter from '@/util/formatter'

  export default {
    data() {
      return {
        card: null,
        oldestDate: null,
        loading: false
      }
    },
    persist: {
      card: 'herald-default-card'
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
        this.card = await api.get('/api/card')
      },
      async loadPrevDay() {
        this.loading = true
        try {
          let prevDayTimestamp = this.oldestDate - 1000 * 60 * 60 * 24
          let prevDay = new Date(prevDayTimestamp)
          let prevDayName = `${prevDay.getFullYear()}-${prevDay.getMonth() + 1}-${prevDay.getDate()}`
          let res = await api.get('/api/card', { date: prevDayName })
          if (res) {
            this.card.detail = this.card.detail.concat(res.detail)
            this.oldestDate = prevDayTimestamp
          }
        } finally {
          this.loading = false
        }
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

</style>
