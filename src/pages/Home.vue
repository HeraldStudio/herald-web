<template lang='pug'>
  .home
    .newyear
      .head 小猴偷米 2019
      img(:src='newyearPic')
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
  import newyearPic from 'static/images/newyear.png'

  export default {
    props: ['user'],
    data() {
      return {
        newyearPic
      }
    },
    components: {
      dashboard, curriculum, experiment, exam, toutiao
    }
  }
</script>

<style lang="stylus">
  .home
    background url('../../static/images/newyear-bg.jpg')
    background-size contain
    background-position top center
    background-repeat no-repeat
    
  .newyear
    display flex
    flex-direction column
    align-items center
    justify-content center
    padding 80px 0 20px

    .head
      background #fe4402
      color #fff
      padding 4px 10px
      border-radius 20px
      font-weight bold
      font-size 15px
      
    img
      width: 80%
      height: auto
      object-fit: contain
</style>
