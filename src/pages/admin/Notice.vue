<template lang='pug'>
  .admin-page#notice
    .subcontainer
      .list
        .notice-header
          .id 序号
          .middle 公告标题
          .operations 操作
        .notice(v-for='(notice, i) in notices')
          .id {{ i + 1 }}
          .middle
            input.notice-title(v-model='notice.title')
            textarea.content(v-model='notice.content')
          .operations
            button.save(v-if='notice.title && notice.content' @click='saveNotice(notice)') 保存
            confirm-button.remove(@click='removeNotice(notice.nid)' confirm-text='确定') 删除
        .notice.add
          .id
          .middle
            input.notice-title(placeholder='新增' v-model='newNotice.title')
            textarea.content(placeholder='Markdown 内容' v-model='newNotice.content')
          td.operations
            confirm-button(v-if='newNotice.title && newNotice.content' @click='addNotice()' confirm-text='确定新增') 新增公告
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
      this.notices = await api.get('/api/admin/notice')
    },
    methods: {
      async addNotice() {
        await api.post('/api/admin/notice', { notice: this.newNotice })
        this.notices = await api.get('/api/admin/notice')
        this.newNotice = {
          title: '',
          content: '',
          url: '',
          schoolnumPrefix: ''
        }
      },
      async saveNotice(notice) {
        await api.put('/api/admin/notice', { notice })
        this.notices = await api.get('/api/admin/notice')
      },
      async removeNotice(nid) {
        await api.delete('/api/admin/notice', { nid })
        this.notices = await api.get('/api/admin/notice')
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
      color var(--color-text-regular)

    button
      background var(--color-primary-bg)
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

    .notice
      border-top 0.5px solid var(--color-divider)

    .notice-header, .notice
      font-size 14px
      color var(--color-text-bold)
      display flex
      flex-direction row
      align-items center
      padding 12px 0

      > *
        flex 1 1 0

      .url
        flex 2 2 0

      .middle
        display flex
        flex-direction column
        flex 4 4 0

        * + *
          margin-top 5px

        .content
          height 5.5em
</style>
