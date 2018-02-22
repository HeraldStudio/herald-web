<template lang=pug>
  .columns(v-if='isLogin')
    .widgets
      // swiper
      card
      curriculum
      // pe
      exam
    .widgets
      experiment
      lecture
      srtp
      grade
    .widgets
      notice
  login(v-else)
</template>

<script>
  import H from '@/api'
  import login from './Login.vue'
  // import swiper from './widgets/Swiper.vue'
  import card from './widgets/Card.vue'
  // import pe from './widgets/Pe.vue'
  import exam from './widgets/Exam.vue'
  import lecture from './widgets/Lecture.vue'
  import curriculum from './widgets/Curriculum.vue'
  import experiment from './widgets/Experiment.vue'
  import srtp from './widgets/Srtp.vue'
  import grade from './widgets/Grade.vue'
  import notice from './widgets/Notice.vue'

  export default {
    props: ['isLogin'],
    components: {
      login,
      // swiper,
      card, /* pe, */ curriculum,
      exam, lecture, experiment, srtp, grade,
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
      padding 0

      @media screen and (max-width: 600px)
        flex-direction column
        align-items stretch

      .widget
        position relative
        margin 40px 10px 10px
        padding 20px 15px
        box-shadow 0 3px 15px rgba(0, 0, 0, .07)
        border 1px solid transparent
        width 380px
        box-sizing border-box
        -webkit-transition: .3s
        -moz-transition: .3s
        -ms-transition: .3s
        -o-transition: .3s
        transition: .3s

        @media screen and (min-width: 600px)
          &:hover
            border 1px solid var(--divider-color)

        &.loading
          opacity .5

        @media screen and (max-width: 600px)
          margin 40px 0 10px
          padding 20px 15px
          width auto

        .empty
          display block
          text-align center
          color #888
          font-size 14px

        >.title
          position absolute
          left -1px
          top -30px
          height 26px
          line-height 26px
          vertical-align middle
          padding 0 7px
          text-align left
          font-size 13px
          border-radius 3px
          font-weight bold
          background #555
          color #fff
          margin-bottom 20px
          display flex
          flex-direction row
          align-items center
          -webkit-transition: .3s
          -moz-transition: .3s
          -ms-transition: .3s
          -o-transition: .3s
          transition: .3s

          &::before
            content ''
            position absolute
            bottom -4px
            left 50%
            margin-left -3px
            border-left 3px solid transparent
            border-right 3px solid transparent
            border-top 4px solid #555

          .reload
            width 16px
            height 18px
            margin-left 5px
            cursor pointer
            -webkit-transition: 1s
            -moz-transition: 1s
            -ms-transition: 1s
            -o-transition: 1s
            transition: 1s
            display none

            &:active
              transform rotate(-360deg)
              -webkit-transition: 0s
              -moz-transition: 0s
              -ms-transition: 0s
              -o-transition: 0s
              transition: 0s
              transform-origin 50% 40%

        ul.info-bar
          width 100%
          box-sizing border-box
          margin 0
          padding 5px 5px 0 10px
          display flex
          flex-direction row
          justify-content center
          flex-wrap wrap

          li.info
            list-style none
            flex 0 1 auto
            padding 0 10px
            margin 0 5px 5px 0
            display flex
            flex-direction row
            justify-content center
            font-size 14px
            padding 3px 7px
            color var(--theme-color-dark)
            background var(--theme-color-light)
            border-radius 3px

            .title
              font-weight bold

              + .content
                margin-left 5px

          +ul.detail-list>*:first-child
            margin-top 15px
            border-top 1px solid var(--divider-color)
            padding-top 10px

        ul.detail-list
          width 100%
          margin 0
          padding 0 10px
          box-sizing border-box
          display flex
          flex-direction column

          li + li
            border-top 1px solid var(--divider-color)

          li
            list-style none
            flex 1 1 auto
            padding 10px 0
            display flex
            flex-direction column
            text-align justify
            word-break break-all

            .top, .bottom
              display flex
              flex-direction row
              align-items center

            .top + .bottom
              margin-top 5px

            .left
              flex 1 1 auto

            .right
              flex 0 0 auto
              margin-left 20px

            .top .left
              font-size 15px
              color var(--theme-color)

            .top .right, .bottom .left
              font-size 14px
              color #555

            .bottom .left
              font-weight bold

            .bottom .right
              font-size 14px
              color #888

            &:last-child
              padding-bottom 0

            &:first-child
              padding-top 0

</style>
