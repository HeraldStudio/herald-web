<template lang="pug">

.page.notificationview(v-if="data.title")
    .title 
        .title-row 
            .title-text {{data.title}}
            button.title-read(@click="markRead()" v-if="!data.isRead") 我知道啦
        .status
            .role {{`来自 ${data.role} ${data.publisher}`}}
            .time 发布于{{formatDateNatural(data.publishTime)}}
        span.tag.notification(v-for="tag in data.tag.split('|')" :key="tag") {{tag}}
    .content {{data.content}}
.page.notificationview(v-else)
    .empty-hint 稍等~通知正在加载

</template>
<script>
import api from "@/api";
import formatter from "@/util/formatter";
export default {
  data() {
    return {
      data: {}
    };
  },
  created() {
    this.load();
  },
  watch: {
    $route() {
      this.load();
    }
  },
  methods: {
    ...formatter,
    async markRead() {
      if (this.data.isRead) {
        // return;
      }
      let res = await api.post("/api/notification/read", {
        id: this.$route.params.id
      });
    },
    async load() {
      this.data = await api.get(
        `/api/notification?id=${this.$route.params.id}`
      );
    }
  }
};
</script>
<style lang="stylus" scoped>
.title {
    .title-row {
        display: flex;
        justify-content: space-between;

        .title-text {
            font-size: 20px;
            font-weight: bold;
        }

        .title-read {
        }
    }

    .status {
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
        color: var(--color-text-secondary);
        font-size: 12px;
        margin-bottom: 8px;

        .role {
        }

        .time {
        }
    }

    .empty-hint {
        height: 60px;
        width: 100%;
        line-height: 60px;
        font-size: 20px;
        color: var(--color-text-secondary);
        text-align: center;
    }

    .tag {
        display: inline-block;
        border-radius: 3px;
        height: 16px;
        line-height: 16px;
        padding: 3px 8px;
        border-radius: 11px;
        margin-right: 8px;
        margin-bottom: 2px;
        background: var(--color-primary);
        color: #fff;
        font-size: 12px;
        font-weight: bold;
    }
}

.content {
    margin-top: 20px;
    padding: 10px;
    background-color: var(--color-divider);
    border-radius: 10px;
}
</style>
