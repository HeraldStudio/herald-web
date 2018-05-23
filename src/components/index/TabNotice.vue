<template lang='pug'>
  .tab
    notice(:user='user')
</template>

<script>
  import notice from './widget/Notice.vue'

  export default {
    props: ['user'],
    components: {
      notice
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