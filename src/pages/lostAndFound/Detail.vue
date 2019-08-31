
<template lang="pug">
  .page.lost-and-found-detail
    .lf-title
      .lf-type(:class="{ 'lf-type-lost':type==='lost', 'lf-type-found':type==='found'}") {{type === 'found' ? '失物招领' : '寻物启事'}} 
      .lf-title-text {{title}}
    .lf-field(v-if="lastModifiedTime")
      .lf-hint 更新时间
      .lf-describe {{formatter.formatTimeNatural(lastModifiedTime)}}
    .lf-field
      .lf-hint 情况描述
      .lf-describe {{describe}}
    .lf-image-box(v-if="images.length > 0" v-for="img in images")
      img.lf-image(:src='img')
    .lf-field(v-if="canAudit && !isAudit")
      .lf-hint 审核
      .lf-button-panel(style="margin-top:10px;")
        button.success(@click="audit(true)") 允许发布
        button.danger(@click="audit(false)") 拒绝发布并关闭
      
    
    .lf-field(v-if="type==='found' && isAudit && !isFinished")
      .lf-hint 是我丢的！
      textarea(v-model="message" placeholder='请留下你的联系方式，捡到你遗失物品的热心同学将与你联系。不要忘记说谢谢哦！小猴偷米致力于维护你的信息安全，这些消息仅会被您和发布者看到。')
      button(@click="sendMessage" style="margin-top:10px;") 发送消息
    .lf-field(v-if="type==='lost' && isAudit && !isFinished")
      .lf-hint 我捡到了！
      textarea(v-model="message" placeholder='遗失物品的同学一定很着急，小猴偷米替 ta 感谢你哦～请在此处留下你的联系方式，小猴偷米致力于维护你的信息安全，这些消息仅会被您和发布者看到。')
      button(@click="sendMessage" style="margin-top:10px;") 发送消息
</template>

<script>
import api from "@/api";
import formatter from "@/util/formatter";
export default {
  data() {
    return {
      id: "",
      title: "…",
      describe: "正在加载",
      status: "",
      images: [],
      type: "",
      lastModifiedTime: 0,
      isAudit: false,
      isFinished: false,
      canAudit: false,
      formatter,
      message: "",
      creator: ""
    };
  },
  computed: {
    isOwn() {
      return this.creator === this.$store.state.user.cardnum;
    }
  },
  methods: {
    async load() {
      this.id = this.$route.params.id;
      if (!this.id) {
        this.$router.go(-1);
        return;
      }
      try {
        let res = await api.get("/api/lostAndFound?id=" + this.id);
        this.title = res.title;
        this.describe = res.describe;
        this.isFinished = res.isFinished;
        this.isAudit = res.isAudit;
        this.lastModifiedTime = res.lastModifiedTime;
        if (res.isAudit) {
          this.status = "审核中";
        } else {
          if (res.isFinished) {
            this.status = "已完成";
          } else {
            this.status = "进行中";
          }
        }
        this.images = res.imageUrl.split("|");
        this.canAudit = res.canAudit;
        this.type = res.type;
        this.creator = res.creator;
      } catch (e) {
        this.$toasted.show("获取失败");
        this.$router.go(-1);
      }
    },
    async audit(pass){
      try{
        await api.post('/api/lostAndFound/audit', { id:this.id, pass })
        this.load()
        this.$toasted.show('操作成功')
        this.$router.go(-1)
      } catch(e) {
        this.$$toasted.show('操作失败，请重试')
      }
    }
  },
  async created() {
    await this.load();
  }
};
</script>

<style lang="less">
.lost-and-found-detail {
  .lf-type {
    font-weight: bold;
    color: #ffffff;
    background-color: var(--color-primary);
    padding: 5px;
    font-size: 16px;
    border-radius: 4px;
    align-self: flex-start;
  }
  .lf-type-found {
    background-color: var(--color-success);
  }
  .lf-type-lost {
    background-color: var(--color-warning);
  }
  .lf-title-text {
    font-size: 20px;
    font-weight: bold;
    margin-left: 10px;
  }
  .lf-title {
    display: flex;
    align-items: center;
  }
  .lf-field {
    margin-top: 15px;
    .lf-hint {
      font-weight: 16px;
      font-weight: bold;
    }
    .lf-describe {
      margin-top: 5px;
    }
    textarea {
      height: 100px;
      border: none;
      background: var(--color-tool-bg);
      border-radius: 4px;
      margin-top: 10px;
      width: 100%;
    }
    .danger {
      background-color: var(--color-error);
      border-color: var(--color-error);
    }
  }
  .lf-image {
    width: 100%;
    object-fit: cover;
    margin-top: 10px;
    border-radius: 6px;
  }
}
</style>