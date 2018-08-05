<template lang='pug'>
  .tab
    dashboard(v-if='checkLogin' :user='user')
    login(v-else)
    .todo(v-if='checkLogin')
      exam(v-if='/^21/.test(user.cardnum)')
      curriculum
      experiment(v-if='/^21/.test(user.cardnum)')
</template>

<script>
  import exam from '@/components/Exam.vue'
  import login from '@/components/Login.vue'
  import dashboard from '@/components/Dashboard.vue'
  import curriculum from '@/components/Curriculum.vue'
  import experiment from '@/components/Experiment.vue'
  import api from '@/api'

  export default {
    props: ['user'],
    components: {
      login, dashboard, curriculum, experiment, exam
    },
    data () {
      return {
        checkLogin: true
      }
    },
    async created () {
        let that = this
        setInterval(() => {
          try {
          if (api.token) {
            if (that.user) {
              that.checkLogin = true
            } else {
              that.checkLogin = false
            }
          } else {
            that.checkLogin = false
          }
          } catch(e) {
            that.checkLogin = false
          }
        }, 1000)
    },
    methods: {

    }
  }
</script>