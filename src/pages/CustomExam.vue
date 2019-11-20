<template lang='pug'>
  .page
    .summary 添加在考试系统中无法查询到的考试安排
    table.list
      tr.custom-exam
        th.state 状态
        th.calssName 课程名称
        th.time 考试时间
        th.during 时长(分钟)
        th.location 考试地点
        th.operations 操作
      tr.custom-exam(v-for='exam in exams')
        td
          input.state(:disabled='true' v-model='exam.state')
        td
          input.calssName( v-model='exam.calssName')
        td
          timestamp.time( v-model='exam.time')
        td
          input.during( v-model='exam.during')
        td
          input.location( v-model='exam.location')
        td.operations
            button.save( @click='saveAdmin()') 保存
            confirm-button.remove(@click='removeAdmin()' confirm-text='确定') 删除
      tr.admin.add
        td.state
        td
          input.calssName( v-model='newExam.calssName' placeholder='新增')
        td
          timestamp.time( v-model='newExam.time' )
        td
          input.during(v-model='newExam.during' placeholder='新增')
        td 
          input.location(v-model='newExam.location' placeholder='新增')
        td.operations
          confirm-button( confirm-text='确定新增') 新增考试安排 
      
</template>
<script>
import api from "@/api";
import timestamp from "@/components/TimestampPicker.vue";
import confirmButton from "@/components/ConfirmButton.vue";
import formatter from "@/util/formatter";

export default {
  components: {
    confirmButton,
    timestamp
  },
  data() {
    return {
      exams: [
        {
          state: "未到来",
          calssName: "小猴偷米能力测试",
          time: "2019/11/25 09:00",
          location: "计算楼156"
        },
        {
          state: "未到来",
          calssName: "小猴偷米能力测试",
          time: "2019/11/25 09:00",
          location: "计算楼156"
        }
      ],
      newExam: {},
      domains: []
    };
  },
  async created() {
    console.log(this.exams);
    console.log(this.domains);
    let adminObj = await api.get("/api/admin/admin");
    if (adminObj) {
      this.domains = Object.keys(adminObj)
        .filter(k => k !== "super")
        .map(k => {
          let domain = adminObj[k];
          domain.name = domain.domain;
          domain.domain = k;
          domain.admins = [];
          domain.newAdmin = { name: "", cardnum: "", phone: "" };
          api.get("/api/admin/admin", { domain: k }).then(k => {
            domain.admins = k.admins;
          });
          return domain;
        });
    }
  },
  methods: {
    ...formatter,
    async addAdmin(domain, admin) {
      await api.post("/api/admin/admin", { domain, admin });
      this.domains.find(k => k.domain === domain).admins = (await api.get(
        "/api/admin/admin",
        { domain }
      )).admins;
      admin.name = admin.phone = admin.cardnum = "";
    },
    async saveAdmin(domain, admin) {
      await api.put("/api/admin/admin", { domain, admin });
      this.domains.find(k => k.domain === domain).admins = (await api.get(
        "/api/admin/admin",
        { domain }
      )).admins;
    },
    async removeAdmin(domain, admin) {
      await api.delete("/api/admin/admin", { domain, cardnum: admin.cardnum });
      this.domains.find(k => k.domain === domain).admins = (await api.get(
        "/api/admin/admin",
        { domain }
      )).admins;
    }
  }
};
</script>
<style lang='stylus' scoped>
.summary {
  text-align: center;
  display: inline-block;
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0 5px 20px;
}

.state {
  text-align: center;
}

.operations {
  display: flex;
  flex-direction: row;
}

.list {
  width: 100%;
  text-align: center;
  border-collapse: collapse;

  th, td {
    line-height: 1.8em;
  }

  th {
    padding: 0 5px 5px 0;
  }

  td {
    padding: 5px 5px 0 0;
  }

  .custom-exam {
    font-size: 14px;
    color: var(--color-text-bold);

    input, button {
      padding: 3px 7px;
      border-radius: 3px;
      font-size: 13px;
    }

    input {
      width: 100%;
      color: var(--color-text-regular);

      &[disabled] {
        background: #fff;
        color: var(--color-text-bold);
      }
    }

    button {
      background: var(--color-primary-bg);
      color: #237a86;
      font-weight: bold;
      margin-right: 5px;
      cursor: pointer;

      &.remove {
        background: #ffedc1;
        color: #a4832d;
      }

      &.confirming {
        background: #ffd8c4;
        color: #6b402a;
      }
    }

    > * {
      flex: 1 1 auto;
      overflow: hidden;

      + * {
        margin-left: 10px;
      }
    }
  }
}
</style>
