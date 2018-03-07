<template lang=pug>

  .widget.dashboard
    .title 信息板
    .dashboard-container
      card
      pe
      lecture
      srtp
      grade

</template>

<script>
  import card from './dashboard/Card.vue'
  import pe from './dashboard/Pe.vue'
  import lecture from './dashboard/Lecture.vue'
  import srtp from './dashboard/Srtp.vue'
  import grade from './dashboard/Grade.vue'

  export default {
    components: {
      card, pe, lecture, srtp, grade,
    },
    data () {
      return {}
    }
  }
</script>

<style lang="stylus">

  .columns .widgets .widget.dashboard
    padding 20px 10px

    .dashboard-container
      width 100%
      display: block
      white-space: nowrap
      overflow-x: scroll
      box-sizing: border-box
      text-align: center

      > *
        display: inline-block
        box-sizing: border-box
        width 25%

        + *
          border-left 1px solid var(--color-divider)


</style>
