
<template lang="pug">
  .page.team-project-publish
    .first-bar
      .left 类型
      select(v-model="type" placeholder="请选择类型")
        option(v-for="item in types"  :label="item" :type="item")   
</template>

<script>
import api from "@/api";
import formatter from "@/util/formatter";
export default {
  data() {
    return {
      type: "",
      types: ["SRTP项目", "竞赛", "其他"]
    };
  },
  computed: {},
  methods: {},
  async created() {}
};
</script>

<style lang="less">

</style>