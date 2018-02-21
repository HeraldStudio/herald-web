<template lang='pug'>
  .admin-page#monitor
    .title 系统概况
    .subcontainer.upstream(v-if='status')
      .subtitle 上游健康状况
      .summary {{ healthCount }} / {{ status.upstream.length }}
      .upstreams
        .upstream(v-for='site in status.upstream' :class='{ healthy: site.health }')
          .name {{ site.name }}
          .timeout {{ site.timeout === -1 ? '超时' : site.timeout + 'ms' }}
    .subcontainer.periods(v-if='status')
      .subtitle 24 小时调用统计
      .summary
        .example-block.result-2
        span 2xx
        .example-block.result-3
        span 3xx
        .example-block.result-4
        span 4xx
        .example-block.result-5
        span 5xx
      .periods-chart
        .period(v-for='period in status.periods')
          .operations-container
            .operations(:style='{ height: period.count / maxPeriodCount * 100 + "%" }')
              .operation(v-for='operation in period.operations' :style='{ flexGrow: operation.count }')
                .result(v-for='result in operation.results' :style='{ flexGrow: result.count }' :class='"result-" + result.status[0]')
                  .description-container
                    .description
                      p {{ operation.operation }}
                      p 次数：{{ result.count }}
                      p 状态：{{ result.status }}
                      p 平均耗时：{{ result.averageDuration }}ms
          .time {{ formatTime(period.endTime) }}
    .subcontainer.users(v-if='status')
      .subtitle 用户统计
      table
        tr
          th
            .table-header 平台
          th
            .table-header 总会话数
          th
            .table-header 总用户人数
          th
            .table-header 今日新会话数
          th
            .table-header 今日活跃会话数
          th
            .table-header 本月新会话数
          th
            .table-header 本月活跃会话数
        tr(v-for='platform in status.users.platforms')
          td
            .table-cell {{ platform.name }}
          td
            .table-cell {{ platform.userCount }}
          td
            .table-cell {{ platform.realUserCount }}
          td
            .table-cell {{ platform.dailyRegister }}
          td
            .table-cell {{ platform.dailyInvoke }}
          td
            .table-cell {{ platform.monthlyRegister }}
          td
            .table-cell {{ platform.monthlyInvoke }}
        tr.total
          td
            .table-header 合计
          td
            .table-header {{ status.users.userCount }}
          td
            .table-header {{ status.users.realUserCount }}
          td
            .table-header {{ status.users.dailyRegister }}
          td
            .table-header {{ status.users.dailyInvoke }}
          td
            .table-header {{ status.users.monthlyRegister }}
          td
            .table-header {{ status.users.monthlyInvoke }}
</template>
<script>
  import H from '@/api'

  export default {
    data () {
      return {
        status: null
      }
    },
    computed: {
      healthCount () {
        return this.status.upstream.filter(k => k.health).length
      },
      maxPeriodCount () {
        return this.status.periods.map(k => k.count).sort((a, b) => a - b).slice(-1)[0] || 1
      }
    },
    methods: {
      formatTime (timestamp) {
        let date = new Date(timestamp)
        let minute = date.getMinutes()
        if (minute < 10) {
          minute = '0' + minute
        }
        return date.getHours() + ':' + minute
      }
    },
    async created () {
      this.status = await H.api.status()
    }
  }
</script>
<style lang='stylus'>
  .upstreams
    display flex
    flex-direction row
    flex-wrap wrap

    .upstream
      border-radius 3px
      padding 5px 10px
      margin-right 5px
      margin-top 5px
      background #ffd8c4
      color #6b402a
      display flex
      flex-direction row

      &.healthy
        background #f3ffdd
        color #719926

      .name
        font-weight bold
        margin-right 7px

  .periods
    .example-block
      display inline-block
      margin 0 5px
      width 1em
      height 1em
      border-radius 3px

    .result-2
      background #70eafa

    .result-3
      background #bef558

    .result-4
      background #ffcd4d

    .result-5
      background #f07867

    .periods-chart
      display flex
      flex-direction row
      position relative
      height 400px

      .period
        flex 1 1 0
        display flex
        flex-direction column
        overflow hidden

        &:hover
          overflow visible

        &:last-child .operations-container
          border-right 0 none

        .operations-container
          flex 1 1 0
          position relative
          border-right 1px solid #fafafa

          .operations
            position absolute
            left 1px
            right 1px
            bottom 0
            border-radius 5px
            background #f8f8f8
            display flex
            flex-direction column
            justify-content flex-end
            border-radius 3px
            overflow hidden

            &:hover
              overflow visible

            .operation
              flex 1 1 0
              display flex
              flex-direction row
              position relative

              + .operation
                border-top 1px solid rgba(0, 0, 0, .5)

              .result
                flex 1 1 0

                + .result
                  border-left 1px solid rgba(0, 0, 0, .5)

                .description-container
                  position absolute
                  top 0
                  left 50%
                  width 0
                  height 0

                  .description
                    position absolute
                    bottom 0
                    left -70px
                    right -70px
                    text-align left
                    font-size 12px
                    color #555
                    padding 5px 10px
                    border-radius 5px
                    background #fff
                    box-shadow 0 3px 10px rgba(0, 0, 0, .05)
                    z-index 999
                    opacity 0
                    transition .5s
                    pointer-events none

                    p
                      line-height 1.5em

                &:hover
                  outline 1px solid var(--theme-color)

                  .description
                    opacity 1
                    bottom 10px

        .time
          writing-mode vertical-lr
          height 32px
          margin-top 10px
          font-size 11px
          color #888
          overflow hidden

  .users table
    width 100%
    text-align left
    border-collapse collapse

    .table-header
      margin-top 3px
      display inline-block
      padding: 5px 10px
      border-radius 3px
      background #ddfbff
      color #237a86
      font-weight bold

    .table-cell
      margin-top 3px
      display inline-block
      padding: 5px 10px
      border-radius 3px
      background #fafafa
      color #555

</style>
