<template lang="pug">

  .page.lecture
    div(v-if='lecture')
      .info-bar
        button.info
          .title 已听讲座次数
          .content {{ lecture.length }}
        button.info
          .title 剩余讲座次数
          .content {{ Math.max(0, 8 - lecture.length) }}
      ul.detail-list
        li(v-for='item in lecture')
          .top(:href='item.lectureUrl' @click='()=>{if(item.lectureUrl){window.open(item.lectureUrl)}}' )
            .subTitle {{item.lectureTitle ?  item.lectureTitle : formatTime(item.time, 'yyyy/MM/dd')+' 打卡' }}
            .des {{ item.lectureTitle ? '打卡时间: '+formatTime(item.time, 'yyyy/MM/dd') : '' }}
            .des {{ item.location }}
            .url {{ item.lectureUrl ? '点击查看讲座推送' : ''}}
        li.empty(v-if='!lecture.length') 暂无讲座记录
      .hint
        p 数据来自两个报告厅的打卡记录，请仔细甄别，防止无关记录干扰。具体讲座信息，可关注<b>东南大学文化素质教育中心</b>公众号，查看<b>全部消息</b>。

</template>
<script>

  import api from '@/api'
  import formatter from '@/util/formatter'

  export default {
    data() {
      return {
        lecture: null
      }
    },
    persist: {
      lecture: 'herald-default-lecture'
    },
    async created() {
      this.lecture = (await api.get('/api/lecture')).sort((a, b) => a.time - b.time)
    },
    methods: {
      ...formatter
    }
  }

</script>
<style lang="stylus" scoped>

  .page.lecture
    .hint
      text-align justify
      font-size 13px
      color var(--color-text-secondary)
      margin-top 25px

      p
        line-height 1.5em
        margin 0.5em 0
    .subTitle
        color #000
        line-height 1.5
        font-size 17px
        text-align left
        width auto
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
    .des 
        color #888
        font-size  15px
        line-height 1.5
    .url 
        color rgb(19, 172, 217)
    .top
        display flex
        flex-direction column
</style>

