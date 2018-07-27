<template lang='pug'>
  .admin-page#monitor
    transition-group(name='slide')
      .subcontainer.dashboard(key='connection' v-if='connection && redis' :class='{ stale: connection && connection.isStale || redis && redis.isStale }')
        .column
          .label 系统开机
          .content {{ this.redis.server.uptimeInDays }}天
        .column
          .label 程序启动
          .content {{ formatTimeNatural(this.connection.startTime) }}
        .column
          .label 已用内存
          .content {{ this.redis.memory.usedMemoryHuman }}
        .column
          .label 并发量
          .content {{ this.connection.requestCount }}
        .column
          .label 在线爬虫
          .content {{ this.connection.spiders.activeCount }}
        .column(v-if='this.connection.spiders.inactiveCount')
          .label 待审爬虫
          .spider(v-for='spider in this.connection.spiders.inactiveList')
            .name {{ spider }}
            confirm-button.accept(@click='acceptSpider(spider)' confirm-text='确认接受') 接受
            confirm-button.reject(@click='rejectSpider(spider)' confirm-text='确认拒绝') 拒绝
      .subcontainer.upstream(key='upstream' v-if='upstream' :class='{ stale: upstream && upstream.isStale }')
        .subtitle 上游健康状况
        .upstreams
          a.upstream(v-for='site in upstream' :class='{ healthy: site.health }' :href='site.url' target='_blank')
            .name {{ site.name }}
            .timeout {{ site.timeout === -1 ? '超时' : site.timeout + 'ms' }}
      .subcontainer.periods(key='daily' v-if='daily' :class='{ stale: daily && daily.isStale }')
        .subtitle 24 小时接口调用统计
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
          .period(v-for='(period, i) in daily' :class='{ fade: !period.isToday }')
            .count {{ period.count || '' }}
            .operations-container
              .operations(:style='{ height: period.count / maxPeriodCount * 100 + "%" }')
                .operation(v-for='route in period.routes' :style='{ flexGrow: route.count }')
                  .result(v-for='result in route.results' :style='{ flexGrow: result.count }'
                    :class='"result-" + String(result.status)[0]' :title='generateDescription(route, result)')
            .time.left(v-if='i < 47') {{ i % 2 == 0 ? i / 2 : '' }}
            .time.right(v-else) 24
            //- .users-container
            //-   .users(:style='{ height: period.userCount / maxUserCount * 100 + "%" }')
            //- .user-count {{ period.userCount || '' }}
      .subcontainer.users(key='user' v-if='user' :class='{ stale: user && user.isStale }')
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
              .table-header 24小时新用户
            th
              .table-header 24小时活跃用户
            th
              .table-header 30天新用户
            th
              .table-header 30天活跃用户
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
  import api from '@/api'
  import confirmButton from '@/components/ConfirmButton.vue'
  import formatter from '@/util/formatter'

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
        interval: null
      }
    },
    persist: {
      connection: 'herald-default-monitor-connection',
      redis: 'herald-default-monitor-redis',
      upstream: 'herald-default-monitor-upstream',
      daily: 'herald-default-monitor-daily',
      user: 'herald-default-monitor-user'
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
      },
      maxUserCount () {
        return this.daily.map(k => k.userCount).sort((a, b) => a - b).slice(-1)[0] || 1
      }
    },
    methods: {
      ...formatter,
      async acceptSpider (name) {
        await api.post('/api/admin/maintenance/connection', { name })
        this.connection = await api.get('/api/admin/maintenance/connection')
      },
      async rejectSpider (name) {
        await api.delete('/api/admin/maintenance/connection', { name })
        this.connection = await api.get('/api/admin/maintenance/connection')
      },
      async reload () {
        this.connection = await api.get('/api/admin/maintenance/connection')
        this.redis = await api.get('/api/admin/maintenance/redis')
        this.user = await api.get('/api/admin/maintenance/user')
        this.daily = await api.get('/api/admin/maintenance/daily')
        this.upstream = await api.get('/api/health')
      },
      generateDescription(route, result) {
        return [
          route.route,
          "次数：" + result.count,
          "状态：" + result.status
        ].join('\n')
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
  #monitor
    .slide-enter-active, .slide-leave-active
      transition .3s !important

    .slide-enter, .slide-leave-to
      transform translateY(-100px) !important
      opacity 0 !important

    .slide-leave-active
      position absolute

    .connection .summary button
      font-size 14px
      font-weight bold
      border-radius 3px
      padding 3px 7px
      margin 0 10px
      cursor pointer
      transition .3s

      &.pull
        background var(--color-primary-bg)
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
      flex-wrap wrap
      justify-content center

      .column
        display flex
        flex-direction column
        text-align center
        white-space nowrap
        margin 10px

        .label
          color var(--color-text-bold)
          font-size 14px
          font-weight bold
          padding-bottom 7px
          margin-bottom 7px
          border-bottom 0.5px solid var(--color-divider)

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
      justify-content center

      a.upstream
        border-radius 3px
        padding 3px 7px
        margin 2.5px
        background #ffd8c4
        font-size 14px
        color #6b402a
        display flex
        flex-direction row
        align-items center

        &.healthy
          background var(--color-primary-bg)
          color #237a86

        .name
          font-weight bold
          margin-right 5px

        .timeout
          font-size 13px

    .periods
      overflow visible

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
        // position relative
        height 400px
        transition .2s
        overflow-x scroll
        -webkit-overflow-scrolling touch

        @media screen and (min-width: 1200px)
          overflow-x: visible

        .period
          flex 1 1 2%
          width 2%
          min-width 15px
          display flex
          flex-direction column

          &:hover
            background #fafafa

          &:not(:hover)
            .count, .user-count
              opacity 0

          &.fade:not(:hover)
            .operations-container, .users-container
              > *
                transform scaleX(0.1)
                filter grayscale()

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
            transition .2s

          .user-count
            writing-mode vertical-lr
            text-align left
            height 32px
            margin-top 10px
            font-size 11px
            color #ddd
            overflow hidden
            transition .2s

          .operations-container
            flex 3 3 0
            position relative
            border-right 0.5px solid var(--color-tool-bg)
            transition .3s
            overflow hidden

            .operations
              position absolute
              left 1px
              right 1px
              bottom 0
              border-radius 3px
              background #f8f8f8
              display flex
              flex-direction column
              justify-content flex-end
              // border-radius 3px
              overflow hidden
              transition .2s

              .operation
                flex 1 1 0
                display flex
                flex-direction row
                // position relative

                + .operation
                  box-shadow 0 -1px 0 rgba(0, 0, 0, .1)

                .result
                  flex 1 1 0

                  + .result
                    box-shadow inset 1px 0 0 rgba(0, 0, 0, .1)

                  &:hover
                    outline 0.5px solid var(--color-primary)
                    border-left none
                    z-index 999

          .time
            height 15px
            margin 3px 0
            font-size 11px
            color #888
            text-align center

            &.left
              transform translateX(-50%)

            &.right
              transform translateX(50%)

          .users-container
            flex 1 1 0
            position relative
            border-right 0.5px solid var(--color-tool-bg)
            transition .3s

            .users
              position absolute
              left 1px
              right 1px
              top 0
              border-radius 3px
              background #f0f0f0
              display flex
              flex-direction column
              justify-content flex-end
              // border-radius 3px
              overflow hidden
              transition .2s

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
          color var(--color-text-bold)
          font-weight bold
          border-bottom 0.5px solid var(--color-divider)

        td
          padding: 5px 20px 0 0
          font-size 14px
          color var(--color-text-bold)
          text-align right

          &:first-child
            background var(--color-primary-bg)
            color #237a86
            padding 3px 7px
            border-radius 3px
            font-weight bold
            text-align left
            display inline-block

</style>
