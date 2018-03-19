<template lang=pug>

  widget.dashboard(title='信息板')
    .info-container
      .name {{ user ? user.name : '加载中' }}
      .identity {{ user ? user.identity : '…' }}
      button(@click='logout()') 注销
    .dashboard-container
      card
      pe
      lecture
      srtp
      grade

</template>

<script>
  import widget from './Widget.vue'
  import card from './dashboard/Card.vue'
  import pe from './dashboard/Pe.vue'
  import lecture from './dashboard/Lecture.vue'
  import srtp from './dashboard/Srtp.vue'
  import grade from './dashboard/Grade.vue'
  import H from '@/api'

  export default {
    props: ['isLogin'],
    components: {
      card, pe, lecture, srtp, grade,
      widget,
    },
    data () {
      return {
        user: null
      }
    },
    async created () {
      if (this.isLogin) {
        this.user = await H.api.user()
      }
    },
    watch: {
      async isLogin() {
        if (this.isLogin) {
          this.user = await H.api.user()
        }
      }
    },
    methods: {
      logout() {
        H.deauth()
      }
    }
  }
</script>

<style lang="stylus">

  .columns .widgets .widget.dashboard
    padding 20px 10px

    .info-container
      padding 0 5px 15px
      border-bottom 1px solid var(--color-divider)
      margin 0 10px 20px
      display flex
      flex-direction row
      align-items: baseline

      * + *
        margin-left 10px

      .name
        font-size 17px
        flex 0 0 auto
        white-space: nowrap
        color var(--color-text-regular)

      .identity
        font-size 12px
        flex 1 1 0
        white-space: nowrap
        color var(--color-text-secondary)

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
        width 20%

        + *
          border-left 1px solid var(--color-divider)


</style>
