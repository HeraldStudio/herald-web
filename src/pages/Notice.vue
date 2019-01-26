<template lang="pug">

  .page.notice
    ul.info-bar
      li.info(v-for='site in sites' @click='currentSite = site' :class='{ selected: currentSite == site }')
        .title {{ site }}
    ul.detail-list
      li(v-for='item in filteredNotice' :key='item.title' :class='{ important: item.isImportant }')
        a(:href='noticeLink(item)')
          .top
            .left
              .tag.important(v-if='item.isImportant') 重要
              .tag.attachment(v-if='item.isAttachment') 附件
              span {{ item.title }}
            .right {{ formatDateNatural(item.time) }}
          .bottom(v-if='item.category')
            .left {{ item.category }}
    .empty(v-if='!filteredNotice || !filteredNotice.length') 暂无通知

</template>
<script>
  import api from '@/api'
  import Vue from 'vue'
  import formatter from '@/util/formatter'
  import markdown from '@/components/Markdown'

  const RouterLink = Vue.component('router-link')

  export default {
    props: ['user'],
    components: { markdown },
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
            let predef = ['SRTP', '总务处', '教务处']
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
        let notice = await api.get('/api/notice')
        let competition = await api.get('/api/srtp/competition')
        this.notice = notice.concat(competition.map(k => ({
          title: k.name,
          site: 'SRTP',
          time: k.startTime,
          srtpId: k.id
        }))).sort((a, b) => b.time - a.time)
      },
      noticeLink(notice) {
        if (notice.isAttachment) {
          return notice.url
        }
        if (notice.site === 'SRTP') {
          return '#/notice/competition/' + notice.srtpId
        }
        if (notice.nid != null) {
          return '#/notice/' + notice.nid
        }
        return '#/notice/url/' + encodeURIComponent(notice.url)
      }
    }
  }

</script>
<style lang="stylus">
  .page.notice
    li.info
      cursor pointer
      transition .3s

      &:not(.selected)
        background none
        color var(--color-text-bold)

        .title
          font-weight normal

</style>
