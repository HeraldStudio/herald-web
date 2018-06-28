<template lang='pug'>
  .admin-page#activity
    .subcontainer
      table.list
        tr.activity-header
          th.state 状态
          th.pic 图片
          th.activity-title 活动标题
          th.url 链接 (可选)
          th.start-date 开始时间
          th.end-date 结束时间
          th.click 点击量
          th.operations 操作
        template(v-for='(activity, i) in activities' :class='getState(activity)')
          tr.activity
            td.state(rowspan='2') {{ { upcoming: '未开始', ongoing: '展示中', ended: '已下架' }[getState(activity)] }}
            td(rowspan='2')
              div.pic-wrapper
                img.pic(:src='activity.pic' @click='uploadPic(activity)')
                qiniu.pic-upload(v-model='activity.pic')
            td
              input.activity-title(v-model='activity.title')
            td
              input.url(v-model='activity.url')
            td
              timestamp(v-model='activity.startTime')
            td
              timestamp(v-model='activity.endTime')
            td.click(rowspan='2') {{ activity.clicks }}
            td.operations(rowspan='2')
              button.save(v-if='activity.pic && activity.title && activity.content && activity.startTime && activity.endTime' @click='saveActivity(activity)') 保存
              confirm-button.remove(@click='removeActivity(activity.aid)' confirm-text='确定') 删除
          tr.activity
            td(colspan='4')
              textarea.content(v-model='activity.content')
        tr.activity.add
          td.state(rowspan='2')
          td(rowspan='2')
            div.pic-wrapper
              img.pic(:src='newActivity.pic' @click='uploadPic(newActivity)')
              qiniu.pic-upload(v-model='newActivity.pic')
          td
            input.activity-title(placeholder='新增' v-model='newActivity.title')
          td
            input.url(v-model='newActivity.url')
          td
            timestamp(v-model='newActivity.startTime')
          td
            timestamp(v-model='newActivity.endTime')
          td.click(rowspan='2')
          td.operations(rowspan='2')
            confirm-button(v-if='newActivity.pic && newActivity.title && newActivity.content && newActivity.startTime && newActivity.endTime' @click='addActivity()' confirm-text='确定新增') 新增活动
        tr.activity.add
          td(colspan='4')
            textarea.content(v-model='newActivity.content')
        tr.activity.more(v-if='!ended')
          td(colspan='9' @click='loadNextPage()') 加载更多
</template>
<script>
  import api from '@/api'
  import confirmButton from '@/components/ConfirmButton.vue'
  import timestamp from '@/components/TimestampPicker.vue'
  import formatter from '@/util/formatter'
  import qiniu from '@/components/Qiniu.vue'

  export default {
    components: {
      confirmButton, timestamp, qiniu
    },
    data () {
      return {
        activities: [],
        newActivity: {},
        page: 1,
        ended: false
      }
    },
    async created() {
      this.activities = await api.get('/api/admin/activity')
      if (this.activities.length < 10) {
        this.ended = true
      }
      this.initNewActivity()
    },
    methods: {
      async loadNextPage() {
        let nextPage = await api.get('/api/admin/activity', { page: this.page + 1 })
        if (nextPage.length < 10) {
          this.ended = true
        }
        nextPage = nextPage.filter(k => this.activities.find(j => j.aid !== k.aid))
        this.activities = this.activities.concat(nextPage)
        this.page++
      },
      getState(activity) {
        let now = new Date().getTime()
        if (activity.startTime > now) {
          return 'upcoming'
        } else if (activity.endTime > now) {
          return 'ongoing'
        } else {
          return 'ended'
        }
      },
      initNewActivity() {
        let now = new Date()
        let startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
        let endTime = startTime + 1000 * 60 * 60 * 24 * 3
        this.newActivity = {
          title: '',
          content: '',
          pic: '',
          url: '',
          startTime,
          endTime
        }
      },
      async addActivity() {
        await api.post('/api/admin/activity', { activity: this.newActivity })
        this.activities = await api.get('/api/admin/activity')
        this.initNewActivity()
      },
      async saveActivity(activity) {
        await api.put('/api/admin/activity', { activity })
        this.activities = await api.get('/api/admin/activity')
      },
      async removeActivity(aid) {
        await api.delete('/api/admin/activity', { aid })
        this.activities = await api.get('/api/admin/activity')
      }
    }
  }
</script>
<style lang='stylus'>

  #activity

    .summary-p
      font-size 14px
      color #888
      margin-bottom 15px

    .list
      width 100%
      text-align center
      border-collapse collapse

      input, textarea, button
        padding 3px 7px
        border-radius 3px
        font-size 13px

      input, textarea
        width 100%
        margin 0
        display block
        color var(--color-text-regular)

      button
        background var(--color-primary-bg)
        color #237a86
        font-weight bold
        margin 2.5px
        cursor pointer

        &.remove
          background #ffedc1
          color #a4832d

        &.confirming
          background #ffd8c4
          color #6b402a

      .activity-header, .activity
        font-size 14px
        color var(--color-text-bold)

        .state
          width 64px
          font-size 13px

        &.ongoing .state
          color var(--color-primary)
          font-weight bold

        th, td
          padding 10px 2.5px

        td
          border-top 0.5px solid var(--color-divider)

        .pic-wrapper
          width 100px
          height 100px
          margin-right 10px
          position relative
          display flex
          align-items center
          justify-content center
          border-radius 3px
          overflow hidden

          img.pic
            width 100%
            height 100%
            object-fit cover
            border-radius 3px

          .pic-upload
            position absolute
            left 0
            right 0
            top 0
            bottom 0

        > *
          flex 1 1 0
          overflow hidden
          margin 0 2.5px
          box-sizing border-box

        .middle
          display flex
          flex-direction column
          flex 4 4 0

          .first-line
            display flex
            flex-direction row

            > *
              flex 1 1 0
              + *
                margin-left 5px

            .url
              flex 2 2 0

          .content
            margin-top 5px

        .operations, .click
          width 60px
</style>
