<template lang="pug">
.admin-page
  .subcontainer
    .summary-p 讲座：{{ lecture.name }}
    table.list
      tr.record-header
        th.cardnum 一卡通号
        th.name 姓名
        th.location 地点
        th.time 时间
        th.operations 操作
      tr.record(v-for="(record, index) in cardRecords")
        td
          input.cardnum(v-model="record.cardnum" readonly="readonly")
        td
          input.name(v-model="record.name" readonly="readonly")
        td
          input.location(v-model="record.location" readonly="readonly")
        td
          input.timestamp(v-model="record.timeStr" readonly="readonly")
    page-bar(
      :current="pagination.current",
      :pageSize="pagination.pageSize",
      :total="pagination.total",
      @change="changePage"
    )
</template>

<script>
import api from "@/api";
import timestamp from "@/components/TimestampPicker.vue";
import pageBar from "@/components/Pagination.vue";
import moment from 'moment';

export default {
  components: {
    timestamp, pageBar
  },
  data() {
    return {
      lecture: {},
      cardRecords: [],
      originCardRecords: [],
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0
      }
    };
  },
  methods: {
    async loadData() {
      const id = this.$route.params.id
      this.lecture = {
        id: "{FC2D081E-FF21-4D3E-9ADC-F24BC917679B}",
        name: "“工程伦理学”系列三讲：原理、案例及应用",
        dateStr: "2014-03-03",
        location: "教学3号楼团委报告厅",
        url: null
      };
      this.originCardRecords = (await api.get("/api/lecture/admin/cardRecord?lectureID=" + id)).map(
        item => (
          {
            ...item,
            timeStr: moment(item.timestamp).format("YYYY/M/D HH:MM:SS")
          }
        )
      )
      this.changePage({
        ...this.pagination,
        total: this.originCardRecords.length
      });
    },
    changePage(pagination) {
      this.pagination = pagination;
      this.cardRecords = this.originCardRecords.slice(
        (pagination.current - 1) * pagination.pageSize + 1,
        (pagination.current - 1) * pagination.pageSize + 1 + pagination.pageSize
      );
    },
  },
  created() {
    this.loadData()
  },
};
</script>

<style lang="stylus" scoped>

.list {
  .location {
    width: 150px;
  }

  .timestamp {
    width: 160px;
  }
}

</style>
