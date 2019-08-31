<template lang="pug">

  .imgs
    .img(v-for="(image, index) in p_images")
      img(:src="image")
      .del.delete-button(@click="delImage(index)")
    .img.upload.add-icon(v-if="p_images.length < 3" onclick="document.getElementById('file').click()")
    input(id="file" type="file" accept="image/png, image/jpeg", @change="upload", style="display:none")
   
</template>
<script>
  import api from '../api'
  import axios from 'axios'
  import ImageCompressor from 'image-compressor.js'
  export default {
    props: {
      images: Array
    },
    data() {
      return {
        p_images: [],
        uploading: false
      }
    },
    created() {
      
    },
    watch: {
      images (images) {
        this.p_images = images
      },
      p_images (p_images) {
        this.$emit('change', p_images)
      }
    },
    methods: {
      async upload(event){
        if(this.uploading){
          this.$toasted.show("请等待图片上传完成")
          return
        }
        let file = event.target.files[0]
        if (!file) return
        //myseu.cn/ws3/api/qiniu
        file = await this.compressImage(file) // 压缩图像
        let cardnum = this.$store.state.user.cardnum
        let prefix = 'lf-'+cardnum
        let { domain, key, uptoken } = await api.get('/api/qiniu?prefix='+prefix)
        let param = new FormData()
        param.append('key', key)
        param.append('token', uptoken)
        param.append('file', file)
        console.log(key)
        console.log(uptoken)

        try{
          this.uploading = true
          let config = {
            headers:{'Content-Type':'multipart/form-data'}
          }
          let res = (await axios.post('https://upload.qiniup.com/', param, config)).data.url
          this.p_images.push(res)
          this.$toasted.show("图片上传成功")
        } catch(e) {
          this.$toasted.show("图片上传失败，请检查格式、大小")
        } finally {
          this.uploading = false
        }
      },
      delImage(index) {
        this.p_images = this.p_images.filter((k, i) => i !== index)
      },
      compressImage(image){
        return new Promise( (resolve,reject) => {
          console.log(`压缩前大小L：${image.size}`)
          new ImageCompressor(image, {
            mimeType:"image/jpeg",
            mode:'strict',
            toWidth:480,
            quality:0.8,
            success:(result) => {
              console.log(`压缩后大小：${result.size}`)
              resolve(result)
            }          
            })
        })
      }
    }
  }
  
</script>
<style lang="stylus" scoped>
.imgs {
  display: flex;
  flex-flow: row wrap;
  margin: 20px 0;

  .img {
    position: relative;
    width: 80px;
    height: 80px;
    background: #f7f7f7;
    object-fit: cover;
    margin: 0 5px 5px 0;

    img {
      width: 100%;
      height: 100%;
    }

    .del {
      position: absolute;
      top: 0;
      right: 0;
      width: 30px;
      height: 30px;
      font-size: 15px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      background-image: url('../../static/images/delete.svg');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 20px 20px;
      color: #fff;
    }

    &.upload {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      color: #ccc;
      overflow: hidden;
      line-height: inherit;
      border: 1px solid #f0f0f0;
      box-sizing: border-box;
    }
  }

  .add-icon {
    background-image: url('../../static/images/add.svg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 20px 20px;
  }
}
</style>