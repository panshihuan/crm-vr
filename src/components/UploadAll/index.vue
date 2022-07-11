<template>
  <div class="uploadall">
    <el-upload
      ref="refUpload"
      class="upload-demo"
      v-loading="loading"
      drag
      :action="urlBase"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :http-request="httpCustom"
      :list-type="listType"
      v-bind="{...resProps}"
      :limit="limit"
      :class="{hideUp:resProps.hideUpBtn}"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text" v-html="uploadText?uploadText:'将文件拖到此处，或<em>点击上传</em>'"></div>
      <!--            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>-->
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import { uploadFile } from '@/api/fiveVR'
  import { compress } from '@/utils/fileCompress'

    const imgFormat = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'bmp', 'tiff', 'webp', 'eps', 'psd']

    export default {
        name: 'UploadAll',
        props: {
            value: {
                type: Array,
                default: () => {
                  return []
                }
            },
            maxFile: {
                type: [Number, String],
                default: () => {
                  return 20
                }
            },
            uploadUrl: {
                type: String,
                default: () => {
                  return '/task/uploadFile'
                }
            },
            resProps:{
                type: Object,
                default: () => {
                    return  {}
                }
            },
            uploadText:{
                type:String,
                default:''
            },
            limit:{
                type: [String, Number],
                default: 1
            },
            listType:{
                type: String,
                default: 'picture'
            }
        },
        data() {
            return {
                loading: false,
                hackReset: false,
                dialogVisible: false,
                dialogImageUrl: '',
                urlList: [],
                dataObj: { token: '', key: '' },
                
            }
        },
        computed: {
            urlBase() {
                return process.env.VUE_APP_BASE_API + this.uploadUrl
            },
            fileList() {
                this.urlList = this.value
                return this.value
            }
        },
        created() {
        },
        beforeUpdate() {
        },
        methods: {
            handleSuccess(response) {
            },
            handlePreview(v) {
                const arr = v.url.split('.')
                const data = arr[arr.length - 1]
                if (imgFormat.includes(data.toLowerCase())) {
                    this.dialogImageUrl = v.url
                    this.dialogVisible = true
                } else {
                    this.downExcel(v)
                }
            },
            downExcel(v) {
                const aLink = document.createElement('a')
                aLink.href = v.url
                aLink.download = v.name
                aLink.target = '_blank'
                aLink.click()
            },
            handleRemove(v) {
                this.urlList.map((item, index) => {
                    if (item.uid === v.uid) {
                        this.urlList.splice(index, 1)
                    }
                })
                this.emitInput(this.urlList)
            },
            emitInput(val) {
                this.$emit('input', val)
                this.$emit('change', this.urlList)
            },
            beforeUpload(file) {
                const isLt1M = file.size / 1024 / 1024 < +this.maxFile
                if (!isLt1M) {
                    this.$message.error(`上传文件大小不能超过 ${this.maxFile}MB!`)
                }
                return isLt1M
            },
            httpCustom(item) {
                this.loading = true
                const arr = item.file.name.split('.')
                const data = arr[arr.length - 1]
                compress(item.file, (file) => {
                    uploadFile({ file }, this.uploadUrl).then(res => {
                        this.urlList.push(res)
                        this.emitInput(this.urlList)
                        this.loading = false
                    }).catch(() => {
                        this.loading = false
                    })
                }, {isCompress: imgFormat.includes(data.toLowerCase())})
            },
        }
    }
</script>
<style>
    .el-upload-list__item-name{
        color: #d57cc6;
    }
</style>
<style lang="scss">
  @import "index.scss";
</style>

<style lang="scss" scoped>
.hideUp{
    >>>{
        .el-upload-dragger{
            display: none;
        }
    }
}
</style>
