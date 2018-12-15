<template lang='pug'>
  .home
    dashboard(v-if='user' :user='user')
    toutiao(v-if='user')
    exam(v-if='user && /^21/.test(user.cardnum)')
    curriculum(v-if='user')
    experiment(v-if='user && /^21/.test(user.cardnum)')
</template>

<script>
  import exam from '@/components/Exam.vue'
  import dashboard from '@/components/Dashboard.vue'
  import curriculum from '@/components/Curriculum.vue'
  import experiment from '@/components/Experiment.vue'
  import toutiao from '@/components/TouTiao.vue'
  import api from '@/api'

  export default {
    props: ['user'],
    components: {
      dashboard, curriculum, experiment, exam, toutiao
    }
  }
</script>