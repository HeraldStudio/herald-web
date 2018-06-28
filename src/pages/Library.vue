<template lang="pug">

  .page(v-if='books')
    ul.detail-list
      li(v-for='item in books')
        .top
          .left {{ item.name }}
          .right 应还：{{ formatDateNatural(item.returnDate) }}
        .bottom
          .left {{ item.author }}
          button.right(v-if='!item.renewCount' @click='renew(item.bookId)') 续借
          .right(v-else) 已续借
      li.empty(v-if='!books || !books.length') 暂无已借图书

</template>
<script>

  import api from '@/api'
  import formatter from '@/util/formatter'

  export default {
    data() {
      return {
        books: null
      }
    },
    async created() {
      this.books = await api.get('/api/library')
    },
    persist: {
      books: 'herald-default-library'
    },
    methods: {
      ...formatter,
      async renew(bookId) {
        this.$toasted.show(await api.post('/api/library', { bookId }))
        await this.reload()
      }
    }
  }

</script>
<style lang='stylus'>
  .library button
    padding 2px 5px
    font-size 13px
    color var(--color-primary-dark) !important

  .library .empty
    text-align center !important
</style>
