<template lang="pug">

  .page
    div(v-if='srtp')
      ul.info-bar
        li.info
          .title SRTP学分
          .content {{ srtp.info.points }}
        li.info
          .title SRTP状态
          .content {{ srtp.info.grade }}
      ul.detail-list
        li(v-for='k in srtp.projects')
          .top
            .left {{ k.project }}
          .bottom
            .left {{ k.credit + (k.proportion !== 1 ? ' (' + k.proportion * 100 + '%)' : '') }}
            .right {{ k.date + ' · ' + k.type }}

</template>
<script>

  import api from '@/api'
  import formatter from '@/util/formatter'

  export default {
    data() {
      return {
        srtp: null
      }
    },
    persist: {
      srtp: 'herald-default-srtp'
    },
    async created() {
      this.srtp = await api.get('/api/srtp')
    }
  }

</script>
