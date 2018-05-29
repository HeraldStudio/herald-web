<template lang="pug">

  transition(name='slide')
    .widget(v-if='show' :class='{ stale: isStale }')
      slot

</template>
<script>

  export default {
    props: {
      show: {
        default: true
      },
      title: String, 
      isStale: Boolean
    },
    data: () => ({})
  }

</script>
<style lang="stylus">

  .slide-enter-active, .slide-leave-active
    transition .3s !important

  .slide-enter, .slide-leave-to
    transform translateY(-100px) !important
    opacity 0 !important

  .slide-leave-active
    position absolute

  .widget
    position relative
    box-sizing border-box
    -webkit-transition: .3s
    -moz-transition: .3s
    -ms-transition: .3s
    -o-transition: .3s
    transition: .3s
    display flex
    flex-direction column
    background #fff
    padding 20px 15px
    border-bottom 1px solid var(--color-divider)

    @media screen and (max-width: 600px)
      border-bottom-width 10px

    .empty
      display block
      text-align center
      color #888
      font-size 14px

    ul.info-bar
      width 100%
      box-sizing border-box
      margin 0
      padding 5px 5px 0 10px
      display flex
      flex-direction row
      justify-content center
      flex-wrap wrap

      li.info
        list-style none
        flex 0 1 auto
        padding 0 10px
        margin 0 5px 5px 0
        display flex
        flex-direction row
        justify-content center
        font-size 14px
        padding 3px 7px
        color var(--color-primary-dark)
        background var(--color-primary-bg)
        border-radius 3px

        .title
          font-weight bold

          + .content
            margin-left 5px

      +ul.detail-list>*:first-child
        margin-top 15px
        border-top 1px solid var(--color-divider)
        padding-top 10px

    .drawer-view ul.detail-list
      padding 0

    ul.detail-list
      width 100%
      margin 0
      padding 0 10px
      box-sizing border-box
      display flex
      flex-direction column
      white-space normal

      > li + li
        border-top 1px solid var(--color-divider)

      > li
        list-style none
        flex 1 1 auto
        padding 10px 0
        display flex
        flex-direction column
        text-align justify
        word-break break-all
        color var(--color-text-bold)

        &.section
          border-top 1px solid var(--color-divider)
          margin-top 10px
          padding-top 10px !important
          font-weight bold

        .top, .bottom
          display flex
          flex-direction row
          // align-items center

        .top + .bottom
          margin-top 2px

        .left
          flex 1 1 auto

        .right
          flex 0 0 auto
          margin-left 20px

        .top .left
          font-size 15px
          color var(--color-primary)

        .top .right, .bottom .left
          font-size 13px

        .top .right
          font-weight bold
          color var(--color-text-bold)

        .bottom .right
          font-size 13px
          color #888

        &:last-child
          padding-bottom 0

        &:first-child
          padding-top 0

</style>
