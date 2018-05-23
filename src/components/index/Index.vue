<template lang='pug'>
  .tab-container
    .tabs
      home(:user='user' :class='{ active: currentTab == "home" }')
      discover(:user='user' :class='{ active: currentTab == "discover" }')
      notice(:user='user' :class='{ active: currentTab == "notice" }')
    .tab-bar
      .tab-item.tab-item-home(@click='currentTab = "home"')
        img.icon(:src='currentTab == "home" ? "static/images/tab-home-selected.png" : "static/images/tab-home.png"')
        p.title 首页
      .tab-item.tab-item-discover(@click='currentTab = "discover"')
        img.icon(:src='currentTab == "discover" ? "static/images/tab-discover-selected.png" : "static/images/tab-discover.png"')
        p.title 活动
      .tab-item.tab-item-notice(@click='currentTab = "notice"')
        img.icon(:src='currentTab == "notice" ? "static/images/tab-notice-selected.png" : "static/images/tab-notice.png"')
        p.title 通知
</template>

<script>
  import home from './TabHome.vue'
  import discover from './TabDiscover.vue'
  import notice from './TabNotice.vue'

  export default {
    props: ['user'],
    components: {
      home, discover, notice
    },
    data () {
      return {
        currentTab: 'home'
      }
    },
    async created () {

    },
    methods: {

    }
  }
</script>

<style lang="stylus">

  .tabs
    display flex
    flex-direction row
    align-items flex-start

    .tab
      display flex
      flex-direction column
      align-items flex-start
      flex 1 1 0
      padding 0

  .tab-bar
    display none

  @media screen and (max-width: 600px)
    .tab-container
      position fixed
      top 100px
      left 0
      right 0
      bottom 0
      display flex
      flex-direction column
      align-items stretch

      .tabs
        flex 1 1 0
        overflow hidden
        position relative

        .tab
          position absolute
          top 0
          left 0
          right 0
          bottom 0
          overflow-y scroll
          display none

          &.active
            display block

      .tab-bar
        z-index 999
        flex 0 0 60px
        background #fff
        border-top 1px solid var(--color-divider)
        box-shadow 0 -5px 15px rgba(0, 0, 0, .05)
        display flex
        flex-direction row
        align-items center

        .tab-item
          flex 1 1 auto
          display flex
          flex-direction column
          align-items center

          .icon
            width 32px
            height 32px
            margin-top 3px
            filter hue-rotate(-15deg)

          .title
            color var(--color-text-secondary)
            font-size 12px

</style>
