<!--
 * @Descripttion:
 * @Date: 2020-09-04 09:12:53
 * @LastEditors: thh
 * @LastEditTime: 2020-09-07 11:59:50
 * @FilePath: \crm-mobile\src\views\empty\down.vue
-->
<template>
  <div class="down">
    <div class="down__title" @click="handleDown">
        LA手机端App下载
    </div>
    <div class="down__btn" @click="handleDown">
        点击下载安装包
    </div>
    <div class="down__version">
        <label>版本: </label>
        <span>{{info.version}}</span>
    </div>
  </div>
</template>

<script>
import { getVersion } from '@/api/common'
export default {
    name: 'Down',
    components: {
    },
    data() {
        return {
            info: {}
        }
    },
    created() {
        this.getVersion()
    },
    methods: {
      getVersion() {
          getVersion().then(res => {
              this.info = res
          })
      },
      handleDown() {
          this.download(`安卓v${this.info.version}.apk`, this.info.downloadLink)
      },
      download(name,url){
        const ele = document.createElement('a');
        ele.setAttribute('href', url);
        ele.setAttribute('download',name);
        ele.style.display = 'none';
        document.body.appendChild(ele);
        ele.click();
        document.body.removeChild(ele);
     },
    }
}
</script>
<style lang="scss" scoped>
    .down{
        padding: 30px;
        &__title{
            text-align: center;
            font-size: 18px;
            font-weight: 700;
        }
        &__btn{
            margin: 20px 0;
            text-align: center;
            color: #6ca80f;
        }
        &__version{
            font-size: 13px;
            text-align: center;
        }
     }
</style>
