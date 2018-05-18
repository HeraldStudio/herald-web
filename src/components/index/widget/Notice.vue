<template lang="pug">

  widget.notice(title='通知公告')
    ul.info-bar
      li.info(v-for='site in sites' @click='currentSite = site' :class='{ selected: currentSite == site }')
        .title {{ site }}
    ul.detail-list
      li(v-for='item in filteredNotice' :key='item.title' :class='{ important: item.isImportant }')
        drawer(title='通知内容' @open='loadMarkdown(item)' @close='markdown = ""')
          .top
            .left
              .tag.important(v-if='item.isImportant') 重要
              .tag.attachment(v-if='item.isAttachment') 附件
              span {{ item.title }}
            .right {{ formatDateNatural(item.time) }}
          .bottom(v-if='item.category')
            .left {{ item.category }}
          .content(slot='content')
            .markdown-container(v-if='markdown' v-html='markdown')
            .markdown-container(v-else) 加载中…
    .empty(v-if='!filteredNotice || !filteredNotice.length') 暂无通知

</template>
<script>

  import H from '@/api'
  import widget from './Widget.vue'
  import formatter from '@/util/formatter'
  import drawer from '@/components/Drawer'
  import marked from 'marked'

  marked.setOptions({ gfm: true })

  export default {
    props: ['user'],
    components: { drawer, widget },
    data() {
      return {
        notice: [],
        markdown: '',
        currentSite: null,
      }
    },
    persist: ['notice'],
    created() {
      this.reload()
      if (/[?&]nid=(\d+)/.test(window.location.search)) {
        this.loadMarkdown({ nid: RegExp.$1 })
      }
    },
    watch: {
      user () {
        this.reload()
      }
    },
    computed: {
      sites() {
        return this.notice.map(k => k.site).sort((a, b) => {
          let predef = ['教务处', '总务处', 'SRTP'].reverse()
          a = ~predef.indexOf(a)
          b = ~predef.indexOf(b)
          return a - b
        }).reduce((a, b) => a.slice(-1)[0] === b ? a : a.concat(b), [])
      },
      filteredNotice() {
        if (this.sites.length === 0) {
          return []
        }
        if (!this.currentSite) {
          this.currentSite = this.sites[0]
        }
        return this.notice.filter(k => k.site === this.currentSite)
      }
    },
    methods: {
      ...formatter,
      async reload() {
        let notice = await H.api.notice()
        let competition = await H.api.srtp.competition()
        this.notice = notice.concat(competition.map(k => ({
          title: k.name,
          site: 'SRTP',
          time: k.startTime,
          srtpId: k.id
        }))).sort((a, b) => b.time - a.time)
      },
      async loadMarkdown(notice) {
        if (notice.isAttachment) {
          this.markdown = `[下载附件](${notice.url})`
        } else if (notice.site !== 'SRTP') {
          let res = await H.api.notice.post(notice)
          this.markdown = res
        } else {
          let res = await H.api.srtp.competition.post({ id: notice.srtpId })
          this.markdown = res
        }
        this.markdown = marked(this.markdown.replace(/\*\*/g, ' ** '))
      }
    }
  }

</script>
<style lang="stylus">
  .widget.notice
    li.info
      cursor pointer
      transition .3s

      &:not(.selected)
        background none
        color var(--color-text-bold)
        font-weight normal

    .tag
      display inline-block
      border-radius 3px
      margin-right 5px
      color #ffffff
      font-size 13px
      padding 1px 3px
      vertical-align baseline
      font-weight bold

      &.attachment
        background var(--color-primary)

      &.important
        background var(--color-error)

    .markdown-container
      border-top 1px solid transparent
      margin 0 15px
      transition .3s
      color #555
      text-align justify
      font-size 14px

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
