<template lang="pug">
    .page.lost-and-found-list

      ul.info-bar
        button.info(:class='{ selected: column === "myself" }' @click="loadMyself") 我发布的
        button.info(:class='{ selected: column === "found" }' @click="loadFound") 失物招领
        button.info(:class='{ selected: column === "lost" }' @click="loadLost") 寻物启事
        button.info(v-if="isAdmin" :class='{ selected: column === "audit" }' @click="loadAudit") 发布审核
      .search(v-if="column === 'lost' || column === 'found'")
        input.input(v-model="searchKey" placeholder="请输入物品名称")
        button(@click="search") 搜索
      .line(style="margin-top:15px;" v-if="list.length === 0 && column !== 'myself'")
      .empty-hint(v-if="list.length === 0 && column !== 'myself'") 还没有发布内容鸭
      .line(v-if="list.length === 0 && column !== 'myself'")
      .line(v-if="column === 'myself'" style="margin-top:15px;")
      button(v-if="column === 'myself'" class="selected" @click='publish' style="height:30px; margin-top:15px;margin-bottom:0px;box-shadow:none; border-radius:4px;") 我要发布
      .lf-list(v-if="list.length > 0")
        .lf-item(v-for="item in list" :key="item._id" @click="detail(item._id)")
          .line
          .lf-title
            .lf-type(:class="{ 'lf-type-lost':item.type==='lost', 'lf-type-found':item.type==='found'}") {{item.type === 'found' ? '失物招领' : '寻物启事'}} 
            .lf-title-text {{item.title}}
            .lf-title-tooltip(v-if="messageCount[item._id]") {{messageCount[item._id]}}
          .lf-describe {{item.describe}}
          .lf-image-box(v-if="item.imageUrl")
            img.lf-image(:src="item.imageUrl.split('|')[0]")
          .lf-status {{item.isAudit ? (item.isFinished ? '已关闭' : '正在进行') : (item.isFinished ? '审核被拒' : '等待审核')}} - 更新时间 {{formatter.formatTimeNatural(item.lastModifiedTime)}}
      .line(v-if="hasMore")
      .more-btn(v-if="hasMore" @click="loadMore") 加载更多
      .line(v-if="hasMore")

          
        
</template>

<script>
import api from "@/api";
import formatter from "@/util/formatter";
export default {
  data() {
    return {
      list: [],
      page: 1,
      pagesize: 10,
      column: "myself", // 'found' 'myself' 'audit'
      isAdmin: false,
      hasMore: false,
      formatter,
      messageCount: {},
      searchKey:""
    };
  },
  methods: {
    loadLost() {
      this.page = 1;
      this.pagesize = 10;
      this.column = "lost";
      this.list = [];
      this.load();
    },
    loadFound() {
      this.page = 1;
      this.pagesize = 10;
      this.column = "found";
      this.list = [];
      this.load();
    },
    loadMyself() {
      this.page = 1;
      this.pagesize = 10;
      this.column = "myself";
      this.list = [];
      this.load();
    },
    loadAudit() {
      this.page = 1;
      this.pagesize = 10;
      this.column = "audit";
      this.list = [];
      this.load();
    },
    async load() {
      let res = await api.get(
        `/api/lostAndFound?type=${this.column}&page=${this.page}&pagesize=${this.pagesize}`
      );
      if (res.length < this.pagesize) {
        this.hasMore = false;
      } else {
        this.hasMore = true;
      }
      this.list = this.list.concat(res);
    },
    async loadMore() {
      this.page = this.page + 1;
      this.load();
    },
    publish() {
      window.location = 'https://tommy.seu.edu.cn/app-support/#/lost-and-found/'+api.token
      //this.$router.push({ path: "/lost-and-found/publish" });
    },
    detail(id) {
      this.$router.push({ path: `/lost-and-found/detail/${id}` });
    },
    async loadMessageCount() {
      this.messageCount = await api.get("/api/lostAndFound/message");
    },
    async search(){
      this.list = await api.get(`/api/lostAndFound/search?type=${this.column}&key=${this.searchKey}`)
    },
    async clear(){
      this.page = 1
      this.list = []
      this.searchKey = ''
      this.load()
    }
  },
  watch:{
    searchKey(){
      this.search()
    }
  },
  async created() {
    // 检查是否管理员
    let res = await api.get(`/api/lostAndFound?type=audit&page=1&pagesize=10`);
    this.isAdmin = res.length > 0;
    await this.loadMessageCount();
    this.load();
  }
};
</script>

<style lang="less" scoped>
.lost-and-found-list {
  display: flex;
  flex-direction: column;
  .line {
    width: 100%;
    border-top: solid 1px #f0f0f0;
    height: 1px;
  }
  .lf-item:active {
    background: #f6f6f6;
  }
  .lf-list {
    margin-top: 20px;
    .lf-title {
      display: flex;
      align-items: center;
      margin-top: 10px;
      .lf-type {
        font-weight: bold;
        color: #ffffff;
        background-color: var(--color-primary);
        padding: 3px;
        border-radius: 4px;
      }
      .lf-type-found {
        background-color: var(--color-success);
      }
      .lf-type-lost {
        background-color: var(--color-warning);
      }
      .lf-title-text {
        font-size: 16px;
        font-weight: bold;
        margin-left: 8px;
      }
      .lf-title-tooltip {
        background: var(--color-error);
        color: white;
        font-size: 16px;
        border-radius: 100px;
        padding: 2px 8px;
        margin-left: 8px;
      }
    }
    .lf-describe {
      margin-top: 10px;
    }
    .lf-image-box {
      width: 100%;
      height: 150px;
      overflow: hidden;
      margin-top: 10px;
    }
    .lf-image {
      width: 100%;
      position: relative;
      top: -50%;
    }
    .lf-status {
      color: var(--color-text-secondary);
      padding-bottom: 10px;
      margin-top: 10px;
    }
  }
  .more-btn {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: var(--color-primary);
    text-align: center;
  }
  .empty-hint {
    height: 60px;
    line-height: 60px;
    font-size: 14px;
    color: var(--color-text-secondary);
    text-align: center;
  }
  .more-btn:active {
    background: #f6f6f6;
  }
  .search {
    width: 100%;
    margin-top: 20px;
    display: flex;
    .input{
      flex-grow: 1;
      border-radius: 4px;
    }
    button {
      margin-left: 10px;
      border-radius: 4px;
      box-shadow: none;
    }
  }
}
</style>