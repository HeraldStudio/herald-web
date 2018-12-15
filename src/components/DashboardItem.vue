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
    height 36px
    display: flex
    flex-direction: row
    align-items: center
    justify-content center
    cursor: pointer
    box-sizing border-box
    flex 0 0 auto
    margin 5px
    padding 7px 10px
    background #f7f7f7
    border-radius 5px
    transition .2s

    &.cols-1
      width calc(100% - 10px)

      .value
        font-size 14px
        color var(--color-text-regular)

    &.cols-2
      width calc(50% - 10px)

    &.cols-3
      width calc(33.3% - 10px)

    &.cols-4
      width calc(25% - 10px)

    &.cols-5
      width calc(20% - 10px)

    &:active
      filter brightness(0.95)

    .name
      font-size 14px
      color var(--color-text-secondary)
      margin-right 5px
      min-width 0
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
