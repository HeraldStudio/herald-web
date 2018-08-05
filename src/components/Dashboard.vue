<template lang='pug'>

  .widget.dashboard
    .info-container
      .name {{ user ? user.name : '加载中' }}
      .identity {{ user ? user.identity : '…' }}
        router-link(v-if='user.isNewbie' to='/intro') 新生指引 ＞
      img.icon(@click='logout()' :src='logoutImg')
    
    .admin-container(v-if='user.admin')
      router-link(to='/admin/monitor' v-if='user.admin.maintenance')
        .function 概况
      router-link(to='/admin/privilege' v-if='user.admin.maintenance')
        .function 权限
      router-link(to='/admin/notice' v-if='user.admin.maintenance')
        .function 通知
      router-link(to='/admin/banner' v-if='user.admin.publicity')
        .function 轮播管理
      router-link(to='/admin/activity' v-if='user.admin.publicity')
        .function 活动管理

    .dashboard-container(v-if='user')
      item(name='余额' 
        :value='card && card.info && card.info.balance' 
        :is-stale='card && card.isStale' 
        route='/card')

      item(name='跑操' 
        :value='pe && pe.count' 
        :is-stale='pe && pe.isStale' 
        route='/pe' 
        v-if='isUndergraduate')

      item(name='讲座' 
        :value='lecture && lecture.length' 
        :is-stale='lecture && lecture.isStale' 
        route='/lecture' 
        v-if='isUndergraduate')

      item(name='SRTP' 
        :value='srtp && srtp.info.points' 
        :is-stale='srtp && srtp.isStale' 
        route='/srtp' 
        v-if='isUndergraduate')

      item(:name='isGraduate ? "成绩" : "绩点"' 
        :value='gpa && (gpa.gpa || gpa.score || "暂无")' 
        :is-stale='gpa && gpa.isStale'
        route='/grade' 
        v-if='isStudent' 
        :is-graduate='isGraduate')

      item(name='借书'
        :value='library && library.length'
        :is-stale='library && library.isStale'
        route='/library') 

</template>

<script>
  import item from './DashboardItem.vue'
  import api from '@/api'
  import logoutImg from 'static/images/logout.png'

  export default {
    props: ['user'],
    components: {
      item, 
    },
    data() {
      return {
        pe: null,
        gpa: null,
        card: null,
        srtp: null,
        lecture: null,
        library: null,
        logoutImg
      }
    },
    persist: {
      pe: 'herald-default-pe',
      gpa: 'herald-default-gpa',
      card: 'herald-default-card',
      srtp: 'herald-default-srtp',
      lecture: 'herald-default-lecture',
      library: 'herald-default-library'
    },
    async created() {
      // 下列不能用 await，否则前面的语句会阻塞后面的语句，前面的异常会阻止后面的语句
      api.get('/api/pe').then(res => this.pe = res)
      api.get('/api/gpa').then(res => this.gpa = res)
      api.get('/api/card').then(res => this.card = res)
      api.get('/api/srtp').then(res => this.srtp = res)
      api.get('/api/lecture').then(res => this.lecture = res)
      api.get('/api/library').then(res => this.library = res)
    },
    methods: {
      logout() {
        api.token = ''
      }
    },
    computed: {
      isStudent() {
        return this.user && /生/.test(this.user.identity)
      },
      isUndergraduate() {
        return this.user && /本科/.test(this.user.identity)
      },
      isGraduate() {
        return this.isStudent && !this.isUndergraduate
      }
    }
  }
</script>

<style lang="stylus" scoped>

  .widget.dashboard
    padding 20px 15px

    .info-container
      padding 0 0 15px
      margin 0 10px
      display flex
      flex-direction row
      align-items: center

      * + *
        margin-left 10px

      .name
        font-size 17px
        flex 0 0 auto
        white-space: nowrap
        color var(--color-text-regular)

      .identity
        font-size 12px
        flex 1 1 0
        white-space: nowrap
        color var(--color-text-secondary)

        a
          margin-left 5px

      .icon
        width 20px
        height 20px
        cursor pointer

    .dashboard-container
      width 100%
      display: block
      white-space: nowrap
      overflow-x: scroll
      box-sizing: border-box
      text-align: center
      border-top 0.5px solid var(--color-divider)
      padding-top 20px
      
      ::-webkit-scrollbar
        display none

      > *
        display: inline-block
        box-sizing: border-box
        width 19.6%
        max-width 80px

        + *
          border-left 0.5px solid var(--color-divider)


    .admin-container
      padding 0 10px 15px
      display flex
      flex-direction row
      align-items center

      .subtitle
        font-size 12px
        color var(--color-text-secondary)
        flex 1 1 0

      .function
        color #333

      a + a .function
        padding-left 7px
        border-left 0.5px solid var(--color-divider)
        margin-left 7px

</style>
