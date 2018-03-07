<template lang="pug">

  .dashboard-item-wrapper
    drawer(:title='title' @open='$emit("drawerOpen")')
      .dashboard-item
        .name {{ name }}
        .value {{ value == null ? '···' : value }}
      .content(slot='content' v-if='value != null')
        slot(v-if='value != null')

</template>
<script>

  import drawer from '@/components/Drawer.vue'

  export default {
    components: { drawer },
    props: ['name', 'value', 'title'],
    data() {
      return {}
    }
  }

</script>
<style lang="stylus">

  .dashboard-item
    display: flex
    flex-direction: column
    align-items: center
    cursor: pointer

    > * + *
      margin-top: 5px

    .name
      font-size 14px
      color var(--color-text-secondary)

    .value
      font-size 18px
      color var(--color-primary)

    .mask
      position: fixed
      overflow: hidden
      top 0
      left 0
      bottom 0
      right 0
      margin 0
      background: rgba(#000, .5)
      z-index: 99999
      cursor: default
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
      opacity: 0
      pointer-events: none
      transition: .2s

      @media screen and (max-width: 400px)
        width 100%
        justify-content: flex-end

      &.shown
        opacity: 1
        pointer-events: all

      &.shown .drawer
        transform none

      .drawer
        transform translateY(100%)
        overflow: hidden
        background: #fff
        z-index: 100000
        box-sizing: border-box
        width: 400px
        box-shadow: 0 0 20px rgba(0, 0, 0, .1)
        cursor: default
        display: flex
        flex-direction: column
        padding 10px 0
        overflow-y: scroll
        transition: .3s

        @media screen and (max-width: 400px)
          width 100%

        .title-bar
          margin 0 25px
          padding 15px 0
          display: flex
          flex-direction: row
          justify-content: center
          align-items: center

          .title
            font-size: 16px
            font-weight: bold

        .drawer-view
          padding 15px

</style>
