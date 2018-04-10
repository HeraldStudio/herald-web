<template lang="pug">

  transition(name='slide')
    .widget(v-if='show')
      .widget-title {{ title }}
      slot

</template>
<script>

  export default {
    props: {
      show: {
        default: true
      },
      title: String
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
    margin 40px 10px 10px
    padding 20px 15px
    box-shadow 0 3px 15px rgba(0, 0, 0, .07)
    border 1px solid transparent
    width 380px
    box-sizing border-box
    -webkit-transition: .3s
    -moz-transition: .3s
    -ms-transition: .3s
    -o-transition: .3s
    transition: .3s
    display flex
    flex-direction column

    @media screen and (min-width: 600px)
      &:hover
        border 1px solid var(--color-primary)

    &.loading
      opacity .5

    @media screen and (max-width: 600px)
      margin 50px 0 0
      padding 20px 15px
      width auto
      box-shadow none
      border-bottom 1px solid var(--color-divider)

    .empty
      display block
      text-align center
      color #888
      font-size 14px

    .widget-title
      position absolute
      left -1px
      top -30px
      height 26px
      line-height 26px
      vertical-align middle
      padding 0 7px
      text-align left
      font-size 13px
      border-radius 3px
      font-weight bold
      background var(--color-text-bold)
      color #fff
      margin-bottom 20px
      display flex
      flex-direction row
      align-items center

      @media screen and (max-width: 600px)
        left 0
        right 0
        top -40px
        justify-content center
        background none
        color var(--color-text-regular)
        font-size 15px
        padding 5px 0

      &::before
        content ''
        position absolute
        bottom -4px
        left 50%
        margin-left -3px
        border-left 3px solid transparent
        border-right 3px solid transparent
        border-top 4px solid var(--color-text-bold)

      .reload
        width 16px
        height 18px
        margin-left 5px
        cursor pointer
        -webkit-transition: 1s
        -moz-transition: 1s
        -ms-transition: 1s
        -o-transition: 1s
        transition: 1s
        display none

        &:active
          transform rotate(-360deg)
          -webkit-transition: 0s
          -moz-transition: 0s
          -ms-transition: 0s
          -o-transition: 0s
          transition: 0s
          transform-origin 50% 40%

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

        .top, .bottom
          display flex
          flex-direction row
          align-items center

        .top + .bottom
          margin-top 5px

        .left
          flex 1 1 auto

        .right
          flex 0 0 auto
          margin-left 20px

        .top .left
          font-size 15px
          color var(--color-primary)

        .top .right, .bottom .left
          font-size 14px

        .bottom .left
          font-weight bold

        .bottom .right
          font-size 14px
          color #888

        &:last-child
          padding-bottom 0

        &:first-child
          padding-top 0

</style>
