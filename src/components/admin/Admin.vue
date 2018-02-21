<template lang='pug'>
  #admin
    .sidebar-container
      sidebar(:current='currentPage' @changePage='changePage')
    .page-container
      monitor(v-if='currentPage === "monitor"')
</template>
<script>
  import sidebar from './Sidebar.vue'
  import monitor from './pages/Monitor.vue'

  export default {
    components: {
      sidebar,
      monitor
    },
    data () {
      return {
        currentPage: 'monitor'
      }
    },
    methods: {
      changePage (newPage) {
        this.currentPage = newPage
      }
    }
  }
</script>
<style lang='stylus'>
  #admin
    position absolute
    top 60px
    bottom 0
    left 0
    right 0
    max-width 1220px
    margin 0 auto
    --sidebar-width 200px

    .sidebar-container
      position sticky
      position -webkit-sticky
      top 0
      left 0
      bottom 0
      min-height 100%
      width var(--sidebar-width)
      border-right 1px solid var(--divider-color)

    .page-container
      position absolute
      top 0
      left var(--sidebar-width)
      right 0
</style>
