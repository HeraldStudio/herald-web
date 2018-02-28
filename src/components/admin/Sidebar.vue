<template lang='pug'>
  #admin-sidebar(v-if='adminObj')
    ul
      li.category(v-for='category in categories' v-if='!category.privilege || category.privilege === "independent" && hasAvailable(category) || adminObj[category.privilege]') {{ category.name }}
        ul
          li(v-for='page in category.pages' v-if='category.privilege !== "independent" || adminObj[page.page]' :class='{ current: current === page.page }' @click='changePage(page.page)') {{ page.name }}
</template>
<script>
  import H from '@/api'

  export default {
    props: ['current'],
    data() {
      return {
        adminObj: null,
        categories: [
          {
            name: '运维',
            privilege: 'maintenance',
            pages: [
              {
                page: 'monitor',
                name: '系统概况'
              },
              {
                page: 'privilege',
                name: '权限管理'
              },
              {
                page: 'notice',
                name: '通知公告'
              }
            ]
          },
          {
            name: '运营',
            privilege: 'publicity',
            pages: [
              {
                page: 'banner',
                name: '轮播广告'
              },
              {
                page: 'activity',
                name: '活动管理'
              }
            ]
          },
          {
            name: '合作',
            privilege: 'independent',
            pages: [
              {
                page: 'publisher',
                name: '活动发布'
              },
              {
                page: 'lecture',
                name: '讲座发布'
              },
              {
                page: 'pe',
                name: '跑操发布'
              },
              {
                page: 'vote',
                name: '投票系统'
              },
              {
                page: 'ticket',
                name: '票务系统'
              },
              {
                page: 'canteen',
                name: '食堂系统'
              }
            ]
          },
        ]
      }
    },
    async created() {
      this.adminObj = await H.api.admin.admin()
      if (!this.current) {
        if (this.adminObj.maintenance) {
          this.changePage('monitor')
        } else if (this.adminObj.advertise) {
          this.changePage('advertise')
        } else {
          this.changePage(Object.keys(this.adminObj).find(k => k !== 'super'))
        }
      }
    },
    methods: {
      changePage (newPage) {
        this.$emit('changePage', newPage)
      },
      hasAvailable (category) {
        return !!category.pages.find(k => this.adminObj[k.page])
      }
    }
  }
</script>
<style lang='stylus'>
  #admin-sidebar
    display flex
    flex-direction column

    ul
      list-style none
      padding-left 0
      color var(--color-text-regular)
      font-size 15px

      li.category
        padding 15px 20px
        border-bottom 1px solid var(--color-divider)
        font-size 17px
        color #888
        text-align left

        ul
          li
            padding-top 15px
            transition .3s
            cursor pointer

            &:hover
              color var(--color-primary)

            &.current
              color var(--color-primary)
              font-weight bold

</style>
