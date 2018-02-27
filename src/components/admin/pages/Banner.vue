<template lang='pug'>
  .admin-page#banner
    .title 轮播广告
    .subcontainer
      .summary-p 注：学号前缀可用于将轮播图发给指定院系、班级或个人，例如填入 090 表示发给学号 090 开头的用户；留空表示所有人可见，guest 表示所有游客可见，!guest 表示所有非游客可见
      table.list
        tr.banner-header
          th.state 状态
          th.pic 图片
          th.banner-title 轮播图标题
          th.url 链接 (可选)
          th.start-date 开始时间
          th.end-date 结束时间
          th.schoolnum-prefix 学号前缀
          th.operations 操作
        tr.banner(v-for='(banner, i) in banners' :class='getState(banner)')
          td.state {{ banner.changed ? '未保存' : { upcoming: '未开始', ongoing: '展示中', ended: '已下架' }[getState(banner)] }}
          td
            div.pic-wrapper
              img.pic(:src='banner.pic' @click='uploadPic(banner)')
              qiniu.pic-upload(v-model='banner.pic' @input='banner.changed = true') 上传
          td
            input.banner-title(v-model='banner.title' @input='banner.changed = true')
          td
            input.url(v-model='banner.url' @input='banner.changed = true')
          td
            timestamp(v-model='banner.startTime' @input='banner.changed = true')
          td
            timestamp(v-model='banner.endTime' @input='banner.changed = true')
          td
            input.schoolnum-prefix(v-model='banner.schoolnumPrefix' @input='banner.changed = true')
          td.operations
            button.save(v-if='banner.pic && banner.title && banner.startTime && banner.endTime && banner.changed' @click='saveBanner(banner)') 保存
            confirm-button.remove(@click='removeBanner(banner.bid)' confirm-text='确定') 删除
        tr.banner.add
          td.state
          td
            div.pic-wrapper
              img.pic(:src='newBanner.pic' @click='uploadPic(newBanner)')
              qiniu.pic-upload(v-model='newBanner.pic') 上传
          td
            input.banner-title(placeholder='新增' v-model='newBanner.title')
          td
            input.url(v-model='newBanner.url')
          td
            timestamp(v-model='newBanner.startTime')
          td
            timestamp(v-model='newBanner.endTime')
          td
            input.schoolnum-prefix(v-model='newBanner.schoolnumPrefix')
          td.operations
            confirm-button(v-if='newBanner.pic && newBanner.title && newBanner.startTime && newBanner.endTime' @click='addBanner()' confirm-text='确定新增') 新增轮播图
</template>
<script>
  import H from '@/api'
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
        banners: [],
        newBanner: {}
      }
    },
    async created() {
      this.banners = await H.api.admin.banner()
      this.initNewBanner()
    },
    methods: {
      getState(banner) {
        let now = new Date().getTime()
        if (banner.startTime > now) {
          return 'upcoming'
        } else if (banner.endTime > now) {
          return 'ongoing'
        } else {
          return 'ended'
        }
      },
      initNewBanner() {
        let now = new Date()
        let startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
        let endTime = startTime + 1000 * 60 * 60 * 24 * 3
        this.newBanner = {
          title: '',
          pic: '',
          url: '',
          startTime,
          endTime,
          schoolnumPrefix: ''
        }
      },
      async addBanner() {
        delete banner.changed
        await H.api.admin.banner.post({ banner: this.newBanner })
        this.banners = await H.api.admin.banner()
        this.initNewBanner()
      },
      async saveBanner(banner) {
        delete banner.changed
        await H.api.admin.banner.put({ banner })
        this.banners = await H.api.admin.banner()
      },
      async removeBanner(bid) {
        await H.api.admin.banner.delete({ bid })
        this.banners = await H.api.admin.banner()
      }
    }
  }
</script>
<style lang='stylus'>

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
      color #333

    button
      background #ddfbff
      color #237a86
      font-weight bold
      margin 0 2.5px
      cursor pointer

      &.remove
        background #ffedc1
        color #a4832d

      &.confirming
        background #ffd8c4
        color #6b402a

    .banner-header, .banner
      font-size 14px
      color #555

      .state
        width 64px
        font-size 13px

      &.ongoing .state
        color var(--theme-color)
        font-weight bold

      th, td
        border-top 1px solid var(--divider-color)
        padding 10px 2.5px

      .pic-wrapper
        width 120px
        height 48px
        position relative
        display flex
        align-items center
        justify-content center
        border-radius 5px
        overflow hidden

        img.pic
          width 100%
          height 100%
          object-fit cover
          border-radius 5px

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

      .operations
        width 100px
</style>
