<template lang="pug">

  .page(v-if='card')
    ul.info-bar
      button.info
        .title 卡余额
        .content {{ card.info.balance }}
      button.info
        .title 电子钱包余额
        .content {{ card.info.eacc }}
      button.charge(@click="navigateToCharge()") 充值
    ul.detail-list
      li(v-for='item in card.detail')
        .top
          .left {{ item.desc }}
        .bottom
          .left {{ item.amount.toFixed(2) }}
          .right {{ formatTimeNatural(item.time) }}
      li.empty(v-if='!card.detail.length') 暂无消费数据
      li.prev-day
        .hint {{ formatDateNatural(oldestDate) }} 总支出 {{ totalPayments.toFixed(2) }}
        button(@click='loadPrevDay()' :class='{ loading: loading }') {{ loading ? '...' : '查询前一天' }}
        timestamp.time(v-model='oldestDate' :useType='useType' :showType='showType' )
        button(@click='loadOneDay()' :class='{ loading: loading }') {{ loading ? '...' : '查询' }}

</template>
<script>

  import api from '@/api'
  import formatter from '@/util/formatter'
  import timestamp from '@/components/TimestampPicker.vue'
  import moment from "moment";

  export default {
    components: {
      timestamp
    },
    data() {
      return {
        card: null,
        oldestDate: null,
        loading: false,
        useType: 'date',
        showType: 'date',
      }
    },
    persist: {
      card: 'herald-default-card'
    },
    created() {
      this.oldestDate = +moment()
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
          let prevDayName = moment(prevDayTimestamp).format('YYYY-MM-DD')
          let res = await api.get('/api/card', { date: prevDayName })
          if (res) {
            this.card.detail = res.detail
            this.oldestDate = prevDayTimestamp
          }
        } finally {
          this.loading = false
        }
      },
      async loadOneDay() {
        console.log('查法')
        this.loading = true
        try {
          let oneDayName = moment(this.oldestDate).format('YYYY-MM-DD')
          let res = await api.get('/api/card', { date: oneDayName })
          if (res) {
            this.card.detail = res.detail
          }
        } finally {
          this.loading = false
        }
      },
      navigateToCharge() {
        this.$router.push("/card/charge")
      }
    }
  }

</script>
<style lang="stylus" scoped>
  .times
    padding-top 0px !important

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
      padding-top 6px
      padding-bottom 6px

      &.loading
        pointer-events none
    

</style>
