<template>
  <div class='qiniu'>
    <input type='file' :ref='id' @change='upload'/>
    <div class='mask'>
      <div class='progress' :style='{ width: 100 - percentage && percentage + "%" }'></div>
      <p class='button' @click='$refs[id].click()' v-if='!percentage || percentage === 100'>{{ value ? '更改' : '上传' }}</p>
    </div>
  </div>
</template>
<script>
  import api from '@/api'
  import axios from 'axios'
  let id = 0

  export default {
    props: ['value'],
    data () {
      return {
        id: 'resource' + ++id,
        percentage: 100
      }
    },
    async created () {
    },
    methods: {
      async upload () {
        let { key, uptoken } = await api.get('/api/qiniu')
        let form = new FormData()
        form.append('key', key)
        form.append('token', uptoken)
        form.append('file', this.$refs[this.id].files[0])
        let { data } = await axios.post('https://up.qbox.me', form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: e => {
            this.percentage = Math.round((e.loaded * 100) / e.total) || 0
          },
          validateStatus: code => {
            if (code === 413) {
              this.$toasted.show('文件超过 1M，请使用图片处理工具压缩后再上传！')
              this.percentage = 0
            }
            return true
          }
        })
        this.$emit('input', data.url)
      }
    }
  }
</script>
<style scoped>
  .qiniu {
    position: relative;
  }

  .qiniu input {
    display: none !important;
  }

  .qiniu .mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .qiniu .progress {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 2px;
    background: var(--color-primary);
    transition: .3s;
  }

  .qiniu .button {
    background: var(--color-primary);
    border-radius: 5px;
    color: var(--color-primary-bg);
    padding: 1px 7px;
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
    transition: .3s;
  }

  .qiniu .button:active {
    background: var(--color-primary-dark);
  }
</style>
