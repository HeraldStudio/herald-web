<template lang="pug">

  .markdown-container
    .markdown(v-if='html' v-html='html')

</template>
<script>

  import renderMarkdown from '@/util/markdown'

  export default {
    props: ['markdown'],
    data: () => ({
      html: ''
    }),
    async created() {
      this.render()
    },
    watch: {
      markdown() {
        this.render()
      }
    },
    methods: {
      render() {
        this.html = this.markdown && renderMarkdown(this.markdown)
      }
    }
  }

</script>
<style lang="stylus">

  .markdown-container
    border-top 0.5px solid transparent
    margin 0 15px
    transition .3s
    color #555
    text-align justify
    font-size 14px

    @media screen and (max-width: 600px)
      margin 0 10px

    a, a:hover, a:active, a:visited
      color var(--color-primary)
      text-decoration none
      cursor pointer

    &:hover
      color #000

    img
      max-width 100%
      position relative

    p
      margin 0.5em 0

    pre, code
      font-family 'Fira Code', 'Source Code Pro', monospace
      font-size 95%
      letter-spacing -0.015em
      line-height 1.5em

      *
        font-family inherit
        font-size inherit
        line-height inherit

    h1 code, h2 code, h3 code, h4 code, h5 code, h6 code
      font-family inherit

    ul
      padding-left 1.5em

    code
      padding 2px 5px
      background #fafafa
      margin 0

    pre
      padding 10px 15px
      background #fafafa
      margin 1em 0

    blockquote
      padding 10px 15px
      background #fafafa
      margin 1em 0

    blockquote p
      text-indent 0
      margin 2px 0

    h1, h2, h3, h4, h5, h6
      font-weight bold
      color #000
      text-align left

    h1
      font-size 24px

    h2
      font-size 22px

    h3
      font-size 20px

    h4
      font-size 18px

    h5
      font-size 17px

    h6
      font-size 16px

    hr
      border 0 none
      border-top 0.5px solid var(--color-divider)

</style>
