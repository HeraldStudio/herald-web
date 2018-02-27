<template>
  <datetime v-model='date' @input='change()'
    :format='format' type='datetime'
    :phrases='{ ok: "确定", cancel: "取消" }'
    :minute-step='5' :auto='true'/>
</template>
<script>
  import { Datetime } from 'vue-datetime'
  import 'vue-datetime/dist/vue-datetime.css'

  export default {
    components: {
      datetime: Datetime
    },
    props: {
      value: Number
    },
    data () {
      return {
        date: new Date().toString(),
        format: {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        }
      }
    },
    created () {
      if (this.value) {
        this.date = new Date(this.value).toISOString()
      }
    },
    watch: {
      value () {
        if (this.value) {
          this.date = new Date(this.value).toISOString()
        }
      }
    },
    methods: {
      change() {
        this.$emit('input', new Date(this.date).getTime())
      }
    }
  }
</script>
<style>
  .vdatetime-input {
    cursor: pointer;
  }

  .vdatetime-popup {
    border-radius: 5px;
    overflow: hidden;
  }

  .vdatetime-calendar__month {
    text-align: left;
  }

  .vdatetime-calendar__month__day > span > span,
  .vdatetime-calendar__month__day:hover > span > span,
  .vdatetime-calendar__month__day--selected > span > span,
  .vdatetime-calendar__month__day--selected:hover > span > span {
    font-weight: normal;
  }

  .vdatetime-popup__header,
  .vdatetime-calendar__month__day--selected > span > span,
  .vdatetime-calendar__month__day--selected:hover > span > span {
    background: var(--theme-color);
  }

  .vdatetime-time-picker__item--selected,
  .vdatetime-popup__actions__button {
    color: var(--theme-color);
  }

  .vdatetime-time-picker__item:hover,
  .vdatetime-time-picker__item--selected,
  .vdatetime-time-picker__item--selected:hover {
    font-size: 20px;
  }
</style>
