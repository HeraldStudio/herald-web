<template lang="pug">

  .admin-container
    drawer(title='系统概况' v-if='user.admin.maintenance')
      .function 概况
      .content(slot='content')
        monitor
    drawer(title='权限管理' v-if='user.admin.maintenance')
      .function 权限
      .content(slot='content')
        privilege
    drawer(title='通知公告' v-if='user.admin.maintenance')
      .function 通知
      .content(slot='content')
        notice
    drawer(title='轮播管理' v-if='user.admin.publicity')
      .function 轮播管理
      .content(slot='content')
        banner
    drawer(title='活动管理' v-if='user.admin.publicity')
      .function 活动管理
      .content(slot='content')
        activity

</template>
<script>

  import H from '@/api'
  import widget from '../Widget.vue'
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

  .admin-container
    padding 0 10px 15px
    display flex
    flex-direction row
    align-items center

    .subtitle
      font-size 12px
      color var(--color-text-secondary)
      flex 1 1 0

    .drawer-wrapper
      + .drawer-wrapper .function
        padding-left 7px
        border-left 1px solid var(--color-divider)
        margin-left 7px

    .admin-page
      .title
        font-size 22px
        margin-bottom 20px

      .subcontainer
        text-align center
        overflow-x scroll

        + .subcontainer
          border-top 1px solid var(--color-divider)
          padding-top 20px
          margin-top 20px

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
