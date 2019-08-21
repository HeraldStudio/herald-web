<template lang="pug">

  .page.intro
    ul.detail-list
      li
        .top
          .left 一卡通号
          .right {{ user.cardnum }}
      li
        .top
          .left 宿舍
          .right(v-if='dorm && dorm.building') {{ dorm.campus }} {{ dorm.building }} {{ dorm.room }} {{ dorm.bed }}号床
          .right(v-else) 暂未分配宿舍
        .bottom
          .left(v-if='dorm && dorm.building') 可到<a href='http://map.seu.edu.cn/#/home'>校园地图服务系统</a>查看宿舍楼所在位置。
          .left(v-else) 待分配宿舍中，请留意班级群通知

</template>
<script>

  import api from '@/api'

  export default {
    props: ['user'],
    data() {
      return {
        dorm: null
      }
    },
    persist: {
      dorm: 'herald-default-dorm'
    },
    async created() {
      this.dorm = await api.get('/api/dorm')
    }
  }

</script>