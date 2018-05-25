<template lang='pug'>
  .tab
    dashboard(v-if='user' :user='user')
    login(v-else)
    .todo(v-if='user')
      exam(v-if='/^21/.test(user.cardnum)')
      curriculum
      experiment(v-if='/^21/.test(user.cardnum)')
</template>

<script>
  import exam from './widget/Exam.vue'
  import login from './widget/Login.vue'
  import dashboard from './widget/Dashboard.vue'
  import curriculum from './widget/Curriculum.vue'
  import experiment from './widget/Experiment.vue'

  export default {
    props: ['user'],
    components: {
      login, dashboard, curriculum, experiment, exam
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