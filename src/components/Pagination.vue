<template lang="pug">
  .page-bar
    .page-line
    //- .page-btns
    //-   .page-btn(:class='{ disabled: !hasLast}' @click="jump(current - 1)") 上一页
    //-   .page-divider
    //-   span 
    //-   .page-divider
    //-   .page-btn(:class='{ disabled: !hasNext }' @click='jump(current + 1)') 下一页
    .page-btns
      .page-total 共 {{ total }} 条

      .page-btn(v-if="current != 1" @click='jump(current - 1)') &lt;
      .page-btn.disabled(v-else) &lt;

      .page-btn(v-if="current >= 3" @click='jump(1)') 1
      .page-btn(v-if="current >= 4") ...
      .page-btn(v-if="current != 1" @click='jump(current - 1)') {{ current - 1 }}
      .page-btn.active {{ current }}
      .page-btn(v-if="current != totalPage && totalPage > 1" @click='jump(current + 1)') {{ current + 1 }}
      .page-btn(v-if="current <= totalPage - 3") ...
      .page-btn(v-if="current <= totalPage - 2" @click='jump(totalPage)') {{ totalPage }}

      .page-btn(v-if="current != totalPage" @click='jump(totalPage)') &gt;
      .page-btn.disabled(v-else) &gt;

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
    float: right

    .page-total
      color: #606266
      margin-right: 20px
      line-height: 28px
    
    .page-btn
      height: 28px
      min-width: 36px
      line-height: 28px
      cursor: pointer

      &:hover, &.active
        color: #409eff;

      .disabled
        cursor: default
        color: grey 

</style>