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
      tr.record.add
        td
          input.cardnum(v-model="newRecord.cardnum")
        td
          input.name(v-model="newRecord.name")
        td
          input.location(v-model="newRecord.location")
        td
          timestamp.timestamp(
            v-model="newRecord.timestamp",
            useType="datetime",
            showType="datetimesecond",
          )
        td.operations
          //- confirm-button.remove(@click='removeRecord(record.id)' confirm-text='确定') 删除
          confirm-button.add-record(v-if="newRecord.cardnum && newRecord.name && newRecord.location && newRecord.timestamp" @click='addRecord' ) 打卡数据

      tr.record(v-for="(record, index) in cardRecords")
        td
          input.cardnum(v-model="record.cardnum" readonly="readonly")
        td
          input.name(v-model="record.name" readonly="readonly")
        td
          input.location(v-model="record.location" readonly="readonly")
        td
          input.timestamp(v-model="record.timeStr" readonly="readonly")
        td.operations
          confirm-button.remove(@click='removeRecord(record.id)' confirm-text='确定') 删除
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
import confirmButton from "@/components/ConfirmButton.vue";

export default {
  components: {
    timestamp, pageBar, confirmButton
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
      },
      newRecord: {}
    };
  },
  methods: {
    async removeRecord(id) {
      await api.delete('api/lecture/admin/cardRecord?id=' + id)
      this.reloadData()
    },
    async reloadData() {
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
    async addRecord() {
      await api.post("/api/lecture/admin/cardRecord", [this.newRecord])
      this.reloadData()
    }
  },
  created() {
    this.reloadData()
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
