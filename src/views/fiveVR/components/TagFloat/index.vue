<template>
  <div class="popWrap" :style="style" @click="popIt">
    <i class="dot"></i>
    <i class="line1"></i>
    <i class="line2"></i>
    <p class="tit1" v-if="info.type == 'normal'">
      <span v-html="info.name"></span>
      <i class="iconfont">&#xe748;</i>
    </p>
    <div class="tit1" v-if="info.type == 'media'">
      <span
        class="face flexCenter"
        :style="{ backgroundImage: `url(${info.media_data[0].src})` }"
      >
        <i v-if="info.media_data[0].type == 'video'" class="iconfont icon flexCenter">&#xe6a4;</i>
      </span>
    </div>
    <p class="tit2" v-if="info.type != 'normal'">
      <span v-html="info.name"></span>
      <i class="iconfont">&#xe748;</i>
    </p>
  </div>
</template>

<script>
import * as THREE from "three";
import { cameraToVec3 } from "../../assets/js/tools"
// import { Live } from "../../assets/js/liveCreate.js"

export default {
    name: 'FiveVR',
    components: {
        
    },
    props: {
        info: {
            type: Object
        },
        five:{
            type: [Object, Array]
        },
    },
    data() {
        return {
            liveSyncEvent: null,
            style: {
                left: 0,
                top: 0,
                display: "none",
            }
        }
    },
    created() {
        setTimeout(() => {
            this.syncTagPosStyle(this.five.state);
        }, 1000);
        this.five.on("currentStateChange", (state) => {
            this.syncTagPosStyle(state);
        });
    },
    methods: {
        syncTagPosStyle(state){
            let vec3 = new THREE.Vector3(...this.info.position);
            let scrPos = this.five.project2d(vec3, true);
            if (scrPos) {
                // 计算当前位置与标签坐标间距离
                let distance = state.offset.distanceTo(vec3);
                if (distance < 5) {
                    this.style.display = scrPos.x == 0 && scrPos.y === 0 ? "none" : "block";
                    this.style.left = scrPos.x + "px";
                    this.style.top = scrPos.y + "px";
                } else {
                    this.style.display = "none";
                }
            } else {
                this.style.display = "none";
            }
        },
        popIt(){
            cameraToVec3(this.info.position, this.five)
            this.$bus.$emit('handleTagFloat', this.info)
        },
    }
}
</script>


<style lang="scss" scoped>
    @import './index.scss'
</style>