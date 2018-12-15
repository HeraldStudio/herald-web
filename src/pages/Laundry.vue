<template lang="pug">

  .page
    ul.info-bar
      li.info(v-for='(area, i) in laundry' @click='currentArea = i' :class='{ selected: currentArea == i }')
        .name {{ area.area }}
    .hint(v-if='laundry')
      p 扫描空闲洗衣机右上角的二维码可使用洗衣机；部分空闲机器可能有故障，请谨慎使用。企鹅共享洗衣服务由学校和第三方提供。
    .list(v-if='laundry[currentArea]')
      .machine(v-for='machine in laundry[currentArea].machines' :key='machine.id')
        .line
          .name(:class='{ disabled: machine.state !== "空闲" }') {{ machine.name }}
          .type {{ machine.type }}
        .line
          .state {{ machine.state }}
          .remain-time(v-if='machine.remainMinutes') （剩余 {{ machine.remainMinutes }} 分钟）

</template>
<script>

  import api from '@/api'

  export default {
    data() {
      return {
        currentArea: 0,
        laundry: null
      }
    },
    async created() {
      this.laundry = await api.get('/api/laundry')
    }
  }

</script>
<style lang="stylus" scoped>

  ul.info-bar

    li.info
      cursor pointer
      transition .3s

      &.selected
        font-weight bold

      &:not(.selected)
        background none
        color var(--color-text-bold)

        .title
          font-weight normal

  .title
    font-size 18px
    font-weight bold
    color var(--color-text-bold)

  .hint
    text-align justify
    font-size 14px
    color var(--color-text-secondary)
    margin 10px 0

    p
      line-height 1.5em
      margin 0.5em 0
  
  .machine
    padding 10px 0
    border-bottom 0.5px solid var(--color-divider)

    .line
      display flex
      flex-direction row

      .name
        flex 1 1 auto
        text-align left
        color var(--color-primary)
        font-size 16px
        margin-bottom 2px

        &.disabled
          color var(--color-text-secondary)

      .type
        color var(--color-text-bold)
        font-size 13px

      .state, .remain-time
        flex 0 0 auto
        color var(--color-text-bold)
        font-size 13px
    
</style>
