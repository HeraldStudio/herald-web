<template lang="pug">
    .page.lost-and-found-list
      ul.info-bar
        button.info(:class='{ selected: column === "lost" }' @click="loadLost") 失物招领
        button.info(:class='{ selected: column === "found" }' @click="loadFound") 寻物启事
        button.info(:class='{ selected: column === "myself" }' @click="loadMyself") 我发布的
        button.info(v-if="isAdmin" :class='{ selected: column === "audit" }' @click="loadAudit") 发布审核
        button.info(class="selected" @click='publish') 我要发布
      .lf-list
        .lf-item
          .lf-title 捡到一个赵拯基
          .lf-desc 在计算机楼捡到一个光屁股的赵拯基
          
        
</template>

<script>
import api from '@/api'
import formatter from '@/util/formatter'
export default {
  data(){
    return {
      list:[],
      page:1,
      pagesize:10,
      column:'lost', // 'found' 'myself' 'audit'
      isAdmin:false,
      hasMore:true
    }
  },
  methods:{
    loadLost(){
      this.page = 1
      this.pagesize = 10
      this.column = 'lost'
      this.hasMore = true
      this.load()
    },
    loadFound(){
      this.page = 1
      this.pagesize = 10
      this.column = 'found'
      this.hasMore = true
      this.load()
    },
    loadMyself(){
      this.page = 1
      this.pagesize = 10
      this.column = 'myself'
      this.hasMore = true
      this.load()
    },
    loadAudit(){
      this.page = 1
      this.pagesize = 10
      this.column = 'audit'
      this.hasMore = true
      this.load()
    },
    async load(){
      let res = await api.get(`/api/lostAndFound?type=${this.column}&page=${this.page}&pagesize=${this.pagesize}`)
      if(res.length < this.pagesize){
        this.hasMore = false
      }
      this.list = res
    },
    async loadMore(){
      this.page = this.page + 1
      this.load()
    },
    publish(){
      this.$router.push({path:"/lost-and-found/publish"})
    }
  },
  async created(){
    // 检查是否管理员
    let res = await api.get(`/api/lostAndFound?type=audit&page=1&pagesize=10`)
    this.isAdmin = res.length > 0
    this.load()
  }

};
</script>

<style lang="less" scoped>
.lost-and-found {
  display: flex;
  flex-direction: column;
}
.list{
  flex-grow: 1;
  overflow: hidden;
}
</style>