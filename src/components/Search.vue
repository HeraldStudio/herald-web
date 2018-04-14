<template lang="pug">

  .search(:class='{ compact: result.rows }')
    .search-box
      .title
        img.logo(src='static/images/logo.png')
        .subtitle 校内搜索 Beta
        .summary 已收录条目 {{ count }}
      .field
        input(v-model='query', @keyup.enter='search()')
        button(@click='search()') 搜索
    .results(v-if='result.rows')
      .summary 找到 {{ result.count }} 个网页
      .result(v-for='row in result.rows')
        a(:href='row.url' target='_blank')
          .title-line
            .title {{ row.title || '无标题' }}
            .matches {{ row.wordHitCount }} 个匹配
          .href {{ row.url }}
          .appears
            .appear(v-for='appear in row.appears')
              span.left
                span.inner {{ appear.left }}
              span.keyword {{ appear.keyword }}
              span.right
                span.inner {{ appear.right }} …
      .result.next(v-if='result.rows.length < result.count', @click='loadMore()') 加载更多

</template>
<script>

  import H from '../api'

  export default {
    data() {
      return {
        count: '...',
        query: '',
        searching: '',
        error: false,
        result: {},
        page: 1
      }
    },
    async created() {
      this.count = (await H.api.search({ pagesize: 0 })).count
    },
    methods: {
      async search() {
        if (!(this.query = this.query.trim())) {
          this.error = true
        } else {
          this.error = false
          this.searching = this.query
          this.result = await H.api.search({ q: this.searching })
        }
      },
      async loadMore() {
        let result = await H.api.search({ q: this.searching, page: this.page + 1 })
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
      margin 80px 0
      padding 60px 40px
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
          filter hue-rotate(-15deg)

        .subtitle
          font-size 18px
          margin-left 20px

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
      padding 20px 25px
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
          border-bottom 1px solid var(--color-divider)

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
              align-items baseline 

              .title
                font-size 18px
                font-weight bold
                white-space nowrap
                overflow hidden
                word-break break-all
                text-overflow ellipsis
              
              .matches
                flex-shrink 0
                font-size 14px
                color var(--color-text-secondary)
                margin-left 10px
                white-space nowrap
                overflow hidden
                word-break break-all
                text-overflow ellipsis

            .href
              display inline-block
              max-width 100%
              box-sizing border-box
              font-size 14px
              font-weight bold
              white-space nowrap
              overflow hidden
              text-overflow ellipsis
              color var(--color-primary-dark)
              background var(--color-primary-bg)
              border-radius 3px
              padding 0 5px
              word-break break-all
              margin 5px 0

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