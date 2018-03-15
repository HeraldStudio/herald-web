<template lang=pug>
  .columns
    .widgets
      banner
      dashboard(v-if='isLogin')
      activity
    .widgets
      .todo(v-if='isLogin')
        experiment
        curriculum
      .guest(v-else)
        login
    .widgets
      notice
</template>

<script>
  import H from '@/api'
  import login from './widget/Login.vue'
  import banner from './widget/Banner.vue'
  import activity from './widget/Activity.vue'
  import notice from './widget/Notice.vue'

  import dashboard from './widget/Dashboard.vue'

  // import exam from './widget/Exam.vue'
  import curriculum from './widget/Curriculum.vue'
  import experiment from './widget/Experiment.vue'

  export default {
    props: ['isLogin'],
    components: {
      login,
      banner,
      dashboard,
      curriculum, experiment,
      activity,
      notice
    },
    data () {
      return {

      }
    },
    async created () {

    },
    methods: {

    }
  }
</script>

<style lang="stylus">

  .columns
    display flex
    flex-direction row
    align-items flex-start

    @media screen and (max-width: 600px)
      flex-direction column
      align-items stretch

    .widgets
      display flex
      flex-direction column
      align-items flex-start
      flex 1 1 0
      padding 0

      @media screen and (max-width: 600px)
        flex-direction column
        align-items stretch

</style>
