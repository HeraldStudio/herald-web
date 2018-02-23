<template lang="pug">

  .widget.lecture
    .title 人文讲座
      .reload(@click='reload()')
    .empty(v-if='!lectures') 加载中
    div(v-else)
      ul.info-bar
        li.info
          .title 已听讲座次数
          .content {{ lectures.length }}
        li.info
          .title 剩余讲座次数
          .content {{ Math.max(0, 8 - lectures.length) }}
      ul.detail-list
        li(v-for='item in lectures')
          .top
            .left {{ formatTimeNatural(item.time) }}
            .right {{ item.location }}

</template>
<script>

  import H from '@/api'
  import formatter from '@/util/formatter'

  export default {
    data() {
      return {
        lectures: null
      }
    },
    created() {
      this.reload()
    },
    methods: {
      ...formatter,
      async reload() {
        this.lectures = await H.api.lecture()
      }
    }
  }

</script>
