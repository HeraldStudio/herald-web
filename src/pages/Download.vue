<template lang='pug'>
  .page
    .hint 小猴偷米新版 App 已经发布上线，请尽快更新
    img.app(:src='appImg')
    .buttons
      a(:href='url' target='_blank' v-if='url')
        button 点击前往下载（iOS、Andriod通用）
      button(v-else) 稍等片刻~
    //- .hint iOS 用户请前往 App Store 下载 
    img.qr(:src='qrcodeImg')
   
        
</template>
<script>
import qrcodeImg from "static/images/qrcode.jpg";
import appImg from 'static/images/App2.png'
import api from "@/api";
export default {
  data() {
    return {appImg, qrcodeImg, url: "https://tommy.seu.edu.cn/ws4/app-download" };
  },
  async created() {
  }
};
</script>
<style lang='stylus' scoped>
.page {
  text-align: center;

  .hint {
    display: block;
    font-size: 14px;
    margin-bottom: 15px;

    &::before {
      content: '!';
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-right: 5px;
      border-radius: 50%;
      background: var(--color-warning-light);
      color: var(--color-warning-dark);
      text-align: center;
    }
  }

  .buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 25px;
    align-items: center;

    button {
      margin: 5px 0;
    }

    * + * {
      margin-left: 10px;
    }
  }

  img.qr {
    width: 100%;
    height: auto;
    filter: hue-rotate(-15deg);
    max-width: 300px;
    margin: 50px auto;
  }
  img.app {
    width: 100%;
    height: auto;
    filter: hue-rotate(-15deg);
    max-width: 400px;
    margin: 20px auto;
  }
}
</style>
