<template lang="pug">
  .page-bar
    .page-line
    .page-btns
      .page-btn(:class='{ disabled: !hasLast}' @click="jump(current - 1)") 上一页
      .page-divider
      .page-btn(:class='{ disabled: !hasNext }' @click='jump(current + 1)') 下一页
    .page-line
</template>

<script>
export default {
  props: {
    current: { // 当前页面
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 0
    }
  },
  computed: {
    hasLast() {
      return this.current !== 1
    },
    hasNext() {
      return this.current !== Math.ceil(this.total / this.pageSize)
    },
    totalPage() {
      return Math.ceil(this.total / this.pageSize)
    }
  },
  methods: {
    jump(page) {
      if (page > this.totalPage) page = this.totalPage
      if (page < 1) page = 1
      this.$emit('change', {
        current: page,
        pageSize: this.pageSize,
        total: this.total
      })
    }
  },
}
</script>

<style scoped lang='stylus'>

.page-bar
  margin: 20px 0

  .page-line
    width: 100%
    border-top: solid 1px #f0f0f0
  
  .page-btns
    display: flex 
    justify-content: space-around

    .page-btn
      height: 40px
      line-height: 40px
      font-size: 16px
      color: var(--color-primary)
      text-align: center
      padding: 0 20px
      cursor: pointer

      &:active
        background: #f6f6f6

      &.disabled
        background: none
        color: grey 
        cursor: default

    .page-divider
      hegith: 80%
      border-left: solid 1px #f0f0f0
      margin: 8px 0

</style>