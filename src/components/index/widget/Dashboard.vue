<template lang='pug'>

  widget.dashboard(title='信息板')
    .info-container
      .name {{ user ? user.name : '加载中' }}
      .identity {{ user ? user.identity : '…' }}
      img.icon(@click='logout()' src='static/images/logout.png')
    .dashboard-container(v-if='user')
      card
      pe(v-if='/本科/.test(user.identity)')
      lecture(v-if='/本科/.test(user.identity)')
      srtp(v-if='/本科/.test(user.identity)')
      grade(v-if='/生/.test(user.identity)' :isGraduate='!/本科/.test(user.identity)')
      library

</template>

<script>
  import widget from './Widget.vue'
  import card from './dashboard/Card.vue'
  import pe from './dashboard/Pe.vue'
  import lecture from './dashboard/Lecture.vue'
  import srtp from './dashboard/Srtp.vue'
  import grade from './dashboard/Grade.vue'
  import library from './dashboard/Library.vue'
  import H from '@/api'

  export default {
    props: ['user'],
    components: {
      card, pe, lecture, srtp, grade, library,
      widget,
    },
    data: () => ({}),
    methods: {
      logout() {
        H.token = ''
      }
    }
  }
</script>

<style lang="stylus">

  .widget.dashboard
    padding 20px 10px

    .info-container
      padding 0 5px 15px
      border-bottom 1px solid var(--color-divider)
      margin 0 10px 20px
      display flex
      flex-direction row
      align-items: center

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

      .icon
        width 20px
        height 20px
        cursor pointer

    .dashboard-container
      width 100%
      display: block
      white-space: nowrap
      overflow-x: scroll
      -webkit-overflow-scrolling touch
      box-sizing: border-box
      text-align: center

      > *
        display: inline-block
        box-sizing: border-box
        width 19.6%
        max-width 80px

        + *
          border-left 1px solid var(--color-divider)


</style>
