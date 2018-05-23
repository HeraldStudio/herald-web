<template lang='pug'>
  .tab
    banner
    activity
</template>

<script>
  import banner from './widget/Banner.vue'
  import activity from './widget/Activity.vue'

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