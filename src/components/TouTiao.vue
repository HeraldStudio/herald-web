<template lang="pug">

  .widget.toutiao(v-if='notice')
    span.title 小猴提醒
    span.notice(@click='showNotice') {{notice}}

</template>
<script>
import api from "@/api";
import formatter from "@/util/formatter";

export default {
  data() {
    return {
      notice: false,
      nid: 0
    };
  },
  created() {
    api.get("/api/notice").then(notice => {
      notice.forEach(k => {
        if (k.site === "小猴偷米") {
          this.notice = k.title;
          this.nid = k.nid;
        }
      });
    });
  },
  methods: {
      showNotice(){
          this.$router.push('/notice/' + this.nid)
      }
  }
};
</script>
<style lang="stylus" scoped>
.toutiao {
    display: flex;
    flex-direction: row;
    align-items: center;

    .title {
        text-align: left;
        font-size: 15px;
        font-weight: bold;
        color: var(--color-text-bold);
        padding-right: 10px;
        border-right: 0.5px solid var(--color-divider)
    }

    .notice {
        margin-left 10px;
        color: var(--color-primary);
    }
}
</style>
