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
          .title-line
            .title
              .zh {{ row.title || '无标题' }}
              .en {{ row.title || 'No title' }}
            .href {{ row.href }}
          .appears
            .appear(v-for='appear in row.appears')
              span.left
                span.inner {{ appear.left }}
              span.keyword {{ appear.keyword }}
              span.right
                span.inner {{ appear.right }} …
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
        searching: '',
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
          this.searching = this.query
          this.result = (await api.get('https://boss.myseu.cn/search/?q=' + this.searching)).data
        }
      },
      async loadMore() {
        let result = (await api.get('https://boss.myseu.cn/search/?q=' + this.searching + '&page=' + (this.page + 1))).data
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
      padding 20px 10px
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

        .summary
          color #888
          font-size 14px
          padding 10px 5px
          margin 10px 0

        .result
          width 100%
          padding-bottom 10px
          margin-bottom 10px
          border-bottom 1px solid var(--divider-color)

          &.next
            text-align center
            padding 20px 0
            color #888
            border none
            cursor pointer

            *
              cursor pointer

          a
            display block
            padding 20px 0

            .title-line
              display flex
              flex-direction row
              align-items center
              margin-bottom 5px

            .title
              flex 0 1 auto
              font-size 18px
              font-weight bold
              white-space nowrap
              overflow hidden
              word-break break-all
              text-overflow ellipsis

            .href
              flex 0 2 auto
              font-size 14px
              font-weight bold
              white-space nowrap
              overflow hidden
              text-overflow ellipsis
              color #fff
              background var(--theme-color)
              padding 0 5px
              word-break break-all
              margin-left 10px

            .appears
              display flex
              flex-direction column
              position relative

              &::before
                content ''
                position absolute
                left 0
                right 0
                top 0
                bottom 0
                border-left 10px solid rgba(255, 255, 255, .8)
                border-right 10px solid rgba(255, 255, 255, .8)
                z-index 99

              .appear
                margin-top 5px
                font-size 14px
                color #888
                display flex
                flex-direction row
                justify-content center

                .left, .right, .keyword
                  overflow hidden
                  white-space nowrap
                  text-overflow ellipsis
                  display flex
                  flex-direction row

                .left
                  flex 1 1 0
                  flex-direction row-reverse
                  text-align right

                .right
                  flex 5 5 0

                .keyword
                  flex 0 0 auto
                  font-weight bold
                  color #333

</style>