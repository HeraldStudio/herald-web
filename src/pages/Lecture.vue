<template lang="pug">

  .page
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

  export default {
    data() {
      return {
        lecture: null
      }
    },
    persist: {
      lecture: 'herald-default-lecture'
    },
    async created() {
      this.lecture = await H.api.lecture()
    },
    methods: {
      ...formatter
    }
  }

</script>
