<template lang="pug">
.admin-page
  input#uploadInput(type='file' accept='.csv' style="display: none" @change="uploadRecords")
  .subcontainer
    .summary-p 讲座：{{ lecture.name }}
      a(style="float:right; cursor: pointer" href='../../../static/examples/lectureRecords.csv' download="cardRecords.csv") 下载样例
      a(style="float: right; cursor: pointer; margin-right: 10px" @click="document.getElementById('uploadInput').click()") 点此导入...
      
    table.list
      tr.record-header
        th.cardnum 一卡通号
        th.name 姓名
        th.location 地点
        th.time 时间
        th.operation 操作
      tr.record.add
        td
          input.cardnum(v-model="newRecord.cardnum")
        td
          input.name(v-model="newRecord.name")
        td
          input.location(v-model="lecture.location" readonly="readonly")
        td
          timestamp.timestamp(
            v-model="newRecord.timestamp",
            useType="datetime",
            showType="datetimesecond",
          )
        td.operation
          confirm-button.add-record(v-if="newRecord.cardnum && newRecord.name && lecture.location && newRecord.timestamp" @click='addRecord()' confirm-text='确定') 添加

      tr.record(v-for="(record, index) in cardRecords")
        td
          input.cardnum(v-model="record.cardnum" readonly="readonly")
        td
          input.name(v-model="record.name" readonly="readonly")
        td
          input.location(v-model="lecture.location" readonly="readonly")
        td
          input.timestamp(v-model="record.timeStr" readonly="readonly")
        td.operation
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
import moment from "moment";
import confirmButton from "@/components/ConfirmButton.vue";
import parseCSV from "neat-csv";

export default {
  components: {
    timestamp,
    pageBar,
    confirmButton
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
      newRecord: {},
      document: document,
      basePath: process.env.BASE_URL
    };
  },
  methods: {
    async uploadRecords() {
      const file = document.getElementById("uploadInput").files[0];
      const content = await new Promise(resolve => {
        const fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onload = e => resolve(e.target.result);
      });
      const result = await parseCSV(content);
      console.log(result);
      await api.post("/api/lecture/admin/cardRecord", {
        recordArray: result
          .filter(item => item.cardnum && item.name && item.time)
          .map(item => ({
            cardnum: item.cardnum,
            name: item.name,
            timestamp:
              Number(item.time) + "" !== NaN + ""
                ? +moment(Number(item.time))
                : +moment(item.time),
            dateStr: this.lecture.dateStr,
            location: this.lecture.location
          }))
      });
      this.reloadData();
    },
    async removeRecord(id) {
      await api.delete("api/lecture/admin/cardRecord?id=" + id);
      this.reloadData();
    },
    async reloadData() {
      const id = this.$route.params.id;
      api
        .get("/api/lecture/admin/detail?id=" + id)
        .then(result => (this.lecture = result[0]));
      this.originCardRecords = (
        await api.get("/api/lecture/admin/cardRecord?lectureID=" + id)
      )
        .map(item => ({
          ...item,
          timeStr: moment(item.timestamp).format("YYYY/MM/DD HH:MM:SS")
        }))
        .sort((item1, item2) => item2.timestamp - item1.timestamp);
      this.initNewRecord();
      this.changePage({
        ...this.pagination,
        total: this.originCardRecords.length
      });
    },
    changePage(pagination) {
      this.pagination = pagination;
      this.cardRecords = this.originCardRecords.slice(
        (pagination.current - 1) * pagination.pageSize,
        (pagination.current - 1) * pagination.pageSize + pagination.pageSize
      );
    },
    async addRecord() {
      await api.post("/api/lecture/admin/cardRecord", {
        recordArray: [
          {
            ...this.newRecord,
            dateStr: this.lecture.dateStr,
            location: this.lecture.location
          }
        ]
      });
      this.reloadData();
    },
    initNewRecord() {
      this.newRecord = {
        cardnum: "",
        name: "",
        timestamp: this.newRecord.timestamp
      };
    }
  },
  created() {
    this.reloadData();
  }
};
</script>

<style lang="stylus" scoped>
.operation {
  width: 60px;
}
</style>
