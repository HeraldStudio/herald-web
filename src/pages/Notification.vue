<template lang="pug">
.page.notification 
  .search 
    button.info( @click='displayUnread = !displayUnread' :class='{ selected: displayUnread }') 仅展示未读
    input.input(placeholder="输入标题搜索已加载通知" v-model="searchKey")
  .empty-hint(v-if="filteredNotification.length === 0") 列表空空如也~
  .notification-list(v-if="filteredNotification.length > 0")
    .notification-item(v-for="item in filteredNotification" :key="item.notificationId" @click="detail(item.notificationId)")
      .notification-title
        .notification-title-text {{item.title}}
        .notification-title-time {{formatDateNatural(item.publishTime)}}
      .line
      .notification-content {{item.content}}
      .notification-status 
        .notification-status-time(v-if='item.readTime') 于{{formatDateNatural(item.readTime)}}阅读
        .notification-status-unread(v-else) 未读
        .notification-status-role 来自{{item.role}}
  .line(v-if="hasMore")
  .more-btn(v-if="hasMore" @click="loadMore") 加载更多
  .line(v-if="hasMore")  

</template>
<script>
import api from "@/api";
import Vue from "vue";
import formatter from "@/util/formatter";
import markdown from "@/components/Markdown";

const RouterLink = Vue.component("router-link");

export default {
  props: ["user"],
  components: { markdown },
  data() {
    return {
      notifications: [],
      searchKey: "",
      displayUnread: false,
      pageSize: 10,
      page: 1,
      hasMore: true
    };
  },
  persist: {
    notice: "herald-default-notice"
  },
  created() {
    this.reload();
  },
  watch: {},
  computed: {
    filteredNotification() {
      return this.notifications.filter(
        k =>
          k.title.includes(this.searchKey) && !(this.displayUnread && k.isRead)
      );
    }
  },
  methods: {
    ...formatter,
    detail(id) {
      this.$router.push({path:`/notification-view/${id}`});
    },
    async reload() {
      this.page = 1;
      this.pagesize = 10;
      this.notifications = [];
      this.load();
    },
    async load() {
      let res = await api.get(
        `/api/notification?page=${this.page}&pageSize=${this.pageSize}`
      );
      this.hasMore = res.hasMore;
      this.notifications = this.notifications.concat(res.list);
    },
    async loadMore() {
      if (this.hasMore) {
        this.page++;
        this.load();
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.notification {
  display: flex;

  .notification-list {
    margin-top: 10px;

    .notification-item {
      padding: 5px 8px 5px 8px;
      margin: 15px 0px 15px 0px;
      border-radius: 10px;
      background-color: var(--color-divider);

      .notification-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0px 2px 2px 2px;

        .notification-title-text {
          flex-grow: 10;
          font-size: 16px;
          font-weight: bold;
        }

        .notification-title-time {
          color: var(--color-text-secondary);
          font-size: 12px;
        }
      }

      .notification-content {
        padding: 5px;
        margin-bottom: 5px;
      }

      .notification-status {
        padding-left: 2px;
        color: var(--color-text-secondary);
        display: flex;
        justify-content: space-between;

        .notification-status-time {
          color: var(--color-text-secondary);
          font-size: 12px;
        }

        .notification-status-unread {
          color: var(--color-primary);
          font-size: 12px;
          font-weight: bold;
        }

        .notification-status-role {
          color: var(--color-text-secondary);
          font-size: 12px;
        }
      }
    }
  }

  .line {
    width: 100%;
    border-top: solid 1px #D0D0D0;
    height: 1px;
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
    margin-top: 10px;
    display: flex;

    .input {
      flex-grow: 1;
      border-radius: 4px;
      margin-left: 5px;
    }
  }
}
</style>