
<template lang="pug">

  .page.schedule
    .empty(v-if='!schedule') 暂无校历信息
    img.left(:src='schedule')
    img.right(:src='schedule')

</template>
<script>

  import api from '@/api'

  export default {
    data() {
      return {
        schedule: ''
      }
    },
    persist: {
      schedule: 'herald-default-schedule'
    },
    async created() {
      this.schedule = await api.get('/api/schedule')
    }
  }

</script>
<style lang="stylus" scoped>
  .page.schedule
    overflow hidden
    padding 0

    img
      width: 200%
      height: auto
      object-fit: contain
      filter grayscale() contrast(1.3)

      &.left
        margin-left -1%
        margin-top -1%
      
      &.right
        margin-left -99%
        margin-top -2%
</style>
