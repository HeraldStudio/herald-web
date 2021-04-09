<template lang="pug">
.admin-page
  .subcontainer
    table.list
      tr.lecture-header
        th.name 名称
        th.location 地点
        th.dateStr 日期
        th.url 网址
        th.operations 操作
      tr.lecture.add
        td
          input.name(placeholder="新增" v-model="newLecture.name")
        td
          input.location(v-model="newLecture.location")
        td
          timestamp.dateStr(
            v-model="newLecture.date",
            useType="date",
            showType="date",
          )
        td
          input.url(v-model="newLecture.url")
        td.operations
          confirm-button(
            v-if="newLecture.name && newLecture.location && newLecture.date",
            @click="addLecture()" confirm-text='确定新增'
          ) 新增讲座

      tr.lecture(v-for="(lecture, index) in lectures")
        td
          input.name(v-model="lecture.name" readonly="readonly")
        td
          input.location(v-model="lecture.location" readonly="readonly")
        td
          input.dateStr(v-model="lecture.dateStrFront" readonly="readonly")
        td
          input.url(v-model="lecture.url" readonly="readonly")
        td.operations
          button.record-data(v-if="lecture.name" @click='$router.push({ path: `/admin/lecture/detail/${lecture.id}` });') 打卡数据
          confirm-button.remove(@click='removeLecture(lecture.id)' confirm-text='确定') 删除
    page-bar(
      :current="pagination.current",
      :pageSize="pagination.pageSize",
      :total="pagination.total",
      @change="changePage"
    )
</template>

<script>
import api from "@/api";
import confirmButton from "@/components/ConfirmButton.vue";
import timestamp from "@/components/TimestampPicker.vue";
import pageBar from "@/components/Pagination.vue";
import moment from 'moment'
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
  created() {
    this.reloadData();
  },
  methods: {
    async reloadData() {
      this.originLectures = (await api.get("/api/lecture/admin")).map(item => ({
        ...item,
        date: new Date(item.dateStr).getTime(),
        dateStrFront: moment(item.dateStr).format("YYYY/M/D")
      })).sort((item1, item2) => item2.date - item1.date);
      this.initNewLecture();
      this.changePage({
        ...this.pagination,
        total: this.originLectures.length
      });
    },
    initNewLecture() {
      this.newLecture = {
        id: null,
        name: "",
        date: new Date().getTime(),
        url: "",
        location: ""
      };
    },
    changePage(pagination) {
      this.pagination = pagination;
      this.lectures = this.originLectures.slice(
        (pagination.current - 1) * pagination.pageSize + 1,
        (pagination.current - 1) * pagination.pageSize + 1 + pagination.pageSize
      );
    },
    async addLecture() {
      const date = moment(this.newLecture.date)
      this.newLecture.dateStr = `${date.format('YYYY-MM-DD')}`
      await api.post('/api/lecture/admin', this.newLecture)
      this.reloadData()
    },
    async removeLecture(id) {
      await api.delete('/api/lecture/admin?id=' + id)
      this.reloadData()
    }
  }
};
</script>

<style lang="stylus" scoped>
.list {
  .location {
    width: 150px;
  }

  .dateStr {
    width: 115px;
  }
}
</style>
