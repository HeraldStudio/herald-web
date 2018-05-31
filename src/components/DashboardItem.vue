<template lang="pug">

  router-link(:to='route' ondragstart='return false')
    .dashboard-item(:class='{ stale: isStale }')
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

</style>
