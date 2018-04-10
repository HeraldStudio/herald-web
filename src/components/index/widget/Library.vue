<template lang="pug">

  widget.library(title='图书馆' :show='books && books.length')
    ul.detail-list
      li(v-for='item in books')
        .top
          .left {{ item.name }}
        .bottom
          .left 应还： {{ formatDateNatural(item.returnDate) }}
          button.right(@click='renew(item.bookId)') 续借

</template>
<script>

  import H from '@/api'
  import widget from './Widget.vue'
  import formatter from '@/util/formatter'

  export default {
    components: { widget },
    data() {
      return {
        books: null
      }
    },
    created() {
      this.reload()
    },
    methods: {
      ...formatter,
      async reload() {
        this.books = await H.api.library()
      },
      async renew(bookId) {
        this.$toasted.show(await H.api.library.post({ bookId }))
        await this.reload()
      }
    }
  }

</script>
