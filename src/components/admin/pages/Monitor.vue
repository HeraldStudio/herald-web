<template lang='pug'>
  .admin-page#monitor
    .title 系统概况
    .subcontainer.connection(v-if='connection && redis')
      .subtitle 运行状态
      .summary {{ this.redis.server.os }}
        confirm-button.pull(:class='{ disabled: pulling }' @click='pull()' confirm-text='确认更新') {{ pulling ? '更新中…' : '更新代码' }}
        span.pull-result(v-if='changes && !changed' :title='changes') 没有更新
        span.pull-result(v-if='changes && changed' :title='changes') 代码已更新
      .dashboard
        .column
          .label 开机天数
          .content {{ this.redis.server.uptimeInDays }}
        .column
          .label 程序启动时间
          .content {{ formatTimeNatural(this.connection.startTime) }}
        .column
          .label 系统总内存
          .content {{ this.redis.memory.totalSystemMemoryHuman }}
        .column
          .label Redis 已用内存
          .content {{ this.redis.memory.usedMemoryHuman }}
        .column
          .label 当前并发请求数
          .content {{ this.connection.requestCount }}
        .column
          .label 当前爬虫连接数
          .content {{ this.connection.spiders.activeCount }}
        .column
          .label 当前待审核爬虫
          .content(v-if='!this.connection.spiders.inactiveCount') 0
          .spider(v-for='spider in this.connection.spiders.inactiveList')
            .name {{ spider }}
            confirm-button.accept(@click='acceptSpider(spider)' confirm-text='确认接受') 接受
            confirm-button.reject(@click='rejectSpider(spider)' confirm-text='确认拒绝') 拒绝
    .subcontainer.upstream(v-if='upstream')
      .subtitle 上游健康状况
      .summary {{ healthCount }} / {{ upstream.length }}
      .upstreams
        a.upstream(v-for='site in upstream' :class='{ healthy: site.health }' :href='site.url' target='_blank')
          .name {{ site.name }}
          .timeout {{ site.timeout === -1 ? '超时' : site.timeout + 'ms' }}
    .subcontainer.periods(v-if='daily')
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
        .period(v-for='period in daily')
          .count {{ period.count || '' }}
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
          .time {{ formatTime((period.startTime + period.endTime) / 2) }}
    .subcontainer.users(v-if='user')
      .subtitle 用户统计
      table
        tr
          th
            .table-header 平台
          th
            .table-header 总会话
          th
            .table-header 总用户
          th
            .table-header 今日新用户
          th
            .table-header 今日活跃用户
          th
            .table-header 本月新用户
          th
            .table-header 本月活跃用户
        tr(v-for='platform in user.platforms')
          td {{ platform.name }}
          td {{ platform.userCount }}
          td {{ platform.realUserCount }}
          td {{ platform.dailyRegister }}
          td {{ platform.dailyInvoke }}
          td {{ platform.monthlyRegister }}
          td {{ platform.monthlyInvoke }}
        tr.total
          td 合计
          td {{ user.userCount }}
          td {{ user.realUserCount }}
          td {{ user.dailyRegister }}
          td {{ user.dailyInvoke }}
          td {{ user.monthlyRegister }}
          td {{ user.monthlyInvoke }}
</template>
<script>
  import H from '@/api'
  import confirmButton from '@/components/ConfirmButton.vue'
  import formatter from '../../../util/formatter'

  export default {
    components: {
      confirmButton
    },
    data () {
      return {
        connection: null,
        redis: null,
        upstream: null,
        daily: null,
        user: null,
        interval: null,
        pulling: false,
        changed: false,
        changes: null
      }
    },
    computed: {
      totalConnections () {
        return this.connection.requestCount +
          this.connection.spiders.activeCount +
          this.connection.spiders.inactiveCount
      },
      healthCount () {
        return this.upstream.filter(k => k.health).length
      },
      maxPeriodCount () {
        return this.daily.map(k => k.count).sort((a, b) => a - b).slice(-1)[0] || 1
      }
    },
    methods: {
      ...formatter,
      formatTime (timestamp) {
        let date = new Date(timestamp)
        let minute = date.getMinutes()
        if (minute < 10) {
          minute = '0' + minute
        }
        return date.getHours() + ':' + minute
      },
      async acceptSpider (name) {
        await H.api.admin.maintenance.connection.post({ name })
        this.connection = await H.api.admin.maintenance.connection()
      },
      async rejectSpider (name) {
        await H.api.admin.maintenance.connection.delete({ name })
        this.connection = await H.api.admin.maintenance.connection()
      },
      async reload () {
        this.connection = await H.api.admin.maintenance.connection()
        this.redis = await H.api.admin.maintenance.redis()
        this.user = await H.api.admin.maintenance.user()
        this.daily = await H.api.admin.maintenance.daily()
        this.upstream = await H.api.admin.maintenance.upstream()
      },
      async pull () {
        this.pulling = true
        let { changed, out } = await H.api.admin.maintenance.pull()
        this.changes = out
        this.changed = changed
        this.pulling = false
      }
    },
    async created () {
      this.reload()
      this.interval = setInterval(() => this.reload(), 10000)
    },
    beforeDestroy () {
      clearInterval(this.interval)
    }
  }
</script>
<style lang='stylus'>
  .connection .summary button
    font-size 14px
    font-weight bold
    border-radius 3px
    padding 3px 7px
    margin 0 10px
    cursor pointer
    transition .3s

    &.pull
      background #ddfbff
      color #237a86

    &.confirming
      background #ffd8c4
      color #6b402a

    &.disabled
      cursor default
      pointer-events none

  .dashboard
    display flex
    flex-direction row

    .column
      display flex
      flex-direction column
      flex 1 1 0

      +.column
        margin-left 20px

      .label
        color #555
        font-size 14px
        font-weight bold
        padding-bottom 7px
        margin-bottom 7px
        border-bottom 1px solid var(--divider-color)

      .content
        font-size 20px

      .spider
        display flex
        flex-direction row
        align-items center
        padding-bottom 3px

        .name
          font-size 14px
          flex 1 1 0
          overflow hidden

        button
          font-size 13px
          font-weight bold
          border-radius 3px
          padding 3px 5px
          margin-left 5px
          cursor pointer
          transition .3s

          &.accept
            background #bdf7ff
            color #468f99

          &.confirming
            background #ffd8c4
            color #6b402a

          &.reject
            background #f5f5f5
            color #888888

  .upstreams
    display flex
    flex-direction row
    flex-wrap wrap

    a.upstream
      border-radius 3px
      padding 3px 7px
      margin-right 5px
      margin-top 5px
      background #ffd8c4
      font-size 14px
      color #6b402a
      display flex
      flex-direction row
      align-items center

      &.healthy
        background #ddfbff
        color #237a86

      .name
        font-weight bold
        margin-right 5px

      .timeout
        font-size 13px

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
      height 200px
      transition .3s

      &:hover
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

        .count
          writing-mode vertical-lr
          text-align right
          height 32px
          margin-bottom 10px
          font-size 11px
          color #888
          overflow hidden

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
                  border-left none

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
    font-size 14px

    tr
      border-bottom 5px solid transparent

      .table-header
        margin 5px 0
        margin-right 15px
        padding: 5px 0
        color #555
        font-weight bold
        border-bottom 1px solid var(--divider-color)

      td
        padding: 5px 20px 0 0
        font-size 14px
        color #555
        text-align right

        &:first-child
          background #ddfbff
          color #237a86
          padding 3px 7px
          border-radius 3px
          font-weight bold
          text-align left
          display inline-block

</style>
