<template lang="pug">
    .page.lost-and-found-list

      ul.info-bar
        button.info(:class='{ selected: column === "publishFromMe" }' @click="loadPublishFromMe") 我发布的
        button.info(:class='{ selected: column === "all" }' @click="loadAll") 组队信息
        button.info(:class='{ selected: column === "participateFromMe" }' @click="loadParticipateFromMe") 我申请的
        button.info(v-if="isAdmin" :class='{ selected: column === "audit" }' @click="loadAudit") 发布审核
      .search(v-if="column === 'all'")
        input.input(v-model="searchKey" placeholder="请输入名称")
        button(@click="search") 搜索
      ul.info-bar
        button.info(v-if="column === 'all'" :class="{ selected: this.types.indexOf('SRTP项目') !== -1 }" @click="srtpTypes") SRTP项目
        button.info(v-if="column === 'all'" :class="{ selected: this.types.indexOf('竞赛') !== -1  }" @click="comptitionTypes") 竞赛
        button.info(v-if="column === 'all'" :class="{ selected: this.types.indexOf('其他') !== -1  }" @click="otherTypes") 其他
      .line(style="margin-top:15px;" v-if="list.length === 0 && column !== 'publishFromMe'")
      .empty-hint(v-if="list.length === 0 && column === 'all'") 还没有发布内容鸭
      .empty-hint(v-if="list.length === 0 && column === 'participateFromMe'") 还没有申请信息鸭
      .line(v-if="list.length === 0 && column !== 'all'")
      .line(v-if="column === 'publishFromMe'" style="margin-top:15px;")
      button(v-if="column === 'publishFromMe'" class="selected" @click='publish' style="height:30px; margin-top:15px;margin-bottom:0px;box-shadow:none; border-radius:4px;") 我要发布
      .lf-list(v-if="list.length  > 0")
        .lf-item(v-for="item in list" key="item._id" @click="detail(item._id)")
          .line
          .lf-title
            .lf-type(:class="{'lf-type-srtp':item.category==='SRTP','lf-type-competiton':item.category==='COMPETITION'}") {{item.category==='SRTP' ? 'SRTP项目' : item.category==='COMPETITION' ?'竞赛' : item.category==='OTHER' ?'其他' : '申请'}} 
            .lf-title-text {{item.title}}
            .lf-title-tooltip(v-if="messageCount[item._id]") 有新的招募信息请查看
          .lf-describe {{item.projectDesc}}
          .lf-status(v-if="column !== 'audit'") {{item.auditStatus === "WAITING" ? '正在审核' : item.auditStatus === "PASSED" ? '审核通过':'审核被拒'}}{{item.auditStatus === "PASSED" ? '剩余招募人数'+item.nowNeedNumber+'人':''}}
          .lf-status(v-if="column === 'audit'") 等待审核
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
      types: ["SRTP项目", "竞赛", "其他"],
      list: [],
      page: 1,
      pagesize: 10,
      column: "publishFromMe", // "publishFromMe" "all" "participateFromMe"
      isAdmin: false,
      hasMore: false,
      formatter,
      messageCount: {},
      searchKey: ""
    };
  },
  methods: {
    srtpTypes() {
      if (this.types.indexOf("SRTP项目") === -1) {
        this.types.push("SRTP项目");
      } else {
        this.types.splice(this.types.indexOf("SRTP项目"), 1);
      }
      search();
    },
    comptitionTypes() {
      if (this.types.indexOf("竞赛") === -1) {
        this.types.push("竞赛");
      } else {
        this.types.splice(this.types.indexOf("竞赛"), 1);
      }
      search();
    },
    otherTypes() {
      if (this.types.indexOf("其他") === -1) {
        this.types.push("其他");
      } else {
        this.types.splice(this.types.indexOf("其他"), 1);
      }
      search();
    },
    loadAll() {
      this.page = 1;
      this.pagesize = 10;
      this.column = "all";
      this.list = [];
      this.types = ["SRTP项目", "竞赛", "其他"];
      this.load();
    },
    loadParticipateFromMe() {
      this.page = 1;
      this.pagesize = 10;
      this.column = "participateFromMe";
      this.list = [];
      this.load();
    },
    loadPublishFromMe() {
      this.page = 1;
      this.pagesize = 10;
      this.column = "publishFromMe";
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
    publish() {
      this.$router.push({ path: `/team/publish` });
    },
    async load() {
      let res = [];
      if (this.column === "audit") {
        res = await api.get(`/api/teamProject/audit?&page=1&pagesize=10`);
      } else {
        res = await api.get(
          `/api/teamProject/project?kind=${this.column}&page=${
            this.page
          }&pagesize=${this.pagesize}`
        );
      }

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

    detail(id) {
      //this.$router.push({ path: `/lost-and-found/detail/${id}` });
    },
    async loadMessageCount() {
      //this.messageCount = await api.get("/api/lostAndFound/message");
    },
    async search() {
      this.list = await api.get(
        `/api/teamProject/search?type=${this.types}&key=${this.searchKey}`
      );
    },
    async clear() {
      this.page = 1;
      this.list = [];
      this.searchKey = "";
      this.load();
    }
  },
  watch: {
    searchKey() {
      this.search();
    }
  },
  async created() {
    // 检查是否管理员
    let res = await api.get(`/api/teamProject/audit?&page=1&pagesize=10`);
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
      .lf-type-other {
        background-color: var(--color-primary);
      }
      .lf-type-srtp {
        background-color: var(--color-primary);
      }
      .lf-type-competiton {
        background-color: var(--color-primary);
      }
      .lf-type-participation {
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
    margin-bottom: 10px;
    display: flex;
    .input {
      margin-left: 10px;
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