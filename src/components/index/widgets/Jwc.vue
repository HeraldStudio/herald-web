<template lang="pug">

  .widget.jwc
    .title 教务通知
      .reload(@click='reload()')
    ul.detail-list
      li(v-for='item in notices' :class='{ important: item.isImportant }')
        a(:href='item.url' target='_blank')
          .top
            .left {{ item.title }}
          .bottom
            .left {{ item.category }}
            .right 发布于 {{ formatDateNatural(item.time) }}
    .empty(v-if='!notices.length') 暂无通知

</template>
<script>

  import H from '@/api'
  import formatter from '@/util/formatter'

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
      ...formatter,
      async reload() {
        this.notices = await H.api.jwc()
      }
    }
  }

</script>
<style scoped>
  .important .top .left {
    font-weight: bold;
  }
</style>
