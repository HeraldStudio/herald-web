<template lang="pug">

  .widget.srtp
    .title SRTP
      .reload(@click='reload()')
    .empty(v-if='!srtp') 加载中
    div(v-else)
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

  export default {
    data() {
      return {
        srtp: null
      }
    },
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
