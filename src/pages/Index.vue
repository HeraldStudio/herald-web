<template lang="pug">
  .index-hint 从左侧选择功能进行查看
</template>
<style lang="stylus">
  .index-hint
    min-height unset !important
    height 85vh !important
    display flex
    align-items center
    justify-content center
    color #ddd
    font-size 20px

    @media screen and (max-width: 600px)
      display none
</style>
