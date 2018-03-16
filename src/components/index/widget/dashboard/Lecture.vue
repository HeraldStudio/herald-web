<template lang="pug">

  item(title='人文讲座' name='讲座' :value='lectures && lectures.length')
    div(v-if='lectures')
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
  import item from '../DashboardItem.vue'

  export default {
    components: {
      item
    },
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
