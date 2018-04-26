<template lang="pug">

  item(title='人文讲座' name='讲座' :value='lecture && lecture.length')
    div(v-if='lecture')
      ul.info-bar
        li.info
          .title 已听讲座次数
          .content {{ lecture.length }}
        li.info
          .title 剩余讲座次数
          .content {{ Math.max(0, 8 - lecture.length) }}
      ul.detail-list
        li(v-for='item in lecture')
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
        lecture: null
      }
    },
    persist: ['lecture'],
    created() {
      this.reload()
    },
    methods: {
      ...formatter,
      async reload() {
        this.lecture = await H.api.lecture()
      }
    }
  }

</script>
