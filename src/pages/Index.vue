<template lang="pug">
  .index-hint 从左侧选择功能进行查看
</template>
<style lang="stylus">
  .index-hint
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    display flex
    align-items center
    justify-content center
    background #fff
    color var(--color-divider)
    font-size 20px

    @media screen and (max-width: 600px)
      display none
</style>
