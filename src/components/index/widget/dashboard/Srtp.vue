<template lang="pug">

  item(title='SRTP' name='SRTP' :value='srtp && srtp.info.points')
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

  import H from '@/api'
  import formatter from '@/util/formatter'
  import item from '../DashboardItem.vue'

  export default {
    components: {
      item
    },
    data() {
      return {
        srtp: null
      }
    },
    persist: ['srtp'],
    created() {
      this.reload()
    },
    methods: {
      async reload() {
        this.srtp = await H.api.srtp()
      }
    }
  }

</script>
