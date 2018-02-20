<template lang="pug">

  .widget.lecture
    .title
      .zh 人文讲座
      .en Cultural lecture
      .reload(@click='reload()')
    .empty(v-if='!lectures')
      .zh 加载中
      .en Loading...
    div(v-else)
      ul.info-bar
        li.info
          .title
            .zh 已听讲座次数
            .en Lectures taken
          .content {{ lectures.length }}
        li.info
          .title
            .zh 剩余讲座次数
            .en Remaining lecs.
          .content {{ Math.max(0, 8 - lectures.length) }}
      ul.detail-list
        li(v-for='item in lectures')
          .top
            .left {{ formatTimeNatural(item.time) }}
            .right {{ item.location }}

</template>
<script>

  import H from '../../api'
  import formatter from '../../util/formatter'

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
