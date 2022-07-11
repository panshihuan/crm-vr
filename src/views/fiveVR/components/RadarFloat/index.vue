<template>
  <div class="popWrap" :style="style" @click="popIt">
    <i class="dot"></i>
    <i class="line1"></i>
    <i class="line2"></i>
    <p class="tit1">
      <span> <label style="color: #d9b507;">雷达点：</label> {{info.desc}}</span>
      <!-- <i class="iconfont">&#xe748;</i> -->
    </p>
  </div>
</template>

<script>
import * as THREE from "three";
import { cameraToVec3, calcCenterPoint } from "../../assets/js/tools";
// import { Live } from "../../assets/js/liveCreate.js"

export default {
    name: 'RadarFloat',
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
             const points = this.info.extra.info.points
            const {x,y,z} = calcCenterPoint(points)
            const position = [x,y,z]
            let vec3 = new THREE.Vector3(...position);
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
            let info = this.info.extra
            let currentState = this.five.getCurrentState();
            if (info.type == 4 || info.type == 1 || info.type == 2 || info.type == 3 || info.type == 5) {
                let centerPoint = ''
                if (info.info.points?.length) {
                    centerPoint = calcCenterPoint(info.info.points)
                } else {
                    const [x,y,z] = info.position
                    centerPoint = {x,y,z}
                }
                setTimeout(() => {
                    centerPoint && cameraToVec3([centerPoint.x, centerPoint.y, centerPoint.z], this.five);
                }, 3000)
                // this.$bus.$emit('clickEditPoint', {type: info.type, index, info: this.info})
                if (currentState.panoIndex == info.info.panoIndex) {
                    // initCss3d();
                }
                else {
                    this.five.once("panoArrived", () => {
                        // initCss3d();
                    })
                    this.five.moveToPano(info.info.panoIndex)
                }
            }
        },
    }
}
</script>


<style lang="scss" scoped>
    @import './index.scss'
</style>