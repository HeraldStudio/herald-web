<template lang="pug">

  .page(v-if='pe')
    .info-bar
      button.info
        .title 跑操次数
        .content {{ pe.count }}
      button.info
        .title 剩余次数
        .content {{ Math.max(0, 45 - pe.count) }}
      button.info
        .title 剩余天数
        .content {{ pe.remainDays }}
    ul.pe-list
      Calendar.calendar(
        ref="Calendar" 
        :markDate="pe.detail"
        :sundayStart="true"
        :textTop="['日','一','二','三','四','五','六']"
        :markDateMore="RestDays"
        )
    ul.detail-list
      li(v-for='item in pe.health')
        .top
          .left {{ item.name }}
          //- 有等级的时候显示分数，这样最符合数据实际情况
          .right(v-if='item.grade') {{ item.score }} 分
        .bottom
          .left {{ item.value }}
          .right {{ item.grade }}

</template>
<script>
import api from "@/api";
import Calendar from "vue-calendar-component";
import moment from "moment";
import formatter from "@/util/formatter";
export default {
  components: { Calendar },
  data() {
    return {
      pe: null,
      curDate: 0,
      RestDays: []
    };
  },
  persist: {
    pe: "herald-default-pe"
  },
  async created() {
    this.curDate = new Date().getTime();
    this.pe = await api.get("/api/pe");
    this.pe.detail = this.pe.detail.map(Element => {
      return moment(Element).format("YYYY/M/D");
    });

    // 获取当月的休息日
    let now = new Date();
    let daysNumber = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();
    let firstDay = moment(new Date(now.getFullYear(), now.getMonth(), 0));
    let RestDay = [];
    for (let i = 0; i < daysNumber; i++) {
      firstDay.add(1, "days");
      if (firstDay.day() === 0 || firstDay.day() === 6) {
        this.RestDays.push({
          date: firstDay.format("YYYY/M/D"),
          className: "restDay"
        });
      }
    }

    if (this.pe && this.pe.detail.length) {
      this.curDate = this.pe.detail.slice(-1)[0];
    }
  },
  computed: {
    // curWeek() {
    //   let baseDay = new Date(1970, 0, 4);
    //   let delta = this.curDate - baseDay;
    //   let spare = delta % (1000 * 60 * 60 * 24 * 7);
    //   let firstDay = new Date(baseDay.getTime() + delta - spare);
    //   return [0, 1, 2, 3, 4, 5, 6].map(i => {
    //     let date = new Date(firstDay.getTime() + i * 1000 * 60 * 60 * 24);
    //     let exercises = this.pe.detail.filter(k => {
    //       let d = new Date(k);
    //       return (
    //         d.getFullYear() === date.getFullYear() &&
    //         d.getMonth() === date.getMonth() &&
    //         d.getDate() === date.getDate()
    //       );
    //     });
    //     let hasExercise = !!exercises.length;
    //     return {
    //       date,
    //       hasExercise,
    //       exercises
    //     };
    //   });
    // }
  },
  methods: {
    prevWeek() {
      this.curDate -= 1000 * 60 * 60 * 24 * 7;
    },
    nextWeek() {
      this.curDate += 1000 * 60 * 60 * 24 * 7;
    },
    getRestDay() {
      let now = new Date();
      let daysNumber = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      ).getDate();
      let firstDay = moment(new Date(now.getFullYear(), now.getMonth(), 0));
      let RestDay = [];
      for (let i = 0; i < daysNumber; i++) {
        firstDay.add(1, "days");
        if (firstDay.day() === 0 || firstDay.day() === 6) {
          RestDay.push({
            date: firstDay.format("YYYY/M/D"),
            className: "restDay"
          });
        }
      }
      return RestDay;
    }
  }
};
</script>
<style lang="stylus" scoped>
ul.pe-list {
  color: black;
  width: 100%;
  margin: 15px 0;
  padding: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  border-top: 0.5px solid var(--color-divider);
  border-bottom: 0.5px solid var(--color-divider);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  li + li {
    margin-left: 10px;
  }

  li {
    list-style: none;
    flex: 1 1 0;
    padding: 20px 0;

    .btn {
      cursor: pointer;
      color: #ccc;
      font-size: 16px;
      font-weight: bold;
    }

    .date {
      background: var(--color-tool-bg);
      color: var(--color-text-regular);
      padding: 3px 0;
      text-align: center;
      font-size: 14px;

      span.month {
        font-size: 10px;
        color: #aaa;
      }

      &.highlight {
        background: var(--color-primary-bg);
        color: var(--color-primary-dark);
      }
    }
  }

  .wh_container >>> .wh_content_all {
    background-color: #ffffff !important;
    border-bottom: 0.25px solid var(--color-divider);
  }

  .wh_container {
    margin: 0px !important;
  }

  .wh_container >>> .wh_item_date {
    color: #211d48;
  }

  .wh_container >>> .wh_item_date:hover {
    background-color: white;
    color: #211D48;
  }

  .wh_container >>> .wh_other_dayhide {
    color: #cccccc;
  }

  .wh_container >>> .wh_content_item {
    margin-bottom: 5px;
    margin-top: 5px;
  }

  .wh_container >>> .wh_item_date {
    cursor: default;
  }

  .wh_container >>> .wh_content {
    color: black;
  }

  .wh_container >>> .wh_top_tag {
    color: black;
  }

  .wh_container >>> .wh_content_li {
    color: #162947;
    font-weight: bold;
  }

  .wh_container >>> .wh_jiantou1 {
    border-top: 2px solid #162947;
    border-left: 2px solid #162947;
  }

  .wh_container >>> .wh_jiantou2 {
    border-top: 2px solid #162947;
    border-right: 2px solid #162947;
  }

  .wh_container >>> .wh_content_item>.wh_isMark {
    cursor: default;
    background-color: #00A4CA;
    color: white;
  }

  .wh_container >>> .wh_content_item .wh_isToday {
    cursor: default;
    background-color: white;
    color: #211D48;
  }

  .wh_container >>> .wh_content_item .wh_chose_day {
    cursor: default;
    background-color: white;
    color: #211D48;
  }

  .wh_container >>> .wh_content_item .restDay {
    cursor: default;
    background-color: white;
    color: #cccccc;
  }
}
</style>