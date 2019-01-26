<template lang="pug">

  router-link.dashboard-item(:class='{ stale: isStale }' :to='route' ondragstart='return false')
    .name {{ name }}
    .value {{ value != null ? value : '···' }}

</template>
<script>

  export default {
    props: ['name', 'value', 'isStale', 'route'],
    data() {
      return {}
    }
  }

</script>
<style lang="stylus">

  .dashboard-item
    display: flex
    flex-direction: row
    align-items: center
    justify-content center
    cursor: pointer
    box-sizing border-box
    flex 0 0 auto
    padding 15px 20px
    position relative
    transition .2s
    min-width 0

    &::after
      content ''
      position absolute
      left 0
      top 0
      width 200%
      height 200%
      border-right 1px solid var(--color-divider)
      border-bottom 1px solid var(--color-divider)
      transform scale(0.5)
      transform-origin top left

    &:active
      background #f8f8f8

    .name
      font-size 15px
      color var(--color-text-bold)
      margin-right 5px
      white-space nowrap
      overflow hidden
      text-overflow ellipsis

    .value
      font-size 18px
      color var(--color-primary)
      flex 1 1 0
      text-align right
      min-width 0
      white-space nowrap
      overflow hidden
      text-overflow ellipsis

</style>
