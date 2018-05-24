<template lang='pug'>
  .tab
    activity
</template>

<script>
  import activity from './widget/Activity.vue'

  export default {
    props: ['user'],
    components: {
      activity
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