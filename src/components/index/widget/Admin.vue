<template lang="pug">

  widget.admin(title='管理中心' :show='user && user.admin')
    .functions
      drawer(title='系统概况' v-if='user.admin.maintenance')
        button.title 系统概况
        .content(slot='content')
          monitor
      drawer(title='权限管理' v-if='user.admin.maintenance')
        button.title 权限
        .content(slot='content')
          privilege
      drawer(title='通知公告' v-if='user.admin.maintenance')
        button.title 通知
        .content(slot='content')
          notice
      drawer(title='轮播管理' v-if='user.admin.publicity')
        button.title 轮播管理
        .content(slot='content')
          banner
      drawer(title='活动管理' v-if='user.admin.publicity')
        button.title 活动管理
        .content(slot='content')
          activity

</template>
<script>

  import H from '@/api'
  import widget from './Widget.vue'
  import drawer from '@/components/Drawer.vue'
  import monitor from './admin/Monitor.vue'
  import privilege from './admin/Privilege.vue'
  import notice from './admin/Notice.vue'
  import banner from './admin/Banner.vue'
  import activity from './admin/Activity.vue'

  export default {
    props: ['user'],
    components: { widget, drawer, monitor, privilege, notice, banner, activity },
    data() {
      return {}
    }
  }

</script>
<style lang="stylus">

  .widget.admin

    .functions
      display flex
      flex-flow row wrap
      margin-right -5px
      margin-top -5px
      align-items center
      justify-content center

      button.title
        margin-right 5px
        margin-top 5px

      .admin-page
        .title
          font-size 22px
          margin-bottom 20px

        .subcontainer
          border-top 1px solid var(--color-divider)
          padding 20px 0
          text-align center
          overflow-x scroll

        .subtitle
          padding 0 7px
          text-align center
          font-size 16px
          font-weight bold
          color var(--color-text-bold)
          margin-bottom 20px

        .summary
          display inline-block
          font-size 13px
          color var(--color-text-secondary)
          margin 0 5px 20px

        table
          max-width 100%

          th, td
            white-space nowrap
        
        input
          min-width 100px

          &.vdatetime-input
            min-width 115px
        
</style>
