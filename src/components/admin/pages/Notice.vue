<template lang='pug'>
  .admin-page#notice
    .title 通知公告
    .subcontainer
      .summary-p 注：学号前缀可用于将公告发给指定院系、班级或个人，例如填入 090 表示发给学号 090 开头的用户；留空表示所有人可见，guest 表示所有游客可见，!guest 表示所有非游客可见
      .list
        .notice-header
          .id 序号
          .notice-title 公告标题
          .url 公告链接（可选）
          .schoolnum-prefix 对指定学号前缀可见
          .operations 操作
        .notice(v-for='(notice, i) in notices')
          .id {{ i + 1 }}
          .middle
            .first-line
              input.notice-title(v-model='notice.title' @input='notices[i].changed = true')
              input.url(v-model='notice.url' @input='notices[i].changed = true')
              input.schoolnum-prefix(v-model='notice.schoolnumPrefix' @input='notices[i].changed = true')
            textarea.content(v-model='notice.content' @input='notices[i].changed = true')
          .operations
            button.save(v-if='notice.title && notice.content && notice.changed' @click='saveNotice(notice)') 保存
            confirm-button.remove(@click='removeNotice(notice.nid)' confirm-text='确定') 删除
        .notice.add
          .id
          .middle
            .first-line
              input.notice-title(placeholder='新增' v-model='newNotice.title')
              input.url(v-model='newNotice.url')
              input.schoolnum-prefix(v-model='newNotice.schoolnumPrefix')
            textarea.content(placeholder='公告内容' v-model='newNotice.content')
          td.operations
            confirm-button(v-if='newNotice.title && newNotice.content' @click='addNotice()' confirm-text='确定新增') 新增公告
</template>
<script>
  import H from '@/api'
  import confirmButton from '@/components/ConfirmButton.vue'
  import formatter from '@/util/formatter'

  export default {
    components: {
      confirmButton
    },
    data () {
      return {
        notices: [],
        newNotice: {
          title: '',
          content: '',
          url: '',
          schoolnumPrefix: ''
        }
      }
    },
    async created() {
      this.notices = await H.api.admin.notice()
    },
    methods: {
      async addNotice() {
        await H.api.admin.notice.post({ notice: this.newNotice })
        this.notices = await H.api.admin.notice()
        this.newNotice = {
          title: '',
          content: '',
          url: '',
          schoolnumPrefix: ''
        }
      },
      async saveNotice(notice) {
        await H.api.admin.notice.put({ notice })
        this.notices = await H.api.admin.notice()
      },
      async removeNotice(nid) {
        await H.api.admin.notice.delete({ nid })
        this.notices = await H.api.admin.notice()
      }
    }
  }
</script>
<style lang='stylus' scoped>
  .summary-p
    font-size 14px
    color #888
    margin-bottom 15px

  .list
    width 100%
    display flex
    flex-direction column
    text-align center

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
      margin-right 5px
      cursor pointer

      &.remove
        background #ffedc1
        color #a4832d

      &.confirming
        background #ffd8c4
        color #6b402a

    .notice-header
      font-weight bold

    .notice-header, .notice
      font-size 14px
      color #555
      display flex
      flex-direction row
      align-items center
      padding 12px 0
      border-top 1px solid var(--divider-color)

      > *
        flex 1 1 0

      .url
        flex 2 2 0

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
</style>
