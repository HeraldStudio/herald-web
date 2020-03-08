<template lang="pug">

  .widget.login
    .live2d-container
      //- 仿 B 站，输密码闭眼睛
      live2d(:force-state='false')
    button.primary.disabled(v-if='loging') 正在登录…
    button.primary(v-else, @click='login()') 点击进行统一身份验证
    .tips 小猴偷米使用业界公认标准加密你的所有隐私数据，使用只有你知道的统一身份认证密码和只有你的设备保存的会话标识符 (token) 作为数据解密的密钥。
    .Qtips 小猴偷米客服QQ：210784021

</template>
<script>

  import api from '@/api'
  import live2d from '@/components/Live2D.vue'

  export default {
    props: ['loging'],
    components: { live2d },
    data() {
      return {
        loading: false,
      }
    },
    created() {},
    mounted() {
      this.loading = false
    },
    methods: {
      preventTab(e) { // 同时，既然自动跳过去了，应该阻止用户再次按下 tab
        if (e.keyCode === 9) {
          e.preventDefault()
        }
      },
      async login() {
        // 先清除所有的缓存
        this.$store.commit('logout')
        this.loading = true
        window.location = `https://newids.seu.edu.cn/authserver/login?goto=https://tommy.seu.edu.cn`
      }
    },
  }

</script>
<style lang="stylus" scoped>

  .widget.login
    align-items center
    position absolute
    width 100%
    min-height 100%
    margin 0
    bottom 0
    display flex
    flex-direction column
    justify-content center

    .live2d-container
      position relative
      width 100px
      height 100px
      filter hue-rotate(-15deg)
      margin-bottom 25px

    .hint
      margin-bottom 30px
      font-size 16px
      color #555
      font-weight bold

    input
      width 260px
      margin-bottom 10px

    button
      width 260px
      font-size 16px
      padding 4px 10px

      &.disabled
        pointer-events none

    .error
      font-size 14px
      color #fff
      background var(--color-error)
      padding 5px 10px
      border-radius 3px

    .tips
      text-align justify
      width 260px
      color #ccc
      margin-top 40px

    .Qtips
      text-align justify
      width 260px
      color #ccc
      margin-top 100px
      text-align center
    .tips-law
      text-align center
      width 260px
      color #ccc
      margin-top 5px
      
    .graduate-tip
      text-align justify
      width 260px
      color #aaa
      margin: 5px 0 20px;

</style>
