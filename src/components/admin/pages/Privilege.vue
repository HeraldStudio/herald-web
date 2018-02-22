<template lang='pug'>
  .admin-page#monitor
    .title 权限管理
    .subcontainer.domain(v-for='domain in domains')
      .subtitle {{ domain.name }}
      .summary {{ domain.desc }}
      table.list
        tr.admin-header
          th.cardnum 一卡通号
          th.name 姓名
          th.phone 手机号
          th.level 级别
          th.authorized 授权时间
          th.last-used 上次操作
          th.operation 操作
        tr.admin(v-for='admin in domain.admins')
          td.cardnum {{ admin.cardnum }}
          td
            input.name(v-if='admin.level > domain.level' v-model='admin.name')
            .name(v-else) {{ admin.name }}
          td
            input.phone(v-if='admin.level > domain.level' v-model='admin.phone')
            .phone(v-else) {{ admin.phone }}
          td.level {{ admin.level }}
          td.authorized {{ formatTimeNatural(admin.authorized) }}
          td.last-used {{ admin.authorized === admin.last_used ? '从未' : formatTimeNatural(admin.last_used) }}
          td.operations
            button.save(v-if='admin.level > domain.level' @click='saveAdmin(domain.domain, admin)') 保存
            confirm-button.remove(v-if='admin.level > domain.level' @click='removeAdmin(domain.domain, admin)' confirm-text='确定') 删除
        tr.admin.add
          td
            input.cardnum(v-model='domain.newAdmin.cardnum')
          td
            input.name(v-model='domain.newAdmin.name')
          td
            input.phone(v-model='domain.newAdmin.phone')
          td.level
          td.authorized
          td.last-used
          td.operations
            confirm-button(@click='addAdmin(domain.domain, domain.newAdmin)' confirm-text='确定新增') 新增
</template>
<script>
  import H from '@/api'
  import confirmButton from '@/components/ConfirmButton.vue'
  import formatter from '@/util/formatter'

  export default {
    components: {
      confirmButton
    },
    data () {
      return {
        domains: []
      }
    },
    async created () {
      let adminObj = await H.api.admin.admin()
      this.domains = Object.keys(adminObj).filter(k => k !== 'super').map(k => {
        let domain = adminObj[k]
        domain.name = domain.domain
        domain.domain = k
        domain.admins = []
        domain.newAdmin = { name: '', cardnum: '', phone: '' }
        H.api.admin.admin({ domain: k }).then(k => { domain.admins = k.admins })
        return domain
      })
    },
    methods: {
      ...formatter,
      async addAdmin(domain, admin) {
        await H.api.admin.admin.post({ domain, admin })
        this.domains.find(k => k.domain === domain).admins = (await H.api.admin.admin({ domain })).admins
        admin.name = admin.phone = admin.cardnum = ''
      },
      async saveAdmin(domain, admin) {
        await H.api.admin.admin.put({ domain, admin })
        this.domains.find(k => k.domain === domain).admins = (await H.api.admin.admin({ domain })).admins
      },
      async removeAdmin(domain, admin) {
        await H.api.admin.admin.delete({ domain, cardnum: admin.cardnum })
        this.domains.find(k => k.domain === domain).admins = (await H.api.admin.admin({ domain })).admins
      }
    }
  }
</script>
<style lang='stylus'>
  .list
    width 100%
    text-align left
    border-collapse collapse

    th, td
      line-height 1.8em

    th
      padding 0 5px 5px 0

    td
      padding 5px 5px 0 0

    .admin-header, .admin
      font-size 14px
      color #555

      input, button
        padding 5px 10px
        border-radius 3px
        font-size 14px

      input
        width 100%

      button
        background #ddfbff
        color #237a86
        margin-right 5px
        cursor pointer

        &.remove
          background #ffedc1
          color #a4832d

        &.confirming
          background #ffd8c4
          color #6b402a

      > *
        flex 1 1 auto
        overflow hidden

        + *
          margin-left 10px
</style>
