<template lang="pug">

  .page.intro
    ul.detail-list
      li
        .top
          .left 一卡通号
          .right {{ user.cardnum }}
      li
        .top
          .left 学号
          .right(v-if='user.schoolnum') {{ user.schoolnum }}
          .right(v-else) 暂未分配学号
        .bottom
          //- 为本科生解释学号，研究生学号太简单不用解释
          .left(v-if='user.schoolnum && user.identity === "本科生"').
            院系 {{ user.schoolnum.substr(0, 2) }} /
            专业号 {{ user.schoolnum.substr(2, 1) }} /
            {{ user.schoolnum.substr(3, 2) }} 年级 /
            {{ user.schoolnum.substr(5, 1) }} 班 /
            {{ user.schoolnum.substr(6, 2) }} 号
          .left(v-if='!user.schoolnum') 待分配班级学号中，请留意院系新生群通知
      li
        .top
          .left 统一身份认证密码
          .right ******
        .bottom
          .left 统一身份认证密码是学校大多数网站使用的登录密码，请牢记，如需修改，请到<a href='https://newids.seu.edu.cn/authserver/getBackPasswordMainPage.do'>信息门户</a>凭注册邮箱找回。
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