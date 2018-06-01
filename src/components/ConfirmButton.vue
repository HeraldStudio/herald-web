<template>
  <button
    class='confirm-button' :class='{ confirming: confirm }'
    @click='onClick()'
    @mouseleave='cancel()'>
    <slot v-if='!confirm'></slot>
    <span v-else>{{ confirmText }}</span>
  </button>
</template>
<script>
  export default {
    props: ['confirmText'],
    data () {
      return {
        confirm: false
      }
    },
    methods: {
      onClick() {
        if (!this.confirm) {
          this.confirm = true
        } else {
          this.$emit('click')
          this.confirm = false
        }
      },
      cancel() {
        this.confirm = false
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .confirm-button
    transition .3s

    &.confirming
      background #ffd8c4
      color #6b402a
</style>

