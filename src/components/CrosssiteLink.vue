<template lang="pug">

  .crosssite-link
    drawer(:title='title' @open='load()' ref='drawer')
      .click-area
        slot
      .content(slot='content')
        content(v-if='html' v-html='html')
        markdown(v-if='md' :markdown='md')

</template>
<script>

  import drawer from '@/components/Drawer.vue'
  import markdown from '@/components/Markdown.vue'
  import H from '@/api'

  String.prototype.padd = function () {
    return this.split('\n').map(k => k.trim()).join('\n').trim()
  }

  export default {
    components: { drawer, markdown },
    props: ['url'],
    data() {
      return {
        title: '站外链接',
        html: '',
        md: ''
      }
    },
    created() {
      this.load()
    },
    watch: {
      url() {
        this.load()
      }
    },
    methods: {
      open() {
        this.$refs.drawer.open()
      },
      async load() {
        if (/^(https?:\/*)?mp\.weixin\.qq\.com/.test(this.url)) {
          let { title, author, authorId, qrcode, html } = await H.api.wechat({ url: this.url })
          this.title = title
          this.html = html
          this.md = window.__wxjs_environment ? 
          
            `---

            微信小程序不允许站外跳转，文章由小猴偷米自动转码显示

            扫描二维码关注 ${author} (${authorId}) 可查看原文

            ![](${qrcode})

          `.padd() : 
          
            `---

            文章由小猴偷米自动转码显示 [原文链接](${this.url})

            扫描二维码关注 ${author} (${authorId})

            ![](${qrcode})

          `.padd()
        } else {
          this.md = window.__wxjs_environment ? 
          
            `微信小程序不允许站外跳转，请手动复制：
            
            ${this.url}` : 
            
            `将要访问站外链接，请注意隐私安全：
            
            ${this.url}

            [点击进入](${this.url})`
        }
      }
    }
  }

</script>
<style lang="stylus">

  .dashboard-item
    display: flex
    flex-direction: column
    align-items: center
    cursor: pointer

    > * + *
      margin-top: 5px

    .name
      font-size 14px
      color var(--color-text-secondary)

    .value
      font-size 18px
      color var(--color-primary)

    .mask
      position: fixed
      overflow: hidden
      top 0
      left 0
      bottom 0
      right 0
      margin 0
      background: rgba(#000, .5)
      z-index: 99999
      cursor: default
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
      opacity: 0
      pointer-events: none
      transition: .2s

      @media screen and (max-width: 400px)
        width 100%
        justify-content: flex-end

      &.shown
        opacity: 1
        pointer-events: all

      &.shown .drawer
        transform none

      .drawer
        transform translateY(100%)
        overflow: hidden
        background: #fff
        z-index: 100000
        box-sizing: border-box
        width: 400px
        box-shadow: 0 0 20px rgba(0, 0, 0, .1)
        cursor: default
        display: flex
        flex-direction: column
        padding 10px 0
        overflow-y: scroll
        transition: .3s

        @media screen and (max-width: 400px)
          width 100%

        .title-bar
          margin 0 25px
          padding 15px 0
          display: flex
          flex-direction: row
          justify-content: center
          align-items: center

          .title
            font-size: 16px
            font-weight: bold

        .drawer-view
          padding 15px

</style>
