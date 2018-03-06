<template lang="pug">

  .widget.notice
    .title 通知公告
      .reload(@click='reload()')
    ul.detail-list
      li(v-for='item in notices' :class='{ important: item.isImportant }')
        drawer(title='通知内容' @open='loadMarkdown(item)' @close='markdown = ""')
          .top
            .left {{ item.title }}
          .bottom
            .left {{ item.category }}
            .right 发布于 {{ formatDateNatural(item.time) }}
          .content(slot='content')
            .markdown-container(v-html='markdown')
    .empty(v-if='!notices.length') 暂无通知

</template>
<script>

  import H from '@/api'
  import formatter from '@/util/formatter'
  import drawer from '@/components/Drawer'
  import marked from 'marked'

  marked.setOptions({ gfm: true })

  export default {
    components: { drawer },
    data() {
      return {
        notices: [],
        markdown: ''
      }
    },
    created() {
      this.reload()
    },
    methods: {
      ...formatter,
      async reload() {
        this.notices = await H.api.notice()
      },
      async loadMarkdown(notice) {
        if (notice.isAttachment) {
          this.markdown = `[下载附件](${notice.url})`
        } else {
          this.markdown = '加载中…'
          this.markdown = '# ' + notice.title + '\n\n' + await H.api.notice.post(notice)
        }
        this.markdown = marked(this.markdown.replace(/\*\*/g, ' ** '))
      }
    }
  }

</script>
<style lang="stylus">
  .important .top .left
    font-weight bold

  .markdown-container
    border-top 1px solid transparent
    margin 0 15px
    transition .3s
    color #555
    text-align justify

    @media screen and (max-width: 600px)
      margin 0 10px

    a, a:hover, a:active, a:visited
      color var(--color-primary)
      text-decoration none
      cursor pointer

    &:hover
      color #000

    img
      max-width 100%
      position relative

    p
      margin 0.5em 0

    pre, code
      font-family 'Fira Code', 'Source Code Pro', monospace
      font-size 95%
      letter-spacing -0.015em
      line-height 1.5em

      *
        font-family inherit
        font-size inherit
        line-height inherit

    h1 code, h2 code, h3 code, h4 code, h5 code, h6 code
      font-family inherit

    ul
      padding-left 1.5em

    code
      padding 2px 5px
      background #fafafa
      margin 0

    pre
      padding 10px 15px
      background #fafafa
      margin 1em 0

    blockquote
      padding 10px 15px
      background #fafafa
      margin 1em 0

    blockquote p
      text-indent 0
      margin 2px 0

    h1, h2, h3, h4, h5, h6
      font-weight bold
      color #000
      text-align left

    h1
      font-size 24px

    h2
      font-size 22px

    h3
      font-size 20px

    h4
      font-size 18px

    h5
      font-size 17px

    h6
      font-size 16px

    hr
      border 0 none
      border-top 1px solid var(--color-divider)

</style>
