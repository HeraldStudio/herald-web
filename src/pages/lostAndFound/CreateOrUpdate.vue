<template lang="pug">
    .page.lost-and-found-publish
        .field 
            .text 发布类型
            select(v-model='type')
                option(value="") 请选择
                option(value="found") 失物招领
                option(value="lost") 寻物启事
        .hint-group(v-if="type === 'lost'")
            .hint 有物品不慎遗失？不要着急，小猴来帮你～
            .hint 请你在此处尽可能详细地填写关于物品以及遗失过程的信息，小猴会帮你向全体用户发布消息。
            .hint 同时，为了保护你的信息安全，<strong>请不要</strong>在此留下你的联系方式等个人信息内容，如果有热心同学捡到你遗失的物品，小猴将悄悄告诉你ta的联系方式。
        .hint-group(v-if="type === 'found'")
            .hint 捡到别人丢的东西了？小猴先给拾金不昧的你发一朵小红花！
            .hint 请你在此处尽可能详细地填写关于物品以及拾获过程的信息，小猴会帮你向全体用户发布消息，帮你尽快找到失主。
            .hint 同时，为了保护你的信息安全，<strong>请不要</strong>在此留下你的联系方式等个人信息内容，如果有失主来认领物品，小猴将悄悄告诉你ta的联系方式。
        .field(v-if="type")
            .text 物品名称
            input.input(v-model="title" placeholder="请直接填写物品的名称（例如：一卡通）")
        .field(v-if="type")
            .text 事件描述
            textarea(v-model="describe" placeholder='请尽量详细的在此处填写丢失/拾获物品的具体时间、地点，物品的特征等信息，便于其他拾获遗失物或者失主确认。')
        .field(v-if="type")
            .text 图片
            uploader(@change="imageChange")
        button(v-if="type" @click='save' :disabled='loading' style="height:30px;") 点击提交
            
        

</template>

<script>
import Uploader from '../../components/Uploader'
import api from '../../api'
export default {
    components:{
        'uploader':Uploader
    },
    data(){
        return {
            type:'',
            title:'',
            describe:'',
            imageUrl:'',
            id:'',
            loading:false
        }
    },
    methods:{
        imageChange(imageList){
            this.imageUrl = imageList.join('|')
        },
        async save(){
            this.$toasted.info("正在发布，请稍候")
            this.loading = true
            if(this.id){
                try{
                    this.loading = true
                    await api.put("/api/lostAndFound",{id:this.id, title:this.title, describe:this.describe, imageUrl:this.imageUrl})
                    this.$toasted.clear()
                    this.$toasted.show("修改成功！")
                    this.$router.go(-1)
                } catch(e) {
                    this.$toasted.clear()
                    this.$toasted.show(e.message)
                } finally {
                    this.loading = false
                }
            } else {
                // 保存过程
                try{
                    this.loading = true
                    await api.post("/api/lostAndFound",{type:this.type, title:this.title, describe:this.describe, imageUrl:this.imageUrl})
                    this.$toasted.clear()
                    this.$toasted.show("发布成功！")
                    this.$router.go(-1)
                } catch(e) {
                    this.$toasted.clear()
                    this.$toasted.show(e.message)
                } finally {
                    this.loading = false
                }
            }
        }
    },
    async created(){
        this.id = this.$route.params.id
        if(this.id){
            let res = await api.get('/api/lostAndFound?id='+this.id)
            this.type = res.type
            this.title = res.title
            this.describe = res.describe
        }
    }
}
</script>

<style lang="less" scoped>
.lost-and-found-publish{
    .field{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-top: 15px;
        .text{
            font-weight: bold;
        }
        select{
            height: 32px;
            border: none;
            background: var(--color-tool-bg);
            border-radius: 4px;
            margin-top: 10px;
            width: 100%;
        }
        textarea{
            height: 100px;
            border: none;
            background: var(--color-tool-bg);
            border-radius: 4px;
            margin-top: 10px;
            width: 100%;
        }
        .input{
            border-radius: 4px;
            height: 36px;
            flex-grow: 1;
            align-self: stretch;
            width:100%;
            margin-top:10px;
        }
    }
    .hint-group{
        margin-top: 15px;
    }
}
</style>