<template lang="pug">
   
  .widget.notice
    .title
      .zh 教务通知
      .en Notices
      .reload(@click='reload()')
    ul.detail-list
      li(v-for='item in notices')
        a(:href='item.href' target='_blank')
          .top
            .left {{ item.title }}
          .bottom
            .left.zh 发布于 {{ item.time }}
            .left.en Published {{ item.time }}
    .empty(v-if='!notices.length')
      .zh 暂无通知
      .en Nothing here
   
</template>
<script>

  import api from '../../api'
  import formatter from "../../util/formatter";

  export default {
    data() {
      return {
        notices: []
      }
    },
    created() {
      this.reload()
    },
    methods: {
      async reload() {
        let now = new Date()
        let notices = (await api.post('/api/jwc')).data.content
        this.notices = Object.keys(notices)
          .filter(k => k !== '最新动态')
          .map(k => notices[k] || [])
          .reduce((a, b) => a.concat(b), [])
          .map(k => {
            let [y, M, d] = k.date.split('-')
            k.time = new Date(y, M - 1, d)
            return k
          }).filter(k => k.time > now - 1000 * 60 * 60 * 24 * 2).map(k => {
            k.time = formatter.formatDateNatural(k.time)
            return k
          })
      }
    }
  }
  
</script>