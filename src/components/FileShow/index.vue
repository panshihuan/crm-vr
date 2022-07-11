<template>
  <div class="fileshow">
    <template v-if="compList.imgList.length">
      <div class="fileshow__imgs">
        <section class="fileshow__img" v-for="(img, index) in compList.imgList" :key="'img' + index" @click="showDialog(img.url)">
          <img :src="img.url" alt="">
        </section>
      </div>
    </template>
    <template v-if="compList.fileList.length">
      <div class="fileshow__files">
        <section class="fileshow__file" v-for="(file, index) in compList.fileList" :key="'file' + index">
          <a :href="file.url" target="_blank">{{file.name || '文件'}}</a>
        </section>
      </div>
    </template>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>

    export default {
        name: 'FileShow',
        components: {},
        props: {
            list: {
                type: [Array, String]
            }
        },
        data() {
            return {
                dialogVisible: false,
                dialogImageUrl: ''
            }
        },
        computed: {
            compList: {
                get() {
                    return this.formatList()
                },
                set() {}
            }
        },
        created() {
        },
        methods: {
            showDialog(url) {
                this.dialogImageUrl = url
                this.dialogVisible = true
            },
            formatList() {
                const obj = {
                    imgList: [],
                    fileList: []
                }
                const imgFormat = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'bmp', 'tiff', 'webp', 'eps', 'psd']
                if (this.list && this.list.length) {
                  if (Array.isArray(this.list)) {
                    this.list.map(item => {
                        const data = item.name && item.name.split('.')[1]
                        if (item.name && data && imgFormat.includes(data.toLowerCase()) || imgFormat.includes(item.extension)) {
                            obj.imgList.push(item)
                        } else {
                            obj.fileList.push(item)
                        }
                    })
                  } else {
                    const arr = this.list.split('.')
                    const data = this.list && arr[arr.length - 1]
                    if (this.list && data && imgFormat.includes(data.toLowerCase())) {
                        obj.imgList.push({url:this.list})
                    } else {
                        obj.fileList.push({url:this.list})
                    }
                  }
                }
                return obj
            }
        }
    }
</script>

<style lang="scss">
  @import "index.scss";
</style>
