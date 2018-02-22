<template lang='pug'>
  #admin(v-if='isAdmin')
    .sidebar-container
      sidebar(:current='currentPage' @changePage='changePage')
    .page-container
      monitor(v-if='currentPage === "monitor"')
      privilege(v-if='currentPage === "privilege"')
</template>
<script>
  import sidebar from './Sidebar.vue'
  import monitor from './pages/Monitor.vue'
  import privilege from './pages/Privilege.vue'

  export default {
    props: ['isLogin', 'isAdmin'],
    components: {
      sidebar,
      monitor,
      privilege
    },
    data () {
      return {
        currentPage: 'monitor'
      }
    },
    watch: {
      isAdmin () {
        if (!this.isAdmin) {
          location.hash = '#/'
        }
      },
      isLogin () {
        if (!this.isAdmin) {
          location.hash = '#/'
        }
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
      box-sizing border-box
      border-right 1px solid var(--divider-color)

    .page-container
      position absolute
      top 0
      left var(--sidebar-width)
      right 0
      padding 40px 0 40px 50px

      .admin-page
        .title
          font-size 24px
          color #555
          padding-bottom 25px

        .loading
          display block
          font-size 14px
          color #888

        .subcontainer
          position relative
          margin 0 10px 10px 0
          padding 25px
          box-shadow 0 3px 15px rgba(0, 0, 0, .07)
          border 1px solid transparent
          box-sizing border-box
          -webkit-transition: .3s
          -moz-transition: .3s
          -ms-transition: .3s
          -o-transition: .3s
          transition: .3s

          @media screen and (min-width: 600px)
            &:hover
              border 1px solid var(--theme-color-light)

          .subtitle
            display inline-block
            font-size 18px
            padding-bottom 20px

          .summary
            display inline
            font-size 14px
            margin-left 15px
            color #888
            vertical-align middle

</style>
