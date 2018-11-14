<template lang='pug'>
  .tab-container
    scrollView.tabs(:key='currentTab')
      home(:user='user' v-if='currentTab == "home"')
      discover(:user='user' v-if='currentTab == "discover"')
      notice(:user='user' v-if='currentTab == "notice"')
    .tab-bar
      .tab-item.tab-item-home(@click='currentTab = "home"' :class='{ selected: currentTab == "home" }')
        img.icon(:src='currentTab == "home" ? tabHomeSelectedImg : tabHomeImg')
        p.title 首页
      .tab-item.tab-item-discover(@click='currentTab = "discover"' :class='{ selected: currentTab == "discover" }')
        img.icon(:src='currentTab == "discover" ? tabDiscoverSelectedImg : tabDiscoverImg')
        p.title 活动
      .tab-item.tab-item-notice(@click='currentTab = "notice"' :class='{ selected: currentTab == "notice" }')
        img.icon(:src='currentTab == "notice" ? tabNoticeSelectedImg : tabNoticeImg')
        p.title 通知
</template>

<script>
  import home from './TabHome.vue'
  import discover from './TabDiscover.vue'
  import notice from './TabNotice.vue'
  import scrollView from '../components/ScrollView.vue'

  import tabHomeImg from 'static/images/tab-home.png'
  import tabNoticeImg from 'static/images/tab-notice.png'
  import tabDiscoverImg from 'static/images/tab-discover.png'
  import tabHomeSelectedImg from 'static/images/tab-home-selected.png'
  import tabNoticeSelectedImg from 'static/images/tab-notice-selected.png'
  import tabDiscoverSelectedImg from 'static/images/tab-discover-selected.png'

  export default {
    props: ['user'],
    components: {
      home, discover, notice, scrollView
    },
    data () {
      return {
        currentTab: 'home',
        tabHomeImg,
        tabNoticeImg,
        tabDiscoverImg,
        tabHomeSelectedImg,
        tabNoticeSelectedImg,
        tabDiscoverSelectedImg
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

  .tab-container
    display flex
    flex-direction column
    align-items stretch
    overflow hidden
    flex 1 1 0

    .tabs
      flex 1 1 0
      display flex
      flex-direction row
      align-items flex-start
      overflow hidden
      position relative

      .tab
        display flex
        flex-direction column
        flex 1 1 0
        padding 0

    .tab-bar
      width 100%
      height 50px
      flex 0 0 50px
      background #fff
      border-top 0.5px solid var(--color-divider)
      display flex
      flex-direction row
      align-items center
      z-index 999

      @media screen and (max-width: 600px)
        max-width none

      .tab-item
        flex 1 1 0
        display flex
        flex-direction row
        align-items center
        justify-content center
        cursor pointer
        transform-origin center
        transition .5s

        .icon
          width 32px
          height 32px
          filter hue-rotate(-15deg)

        .title
          color var(--color-text-secondary)
          font-size 13px
          line-height 1.1em
          margin-left 5px
        
        &.selected
          transform scale(1.1)

          @keyframes shake
            0%
              transform rotate(0)
            20%
              transform rotate(20deg)
            40%
              transform rotate(-15deg)
            60%
              transform rotate(10deg)
            80%
              transform rotate(-5deg)
            100%
              transform rotate(0)

          .icon
            animation-name shake
            animation-duration 1s
            animation-iteration-count 1

          .title
            color var(--color-primary)

  .mina .tab-bar
    display none

</style>
