<template lang="pug">

  .search(:class='{ compact: result.rows }')
    .search-box
      .title
        img.logo(src='static/images/logo.png')
        .zh 丨内网搜索
        .en 丨SEU Search
        .summary
          .zh 已收录条目 {{ count }}
          .en Included entries {{ count }}
      .field
        input(v-model='query', @keyup.enter='search()')
        button(@click='search()', :class='{ error: error }')
          .zh 搜索
          .en Search
    .results(v-if='result.rows')
      .summary
        .zh 找到 {{ result.count }} 个网页
        .en Found {{ result.count }} entries
      .result(v-for='row in result.rows')
        a(:href='row.href' target='_blank')
          .title.zh {{ row.title || '无标题' }}
          .title.en {{ row.title || 'No title' }}
          .appears
            .appear(v-for='appear in row.appears')
              span.text … {{ appear.left }}
              span.highlight {{ appear.keyword }}
              span.text {{ appear.right }} …
          .href {{ row.href }}
      .result.next(v-if='result.rows.length < result.count', @click='loadMore()')
        .zh 加载更多
        .en Load more

</template>
<script>

  import api from '../api'
  import cookie from 'js-cookie'

  export default {
    data() {
      return {
        count: '...',
        query: '',
        error: false,
        result: {},
        page: 0
      }
    },
    async created() {
      this.count = (await api.get('https://boss.myseu.cn/search/?pagesize=0')).data.count
    },
    methods: {
      async search() {
        if (!(this.query = this.query.trim())) {
          this.error = true
        } else {
          this.error = false
          this.result = (await api.get('https://boss.myseu.cn/search/?q=' + this.query)).data
        }
      },
      async loadMore() {
        let result = (await api.get('https://boss.myseu.cn/search/?q=' + this.query + '&page=' + (this.page + 1))).data
        this.result.rows = this.result.rows.concat(result.rows)
        this.page += 1
      }
    }
  }

</script>
<style lang="stylus" scoped>

  .search
    width 600px
    margin 180px auto
    padding 60px 20px
    box-sizing border-box

    display flex
    flex-direction column
    align-items stretch

    -webkit-user-select: none
    -moz-user-select: none
    -ms-user-select: none
    user-select: none

    @media screen and (max-width: 600px)
      margin 80px auto
      width auto

    > *
      margin-top 10px

    .search-box

      >.title
        font-size 24px
        font-weight bold
        color #555
        padding 5px 10px
        display flex
        flex-direction row
        flex-wrap wrap
        align-items center
        justify-content center

        @media screen and (max-width: 600px)
          font-size 14px

        .logo
          width auto
          height 50px

        .summary
          font-size 12px
          background #555
          padding 3px 5px
          color #fff
          margin 20px

      .field
        display flex
        flex-direction row
        margin-top 20px

        input
          flex 1 1 0

        button
          flex 0 0 auto
          font-size 16px
          padding 5px 10px
          margin-left 10px

          &.error
            background #cc5e6f

    &.compact
      width 100%
      max-width 800px
      margin 0 auto
      padding 20px 0
      align-items center

      .search-box
        width 100%
        max-width 800px

        .title
          display none

      .results
        width 100%
        box-sizing border-box
        display flex
        flex-direction column
        align-items center
        text-align left
        padding 0 20px

        .summary
          color #888
          font-size 14px
          padding 10px 5px
          margin 10px 0

        .result
          width 100%
          box-shadow 0 0 15px rgba(0, 0, 0, .05)
          margin-bottom 15px
          padding 0 20px

          &.next
            text-align center
            padding 20px
            color #888
            cursor pointer

          a
            display block
            padding 20px 0

            .title
              font-size 18px
              font-weight bold

            .appears
              display flex
              flex-direction column

              .appear
                margin-top 5px
                font-size 14px
                color #888

                .highlight
                  color var(--theme-color)

            .href
              font-size 14px
              color #888
              margin-top 10px

</style>