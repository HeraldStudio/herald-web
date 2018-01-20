<template lang="pug">
   
  .widget.srtp
    .title
      .zh SRTP
      .en Student Research Training Program
      .reload(@click='reload()')
    .empty(v-if='!srtp')
      .zh 加载中
      .en Loading...
    div(v-else)
      ul.info-bar
        li.info
          .title
            .zh SRTP学分
            .en SRTP points
          .content {{ srtp[0].total }}
        li.info
          .title
            .zh SRTP状态
            .en SRTP grade
          .content {{ srtp[0].score }}
      ul.detail-list
        li(v-for='k in srtp.slice(1)')
          .top
            .left {{ k.project }}
          .bottom
            .left {{ k.credit + (k.proportion ? ' (' + k.proportion + ')' : '') }}
            .right {{ k.date + ' · ' + k.type }}
   
</template>
<script>

  import api from '../../api'
  import formatter from "../../util/formatter";

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
        this.srtp = (await api.post('/api/srtp')).data.content
      }
    }
  }
  
</script>