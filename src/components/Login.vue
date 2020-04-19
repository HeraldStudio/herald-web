<template lang="pug">

  .widget.login
    .live2d-container
      //- 仿 B 站，输密码闭眼睛
      live2d(:force-state='false')
    .tips 小猴偷米对接东南大学统一身份认证服务和网络与信息中心共享数据库，为您提供准确有效的数据查询服务与校园生活相关特色服务。
    button.primary.disabled(v-if='loging') 正在登录…
    button.primary(v-else, @click='login()') 统一身份认证
    
    .Qtips 
      div 版权信息  2020 东南大学信使计划工作室
      a(href="https://www.beian.miit.gov.cn/") 苏 ICP 备10088665号

</template>
<script>
import api from "@/api";
import live2d from "@/components/Live2D.vue";

export default {
  props: ["loging"],
  components: { live2d },
  data() {
    return {
      loading: false
    };
  },
  created() {},
  mounted() {
    this.loading = false;
  },
  methods: {
    preventTab(e) {
      // 同时，既然自动跳过去了，应该阻止用户再次按下 tab
      if (e.keyCode === 9) {
        e.preventDefault();
      }
    },
    async login() {
      // 先清除所有的缓存
      this.$store.commit("logout");
      //缓存当前路由
      this.$store.commit("clearUnfinishedRoute");
      this.$store.commit("saveUnfinishedRoute", {
        params: this.$route.params,
        fullPath: this.$route.fullPath
      });
      this.loading = true;
      window.location = `https://newids.seu.edu.cn/authserver/login?goto=https://tommy.seu.edu.cn`;
    }
  }
};
</script>
<style lang="stylus" scoped>
.widget.login {
  align-items: center;
  position: absolute;
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .live2d-container {
    position: relative;
    width: 100px;
    height: 100px;
    filter: hue-rotate(-15deg);
    margin-bottom: 25px;
  }

  .hint {
    margin-bottom: 30px;
    font-size: 16px;
    color: #555;
    font-weight: bold;
  }

  input {
    width: 260px;
    margin-bottom: 10px;
  }

  button {
    width: 260px;
    font-size: 16px;
    padding: 4px 10px;

    &.disabled {
      pointer-events: none;
    }
  }

  .error {
    font-size: 14px;
    color: #fff;
    background: var(--color-error);
    padding: 5px 10px;
    border-radius: 3px;
  }

  .tips {
    text-indent: 2em;
    text-align: justify;
    width: 260px;
    color: #ccc;
    margin-bottom: 40px;
  }

  .Qtips {
    text-align: justify;
    width: 260px;
    position: absolute;
    bottom: 10px;
    color: #ccc;
    text-align: center;
  }

  .tips-law {
    text-align: center;
    width: 260px;
    color: #ccc;
    margin-top: 5px;
  }

  .graduate-tip {
    text-align: justify;
    width: 260px;
    color: #aaa;
    margin: 5px 0 20px;
  }
}
</style>
