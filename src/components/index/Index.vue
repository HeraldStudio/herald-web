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
    watch: {
      currentTab () {
        document.body.scrollTop = 0
      }
    },
    methods: {

    }
  }
</script>

<style lang="stylus">

  // 神秘代码，同时适配 PC/Pad/Phone 三种布局，修改时请注意全面调试（Safari 开发菜单 -> 进入响应式设计模式）

  .tab-container

    @media screen and (max-width: 1200px)
      display flex
      flex-direction column
      align-items stretch
      margin-bottom 50px

    .tabs
      display flex
      flex-direction row
      align-items flex-start
      max-width var(--left-column-width)

      @media screen and (max-width: 600px)
        max-width none

      @media screen and (max-width: 1200px)
        overflow hidden
        position relative

      .tab
        display flex
        flex-direction column
        align-items flex-start
        flex 1 1 0
        padding 0

        @media screen and (max-width: 1200px)
          display none
          
          &.active
            display block

    .tab-bar
      display none
      max-width var(--left-column-width)

      @media screen and (max-width: 600px)
        max-width none

      @media screen and (max-width: 1200px)
        position fixed
        bottom 0
        left 0
        right 0
        height 50px
        z-index 9999
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
          justify-content center
          cursor pointer

          .icon
            width 32px
            height 32px
            filter hue-rotate(-15deg)

          .title
            color var(--color-text-secondary)
            font-size 11px
            line-height 1.1em
            margin-bottom 3px

</style>
