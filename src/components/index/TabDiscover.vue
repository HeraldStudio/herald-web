<template lang='pug'>
  .tab
    banner(v-if='user')
    activity
</template>

<script>
  import activity from './widget/Activity.vue'
  import banner from './widget/Banner.vue'

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