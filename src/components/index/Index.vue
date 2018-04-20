<template lang='pug'>
  .columns
    .widgets
      banner
      dashboard(v-if='user' :user='user')
      activity
    .widgets
      .todo(v-if='user')
        exam(v-if='/^21/.test(user.cardnum)')
        curriculum
        experiment(v-if='/^21/.test(user.cardnum)')
      .guest(v-else)
        login
    .widgets
      library(v-if='user')
      notice(:user='user')
</template>

<script>
  import H from '@/api'
  import login from './widget/Login.vue'
  import banner from './widget/Banner.vue'
  import activity from './widget/Activity.vue'
  import notice from './widget/Notice.vue'

  import dashboard from './widget/Dashboard.vue'

  import exam from './widget/Exam.vue'
  import curriculum from './widget/Curriculum.vue'
  import experiment from './widget/Experiment.vue'
  import library from './widget/Library.vue'

  export default {
    props: ['user'],
    components: {
      login, banner, dashboard,
      curriculum, experiment, exam,
      activity, notice, library
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
        flex 0 0 auto

</style>
