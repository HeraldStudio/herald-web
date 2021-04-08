<template lang="pug">
#notice.admin-page
  .subcontainer
    table.list
      tr.lecture-header
        th.name 名称
        th.location 地点
        th.dateStr 日期
        th.url 网址
        th.operations 操作
      tr.lecture(v-for="(lecture, index) in lectures")
        td
          input.name(v-model="lecture.name")
        td
          input.location(v-model="lecture.location")
        td
          timestamp.dateStr(
            v-model="lecture.date",
            useType="date",
            showType="date"
          )
        td
          input.url(v-model="lecture.url")
        td.operations
          button.save(v-if="lecture.name") 保存
          confirm-button.remove 删除
    page-bar(:current='pagination.current' :pageSize='pagination.pageSize' :total='pagination.total' @change='changePage')
</template>

<script>
import api from "@/api";
import confirmButton from "@/components/ConfirmButton.vue";
import timestamp from "@/components/TimestampPicker.vue";
import pageBar from "@/components/Pagination.vue";
// import confirmButton from '@/components/ConfirmButton.vue'

export default {
  components: {
    confirmButton,
    timestamp,
    pageBar
  },
  data() {
    return {
      lectures: [],
      originLectures: [],
      newLecture: {},
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0
      }
    };
  },
  async created() {
    this.originLectures = (await api.get("/api/lectureManage")).map(item => ({
      ...item,
      date: new Date(item.dateStr).getTime()
    }));
    this.initNewLecture();
    this.changePage({
      ...this.pagination,
      total: this.originLectures.length
    });
  },
  methods: {
    initNewLecture() {
      const now = new Date();
      this.newBanner = {
        id: null,
        name: "",
        dateStr: `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`,
        url: "",
        location: ""
      };
    },
    changePage(pagination) {
      this.pagination = pagination;
      console.log(pagination);
      this.lectures = this.originLectures.slice(
        (pagination.current - 1) * pagination.pageSize + 1,
        (pagination.current - 1) * pagination.pageSize + 1 + pagination.pageSize
      );
      console.log(
        (pagination.current - 1) * pagination.pageSize + 1,
        (pagination.current - 1) * pagination.pageSize + 1 + pagination.pageSize
      );
    }
  }
};
</script>

<style lang="stylus">

.list
  .lecture-header
    .location
      width 150px
    .dateStr
      width 115px
</style>
