<template lang='pug'>
  transition-group(name='slide')
    .upstream(v-if='upstream' key='1')
      .upstreams
        a.upstream(v-for='site in upstream' :class='{ healthy: site.health }' :href='site.url' target='_blank')
          .name {{ site.name }}
          .timeout {{ site.timeout === -1 ? '超时' : site.timeout + 'ms' }}
    p(v-else key='0') 检测中…
</template>
<script>
  import H from '@/api'

  export default {
    data () {
      return {
        upstream: null
      }
    },
    async mounted () {
      this.upstream = await H.api.health()
    }
  }
</script>
<style lang='stylus'>
  .upstreams
    display flex
    flex-direction row
    flex-wrap wrap
    justify-content center

    a.upstream
      border-radius 3px
      padding 3px 7px
      margin-right 5px
      margin-top 5px
      background #ffd8c4
      font-size 14px
      color #6b402a
      display flex
      flex-direction row
      align-items center

      &.healthy
        background var(--color-primary-bg)
        color #237a86

      .name
        font-weight bold
        margin-right 5px

      .timeout
        font-size 13px
</style>
