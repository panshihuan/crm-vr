<template>
    <div class="html__img">
      <el-radio-group v-model="tabPosition" style="margin-bottom: 10px;">
        <el-radio-button label="click">系统截图</el-radio-button>
        <el-radio-button label="file">上传截图</el-radio-button>
      </el-radio-group>
      <section v-if="tabPosition === 'click'">
        <el-button type="success" plain size="mini" :loading="loading" @click="doScreen">点击截图</el-button>
        <div class="htmltoimg__div" v-if="url">
          <div class="htmltoimg__del">
            <i class="el-icon-circle-close" style="color: red;font-size: 22px;cursor: pointer;" @click="handleDel"></i>
          </div>
          <el-image
              style="width: 100px; height: 100px"
              :src="url" 
              :preview-src-list="srcList"
            >
          </el-image>
        </div>
      </section>
      <section v-if="tabPosition === 'file'">
        <UploadAll
            v-model="files"
            :uploadUrl="uploadUrl"
            uploadText="上传文件"
            maxFile=200
            @change="changeFile"
        />
      </section>
    </div>
</template>

<script>

import html2canvas from 'html2canvas'
import { uploadFile, uploadUrl } from '@/api/fiveVR'
import UploadAll from "@/components/UploadAll/index";
import { compress } from '@/utils/fileCompress'

export default {
  name: 'HtmlToImg',
  components: {
      UploadAll,
  },
  props: {
    five: {
        type: [Object, Array],
    },
    uploadUrl: {
        type: String,
        default: () => {
          return uploadUrl
        }
    },
    initData: {
        type: [Object, Array],
    },
    showText: {
        type: Boolean,
        default: false
    },
  },
  data() {
    return {
      url: '',
      url64: '',
      srcList: [],
      loading: false,
      panoIndex: '',
      tabPosition: 'click',
      files: [],
    }
  },
  computed: {
  },
  watch: {
    initData: {
      handler(val, oldVal){
        this.tabPosition = val?.fileType || 'click'
        if (val?.fileType === 'click') {
          this.initClickData(val?.url || '')
        } else if (val?.fileType === 'file') {
          this.initFileData(val?.url || '')
        } else {
          this.initClickData(val?.url || '')
        }
      },
      deep: true,
    },
    showText() {
      const val = this.initData
        this.tabPosition = val?.fileType || 'click'
        if (val?.fileType === 'click') {
          this.initClickData(val?.url || '')
        } else if (val?.fileType === 'file') {
          this.initFileData(val?.url || '')
        } else {
          this.initClickData(val?.url || '')
        }
    }
  },
  mounted() {
  },
  methods: {
    initFileData(url) {
      this.files = url ? [{url}] : []
    },
    initClickData(url) {
      this.url = url
      this.srcList = [url]
    },
    doScreen() {
        const self = this
        const ref = document.getElementById('appCVS') // 截图区域
        this.emitShowSnapshootStart()
        setTimeout(() => {
          html2canvas(ref, {
              backgroundColor: '#fff',
              color: '#333',
              width: ref.offsetWidth,
              height: ref.offsetHeight - 60,
              // windowHeight: ref.offsetHeight,
              // y: window.pageYOffset,
              scale: 1
          }).then((canvas) => {
            
              // canvas转换成base64
              const dataURL = canvas.toDataURL('image/png')
              const imgUri = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')

              //  canvas转换成file格式
              const fileName = 'screenshot.png'
              var arr = dataURL.split(','),
                  mime = arr[0].match(/:(.*?);/)[1],
                  bstr = atob(arr[1]),
                  n = bstr.length,
                  u8arr = new Uint8Array(n);
              while (n--) {
                  u8arr[n] = bstr.charCodeAt(n);
              }
              var file = new File([u8arr], fileName, {type: mime});

              this.loading = true
              compress(file, (newFile) => {
                uploadFile({ file: newFile }, this.uploadUrl).then(res => {
                    this.url64 = res.url
                    this.url = res.url
                    this.srcList = [res.url]
                    this.loading = false
                    this.files = []
                    this.emitUrl()
                }).catch(() => {
                    this.loading = false
                    this.emitShowSnapshootEnd()
                })
              })
          })
        }, 300)
    },
    handleDel() {
      this.url = ''
      this.url64 = ''
      this.srcList = []
      this.emitUrl()
    },
    emitUrl() {
      this.$emit('change', { fileType: this.tabPosition, url: this.url, state: this.five.state })
      this.emitShowSnapshootEnd()
    },
    changeFile(val) {
      this.url = ''
      this.srcList = []
      this.$emit('change', { fileType: this.tabPosition, url: val[0]?.url || '', state: this.five.state })
    },
    emitShowSnapshootStart() {
      this.five.scene.children.map(item => {
        item.visible = false
      })
      this.five.refresh()
      this.$bus.$emit('emitShowSnapshoot', false)
    },
    emitShowSnapshootEnd() {
      setTimeout(() => {
        this.five.scene.children.map(item => {
          item.visible = true
        })
        this.five.refresh()
      }, 300)
      this.$bus.$emit('emitShowSnapshoot', true)
    },
  }
}
</script>

<style scoped lang="scss">
.htmltoimg{
  &__img{
    width: 200px;
    cursor: pointer;
  }
  &__div{
    margin-top: 20px;
    position: relative;
    width: 100px;
  }
  &__del{
    position: absolute;
    right: -10px;
    top: -10px;
    width: 20px;
    height: 20px;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.html__img{
  background: #ffce75;
  padding: 15px;
  border-radius: 14px;
}
  
</style>
