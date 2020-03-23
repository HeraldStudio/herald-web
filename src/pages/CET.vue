<template lang="pug">
  .page.cet
    a.hint CET 考试助手会将你的考试信息存储在小猴偷米的数据库中，便于随时查看与更改
    a.hintTip 妈妈再也不会担心我忘记准考证啦～φ(≧ω≦*)♪
    div.crad
      a.subtitle 准考证号:
      input(v-model='cetform.examCode')
    div.location
      a.subtitle 考试地点:
      input(v-model='cetform.location')
    div.time
      a.subtitle 时间:
      timestamp.timestamp(v-model='cetform.examTime' :useType='useType' :showType='showType')
      a.ddlTip(v-if='cetform.examTime') {{ displayTip }}
    a.display
    button(@click='save()') {{this.loading ? '...' : '保存'}}
</template>
<script>

  import api from '@/api'
  import formatter from '../util/formatter'
  import timestamp from '@/components/TimestampPicker.vue'
  import moment from 'moment'

  export default {
    components: {
      timestamp
    },
    data() {
      return {
        useType: 'datetime',
        showType: 'datetime',
        loading: false,
        cetform:{
          examCode:'',
          location:'',
          examTime:''
        }
      }
    },
    persist: {
      cet: 'herald-default-cet'
    },
    async created() {
      const res = await api.get('/api/cet')
      this.cetform = res 
    },
    methods:{
      ...formatter,
      async save(){
        this.loading = true
        await api.post('api/cet',this.cetform);
        this.loading = false
      }
    },
    computed:{
      displayTip:function(){
        let now = +moment()
        let days = this.cetform.examTime < now ? 0 : Math.ceil((this.cetform.examTime - now) / (24*60*60*1000))
        if(days === 0){
          return '考试结束了，让自己放松一下吧～'
        }else if(days ===1){
          return '今天就要考试了，加油哦！'
        }else{
          return `距离考试还有${days}天`
        }
      }
    }
  }

</script>
<style lang="less" scoped>
.cet{
  display: flex;
  flex-direction: column;
  .hint{
    font-family: -apple-system, BlinkMacSystemFont, 'Noble Scarlet', 'PingFang SC', 'Noto Sans CJK SC', 'Source Han Sans CN', 'Microsoft YaHei UI', sans-serif;
    font-size: 16px;
    text-align: center;
    color: #555555;
    margin-bottom: 5px;
  }
  .hintTip{
    font-family: -apple-system, BlinkMacSystemFont, 'Noble Scarlet', 'PingFang SC', 'Noto Sans CJK SC', 'Source Han Sans CN', 'Microsoft YaHei UI', sans-serif;
    font-size: 13px;
    text-align: center;
    color: #888888;
    margin-bottom: 30px;
  }
  .crad{
    margin-top: 5px;
    margin-bottom: 15px;
    display: flex;
    flex-direction: row;
    .subtitle { 
      width: 70px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    input{
      flex: 1;
    }
  }
  .location{
    margin-top: 5px;
    margin-bottom: 15px;
    display: flex;
    flex-direction: row;
    .subtitle { 
      width: 70px;
      display: flex;
      flex-direction: column;
      justify-content: center; 
    }
    input{
      flex: 1
    }
  }
  .time{
    margin-top: 5px;
    margin-bottom: 15px;
    height: 30px;
    display: flex;
    flex-direction: row;
    .subtitle { 
      width: 70px; 
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .timestamp{
      flex: 1;
    }
    .ddlTip{
      flex: 1;
      color: #888888;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
  
  
  button{
    margin-top: 25px;
    height: 30px;
  }
}
</style>
