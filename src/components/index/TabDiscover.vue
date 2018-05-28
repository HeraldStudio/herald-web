<template lang='pug'>
  .tab
    .hint 为提升服务质量，小猴偷米正在整站升级 HTTPS，其间网页版图片可能无法加载，App 不受影响，敬请谅解。
    banner(v-if='user')
    activity
</template>

<script>
  import activity from './widget/Activity.vue'
  import banner from './widget/Banner.vue'

  export default {
    props: ['user'],
    components: {
      banner, activity
    },
    data () {
      return {}
    },
    async created () {

    },
    methods: {

    }
  }
</script>

<style lang="stylus" scoped>
  .hint
    padding 10px 15px
    background var(--color-warning-bg)
    color var(--color-warning-dark)
</style>
