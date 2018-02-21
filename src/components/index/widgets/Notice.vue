<template lang="pug">

  .widget.notice
    .title
      .zh 教务通知
      .en Notices
      .reload(@click='reload()')
    ul.detail-list
      li(v-for='item in notices' :class='{ important: item.isImportant }')
        a(:href='item.url' target='_blank')
          .top
            .left {{ item.title }}
          .bottom
            .left.zh 发布于 {{ formatDateNatural(item.time) }}
            .left.en Published at {{ formatDateNatural(item.time) }}
            .right {{ item.category }}
    .empty(v-if='!notices.length')
      .zh 暂无通知
      .en Nothing here

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
<style>
  .important .top .left {
    font-weight: bold;
  }
</style>
