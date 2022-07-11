
<template>
<!-- 单个取点组件 -->
    <div class="vr__axis">
        <div style="margin-bottom: 12px;">
            <label>开始取点: </label>
            <el-switch
                v-model="isPoint"
                active-color="#13ce66"
                @change="changePoint"
            >
            </el-switch>
            <el-button type="danger" style="margin-left: 20px;" :disabled="!div" size="mini" @click="handleRefresh">清除</el-button>
        </div>
        <section class="vr__axis__section">
            <label>x：</label>
            <el-input
                v-model="axis.x"
                size="small"
                type="number"
                step=0.01
                @input="changeAxis(axis)"
            ></el-input>
        </section>
        <section class="vr__axis__section">
            <label>y：</label>
            <el-input
                size="small"
                v-model="axis.y"
                type="number"
                step=0.01
                @input="changeAxis(axis)"
            ></el-input>
        </section>
        <section class="vr__axis__section">
            <label>z：</label>
            <el-input
                size="small"
                v-model="axis.z"
                type="number"
                step=0.01
                @input="changeAxis(axis)"
            ></el-input>
        </section>
    </div>
</template>

<script>
// 基础设置
import { GET_WORK_BY_CODE } from "@/api/fiveVR";
import * as THREE from "three";

let app = null;

export default {
    name: "AxisPoint",
    components: {},
    props: {
        five: {
            type: [Object, Array],
        },
        initAxis: {
            type: [Object, Array]
        },
        pointType: {
            type: [String],
            default: 'default'
        },
        labelText: {
            type: [String],
            default: '标签位置'
        },
        showDetail: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            isPoint: false,
            axis: {
                x: "",
                y: "",
                z: "",
            },
            newTag: null, // 当前tag
            tags: null, // 保存tag，1个
            tagToElement: new WeakMap(),
            div: null,
            panoIndex: null,
        };
    },
    watch: {
        initAxis(val) {
            if (!val) {
                this.axis = {
                    x: "",
                    y: "",
                    z: ""
                }
                return
            }
            this.axis = val
            // this.tags = {label: this.labelText, position: new THREE.Vector3(+val.x,+val.y,+val.z)}
            // this.startPoint()
        },
        showDetail(val) {
            if (!val) {
                this.axis = {
                    x: "",
                    y: "",
                    z: ""
                }
                this.isPoint = false
            }
        }
    },
    created() {
        // this.panoIndex = this.five.state.panoIndex
        // this.five.on("panoArrived", (panoIndex) => {
        //     this.panoIndex = panoIndex
        // });
        this.$bus.$on('refreshTagItem', () => {
            this.handleRefresh()
        })
        this.$bus.$on('emitShowSnapshoot', val => {
            if (this.div) {
                this.div.style.display = val ? '': 'none'
            }
        })
    },
    mounted() {
        this.$nextTick(() => {
            app = document.querySelector("#appCVS")
            this.five.on("intersectionOnModelUpdate", intersect => {
                if (this.newTag && this.isPoint) {
                    this.newTag.position = intersect.point;
                    this.renderTags();
                }
            });
            this.five.on("wantsTapGesture", (raycaster) => {
                if (this.newTag) {
                    const [intersect] = this.five.model.intersectRaycaster(raycaster);
                    if (intersect) {
                        const { x, y, z } = intersect.point;
                        this.axis = {x,y,z}
                        this.changePointEmit()
                    }
                    if (this.newTag && this.newTag.position) {
                        this.tags = this.newTag;
                        this.renderTags();
                        this.isPoint = false
                        this.newTag = null
                    }
                    return false;
                }
            });
            this.five.on("cameraUpdate", this.renderTags);
        })
    },
    methods: {
        createTagElement(tag){
            const div = document.createElement("div");
            div.className = "tag";
            div.style.display = "none";
            if (this.pointType === 'finger') {
                div.innerHTML = `<div class="tag-finger"></div>`;
            } else if (this.pointType === 'fly') {
                div.innerHTML = `<div class="tag-pannel" style='border-radius: 10px;'>${this.fly ? '<i class="el-icon-s-promotion" style="padding-right:5px;"></i>': ''}<span class="tag-content">${tag.label}</span></div>`;
            } else {
                div.innerHTML = `<div class="tag-pannel"><span class="tag-content">${tag.label}</span></div>`;
            }
             
            this.div = div
            app.appendChild(div);
            return div;
        },
        renderTags(){
            const tag = this.tags || this.newTag
            const element = this.tagToElement.get(tag);
            if (tag && element) {
                const position = this.five.project2d(tag.position, true);
                if (position === null) {
                    element.style.display = "none";
                } else {
                    element.style.display = "";
                    element.style.left = position.x + "px";
                    element.style.top = position.y + "px";
                }
            }
        },
        changePoint(val) {
            if (val) {
                this.startPoint()
            }
        },
        changeAxis: _.throttle(function(val) {
            if (!this.tags) {
                return
            }
            this.$set(this.tags, 'position', new THREE.Vector3(+val.x,+val.y,+val.z))
            this.renderTags()
            const { x, y, z } = val;
            this.changePointEmit()
        }, 1000),
        changePointEmit() {
            let axis = _.cloneDeep(this.axis)
            axis = {
                x: +axis.x,
                y: +axis.y,
                z: +axis.z,
            }
            this.$emit('changePoint', axis, this.five.state.panoIndex)
        },
        handleRefresh() {
            this.tags = null;
            this.newTag = null;
            if (this.div) {
                app.removeChild(this.div)
            }
            this.div = null
            this.isPoint = false
            this.axis = {
                x: "",
                y: "",
                z: ""
            }
        },
        startPoint(){
            this.$bus.$emit('closeRectangle')
            if (this.tags || this.newTag) {
                this.newTag = this.tags
                return
            }
            this.newTag = { label: this.labelText };
            this.tagToElement.set(this.newTag, this.createTagElement(this.newTag));
        },
    },
};
</script>

<style>
.el-input-number--small {
    width: 100%;
}
</style>

<style scoped lang="scss">
.vr__axis {
    padding: 20px 10px;
    border: 1px solid #999;
    border-radius: 8px;
    &__section {
        display: flex;
        align-items: center;
        margin-bottom: 7px;
    }
}
</style>
