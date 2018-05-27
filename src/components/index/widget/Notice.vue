<template lang="pug">

  widget.notice(title='通知公告')
    ul.info-bar
      li.info(v-for='site in sites' @click='currentSite = site' :class='{ selected: currentSite == site }')
        .title {{ site }}
    ul.detail-list
      li(v-for='item in filteredNotice' :key='item.title' :class='{ important: item.isImportant }')
        drawer(title='通知内容' @open='loadMarkdown(item)')
          .top
            .left
              .tag.important(v-if='item.isImportant') 重要
              .tag.attachment(v-if='item.isAttachment') 附件
              span {{ item.title }}
            .right {{ formatDateNatural(item.time) }}
          .bottom(v-if='item.category')
            .left {{ item.category }}
          .content(slot='content')
            markdown(:markdown='item.markdown')
    .empty(v-if='!filteredNotice || !filteredNotice.length') 暂无通知

</template>
<script>

  import H from '@/api'
  import widget from './Widget.vue'
  import formatter from '@/util/formatter'
  import drawer from '@/components/Drawer'
  import markdown from '@/components/Markdown'

  export default {
    props: ['user'],
    components: { drawer, widget, markdown },
    data() {
      return {
        notice: [],
        markdown: '',
        currentSite: null,
      }
    },
    persist: {
      notice: 'herald-default-notice'
    },
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
        return this.notice.map(k => k.site)
          .sort().filter((k, i, a) => a.indexOf(k) === i)
          .sort((a, b) => {
            let predef = ['教务处', '总务处', 'SRTP'].reverse()
            a = ~predef.indexOf(a)
            b = ~predef.indexOf(b)
            return a - b
          })
          .reduce((a, b) => a.slice(-1)[0] === b ? a : a.concat(b), [])
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
          notice.markdown = `[下载附件](${notice.url})`
        } else if (notice.site !== 'SRTP') {
          let res = await H.api.notice.post(notice)
          notice.markdown = res
        } else {
          let res = await H.api.srtp.competition.post({ id: notice.srtpId })
          notice.markdown = res
        }
        this.notice = this.notice.slice()
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

    .important .top .left
      font-weight bold

    .tag
      display inline-block
      border-radius 3px
      margin-right 5px
      color #ffffff
      font-size 13px
      padding 1px 3px
      vertical-align baseline
      background var(--color-primary)

      &.important
        font-weight bold

</style>
