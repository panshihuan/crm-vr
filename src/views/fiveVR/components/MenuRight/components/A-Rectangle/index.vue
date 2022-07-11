<template>
<!-- 绘制矩形组件 -->
    <div class="vr__axis vr__cursor">
        <div style="margin-bottom: 12px;">
            <label>开始取点 
            <el-tooltip class="item" effect="dark" placement="top-end">
                <i class="el-icon-info" style="color: #000;cursor: pointer;padding-right: 5px;"></i>
                <div slot="content">
                    <div>步骤：</div>
                    <div>
                        1、取点：打开取点开关，在空间中选择需要贴内容的位置，<br/>依次点击左下、右上、右上、左上选定内容展示区
                    </div>
                    <div>
                        2、修改点位：选中每个点后可在空间中对该点位位置进行调整
                    </div>
                </div>
            </el-tooltip>: </label>
            <el-switch
                v-model="isPoint"
                active-color="#13ce66"
                @change="startPoint"
            >
            </el-switch>
            <el-button type="danger" style="margin-left: 20px;" :disabled="!div" size="mini" @click="clearAll">清除</el-button>
            <span v-if="isPoint && newTag" class="vr__axis__signal">{{newTag && newTag.label}}</span>
        </div>
        <div class="vr__axis__radio">
            <el-tooltip class="item" effect="dark" content="请按顺序取点：左下、右下、右上、左上" placement="top-end">
                <i class="el-icon-info" style="color: #000;cursor: pointer;margin-right:5px;"></i>
            </el-tooltip>
            <el-radio-group v-model="active" @change="changeRadio">
                <el-radio v-for="(item, index) in tags" :key="index+'radio'" :label="item.index">{{item.label}}</el-radio>
            </el-radio-group>
        </div>
        <section class="vr__axis__section">
            <label>x：</label>
            <el-input
                size="small"
                v-model="axis.x"
                type="number"
                step=0.01
                @input="changeAxis(axis)"
            >
            </el-input>
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
        <div v-if="rectangleType != 'link' && tags.length == 4" class="vr__cursor__slider-container">
            <section v-for="(item, index) in tags" :key="index+'slider'" class="vr__cursor__slider">
                <div v-if="index === active" class="vr__cursor__slider__color" :style="{background: getColor(index)}"></div>
                <el-slider v-if="index === active" v-model="sliderModel[index]" :max="max" :min="min" :step="step" show-input input-size="mini" @change="(val) => changeSlider(val, index)"></el-slider>
            </section>
        </div>
    </div>
</template>

<script>
import { } from "@/api/fiveVR";
import * as THREE from "three";
import Vue from 'vue'
import { ImgCmp } from './imgCmp'

const POINTCOLOR = {
    point1: '#b238f1',
    point2: '#0d9507',
    point3: '#b08f1c',
    point4: '#e54a23',
}

let app = null;

export default {
    name: "Rectangle",
    components: {},
    props: {
        five: {
            type: [Object, Array],
        },
        initRectangle: {
            type: [Object, Array]
        },
        type: {
           type: [Number, String], 
        },
        isImgCmp: {
            type: Boolean,
            default: false
        },
        showDetail: {
            type: Boolean,
            default: false
        },
        rectangleType: {
            type: String
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
            tags: [], // 保存tag，4个点
            tagToElement: new WeakMap(),
            div: null,
            panoIndex: null,
            destroy: null,
            active: '',
            nowPoint: null,
            isEdit: false, // 是否二次编辑某一个点
            fileUrl: '',
            isMove: false,
            imgCmp: null,
            max: 2,
            min: -1,
            step: 0.1,
            sliderModel: {},
            originalPoints: [], // 原始坐标点
            pointAxesList: [], // 辅助坐标轴
            gate: true
        };
    },
    watch: {
        initRectangle(val, oldVal) {
            if (!val) {
                this.tags = []
                return
            }
            this.initData(val)
        },
        showDetail(val) {
            if (!val) {
                this.active = ''
                this.isEdit = false
                this.clearSlider()
            }
        }
    },
    created() {
        this.$bus.$on('refreshTagItem', () => {
            this.isPoint = false
            this.clearAll()
        })
        this.$bus.$on('closeRectangle', () => {
            this.isPoint = false
        })
        this.$bus.$on('changeRectangleFile', url => {
            this.fileUrl = url
            this.clear3DDomContainer()
            this.create3DDomContainerRender(this.tags)
            this.five.refresh()
            setTimeout(() => {
                this.five.refresh()
            }, 500)
        })
    },
    mounted() {
        this.$nextTick(() => {
            this.imgCmp = new ImgCmp(this.five)
            app = document.querySelector("#appCVS")

            this.five.on("intersectionOnModelUpdate", intersect => {
                if (this.isPoint) {
                    this.nowPoint = intersect.point;
                    if (this.isMove) {
                        const { x, y, z } = intersect.point;
                        const newTagCopy = _.cloneDeep(this.newTag)
                        const tags = _.cloneDeep(this.tags)
                        newTagCopy.points = {x,y,z}
                        newTagCopy.position = this.nowPoint
                        tags[newTagCopy.index] = newTagCopy
                        this.clear3DDomContainer()
                        this.create3DDomContainerRender(tags, 'isIntersectionOnModelUpdate')
                    }
                }
            });

            this.five.on("wantsTapGesture", (raycaster) => {
                this.isMove = false
                if (!this.isPoint) {
                    return
                }
                if (!this.isEdit && this.tags.length < 4) {
                    this.addPoint()
                }
                if (!this.newTag) {
                    return
                }
                this.updatePoint()
                return false
            });

            this.five.on("cameraUpdate", this.renderTags);
        })
    },
    methods: {
        updatePoint(pointTh, isInputChange = false) {
                const pos = this.five.plugins.panoCursorRaycasterPlugin.intersection();
                if (!pos && !pointTh) {
                    return;
                }
                const point = pointTh || pos?.point
                if (this.isEdit) {
                    this.pointAxesList[this.active]?.clear()
                    const current = this.five.plugins.panoCursorRaycasterPlugin.pointAxesHelper(point);
                    this.pointAxesList[this.active] = current
                } else {
                    const current = this.five.plugins.panoCursorRaycasterPlugin.pointAxesHelper(point);
                    this.pointAxesList = [...this.pointAxesList, current]; // 保存辅助坐标轴
                }

                const { x, y, z } = point;
                if (!isInputChange) {
                    this.axis = {x,y,z}
                }
                this.newTag.points = this.axis
                this.newTag.position = pointTh || this.nowPoint

                if (this.newTag && this.newTag.position) {
                    if (this.tags && this.tags.length >= 4) {
                        this.$set(this.tags, this.newTag.index, this.newTag)
                    } else if (this.isEdit) {
                        this.$set(this.tags, this.newTag.index, this.newTag)
                    } else {
                        this.tags.push(this.newTag)
                    }
                    this.renderTags();
                    if (this.tags.length === 4) {
                        this.clear3DDomContainer()
                        this.create3DDomContainerRender(this.tags)
                        this.change3DDomEmit()
                        if (!pointTh) {
                            this.isPoint = false
                        }
                    }
                }
                this.originalPoints = _.cloneDeep(this.tags)
                if (!pointTh) {
                   this.newTag = null
                    this.isEdit = false
                    this.clearRadio()
                    this.clearSlider()     
                }
                return false;
        },
        getColor(index) {
            const key = `point${index+1}`
            return POINTCOLOR[key]
        },
        changeSlider: _.throttle(function(distance, index) {
            const point = this.originalPoints[index]
            const newPoint = this.five.plugins.panoCursorRaycasterPlugin.movePointTowardsCamera(point.position, distance)
            const { x, y, z } = newPoint;
            this.newTag = this.tags[index]
            this.axis = {x,y,z}
            this.$set(this.newTag, 'position', newPoint)
            this.$set(this.newTag, 'points', this.axis)
            this.$set(this.tags, this.newTag.index, this.newTag)
            this.renderTags()
            if (this.tags.length === 4) {
                this.clear3DDomContainer()
                this.create3DDomContainerRender(this.tags)
            }
            this.change3DDomEmit()
        }, 1000),
        createTagElement(tag){
            const div = document.createElement("div");
            div.className = "panoCursor";
            div.style.display = "none";
            const color = this.getColor(tag.index)
            div.innerHTML = `<div class="panoCursor-point" style="border-color: ${color}"></div>`;
            this.div = div
            app.appendChild(div);
            div.addEventListener('click', (evet) => {
                this.clickTag(tag)
            })
            return div;
        },
      
        renderTags(){
            for (const tag of [this.newTag, ...this.tags]) {
                if (!tag) continue;
                if (!tag.position) continue;
                const element = this.tagToElement.get(tag);
                if (!element) continue;
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
        create3DDomContainerRender(payload, isIntersectionOnModelUpdate, isEmit = false) {
            if (payload && payload.length && payload.length >= 4) {
                if (this.rectangleType == 'img') {
                    this.loadImgCpm(payload)
                } else if (this.rectangleType == 'link') {
                    const points = payload.map(item => item.points)
                    const css3DRender = this.five.plugins.css3DRender;
                    let { container, dispose } = css3DRender.create3DDomContainer(points);
                    this.destroy = dispose;
                    container.style.pointerEvents = 'all';
                    container.innerHTML = `<div style="border:1px solid #ddd;width:100%;height:100%;background-size:cover;background-color: #ddd;" ></div>`;
                    // container.innerHTML = `<div style="border:1px solid #ddd;width:100%;height:100%;"><iframe width="100%" height="100%" src="${this.fileUrl}" width="100%" height="100%" scrolling="no"><p>你的浏览器不支持iframe标签</p></iframe></div>`;
                    container.style.pointerEvents = "none";
                    this.five.refresh()
                    setTimeout(() => {
                        this.five.refresh()
                    }, 300)
                } else if (this.rectangleType == 'video') {
                    if (!isIntersectionOnModelUpdate) {
                        this.loadTV()
                    }
                }
                if (!isEmit) {
                    this.change3DDomEmit()
                }
            }
        },
        clear3DDomContainer() {
            this.destroy && this.destroy()
            this.imgCmp.remove()
        },
        loadImgCpm(payload) {
            const tags = payload.map(item => item.points)
            this.imgCmp.render(tags, this.fileUrl)
            this.five.refresh()
            setTimeout(() => {
                this.five.refresh()
            }, 300)
        },
        async loadTV() {
            const points = this.tags.map((item) => {
                const [x, y, z] = item.position.toArray();
                return { x, y, z };
            });
            let [a, b, c, d] = points;
            const data = {
                video_src: this.fileUrl || '//vrlab-public.ljcdn.com/release/web/videos/tv_ads/360/009.mp4',
                video_poster_src: "https://vrlab-public.ljcdn.com/release/web/videos/posters/002.9203cf99.jpg",
                points: [[d, a, b, c]],
            };

            if (this.gate) {
                this.gate = false
                this.five.plugins.modelTVVideoPlugin.disable();
                await this.five.plugins.modelTVVideoPlugin.load(data);
                this.five.plugins.modelTVVideoPlugin.enable();
                setTimeout(() => {
                    this.gate = true
                    this.five.refresh();
                }, 200)
            }
        },
        startPoint(val) { // 关闭取点
            if (!val) {
                this.clear3DDomContainer()
                this.create3DDomContainerRender(this.tags)
                this.isMove = false
                this.clearRadio()
                this.five.refresh()
                setTimeout(() => {
                    this.five.refresh()
                }, 200)
            } else {
                if (!this.fileUrl) {
                    if (this.rectangleType == 'img') {
                        this.$message.error('请先上传图片')
                        this.isPoint = false
                    } else if (this.rectangleType == 'video') {
                        this.$message.error('请先上传视频文件')
                        this.isPoint = false
                    }
                    return
                }
                if (this.tags.length >= 4) {
                    this.changeRadio(0)
                }
            }
        },
        changeAxis: _.throttle(function(val) {
            const point = new THREE.Vector3(+val.x,+val.y,+val.z)
            this.updatePoint(point, true)
        }, 600),
        change3DDomEmit() {
            const tags = _.cloneDeep(this.tags)
            tags.map(item => {
                item.points.x = +item.points.x
                item.points.y = +item.points.y
                item.points.z = +item.points.z
                return item
            })
            this.$emit('change3DDomContainer', tags, this.five.state.panoIndex)
        },
        clearAxes() {
            this.pointAxesList.map((point) => {
                point.clear();
            });
            this.pointAxesList = []
        },
        clearRadio() {
            this.active = ''
            this.axis = {}
        },
        clearSlider() {
            this.sliderModel = Object.values(this.sliderModel).map(item => { 
                item = 0;
                return item
             })
        },
        clearAll() {
            for (const tag of this.tags){
                const div = this.tagToElement.get(tag)
                 app.removeChild(div)
                 div = null
            }
            this.clear3DDomContainer()
            this.clearAxes()
            this.clearSlider()
            this.isEdit = false
            this.axis = {}
            this.tags = [];
            this.newTag = null;
            if (this.rectangleType == 'video') {
                this.five.plugins.modelTVVideoPlugin.disable()
            }
            this.five.refresh()
            setTimeout(() => {
                this.five.refresh()
            }, 200)
            this.change3DDomEmit()
        },
        addPoint(){
            if (this.tags.length >= 4) {
                return
            }
            const textPoint = {
                '1': '左下', 
                '2': '右下', 
                '3': '右上', 
                '4': '左上', 
            }
            this.newTag = { label: textPoint[this.tags.length + 1], index: this.tags.length };
            // this.newTag = { label: `点${!this.tags.length ? 1 : this.tags.length+1}`, index: this.tags.length };
            this.tagToElement.set(this.newTag, this.createTagElement(this.newTag));
        },
        clickTag(tag) {
            this.isPoint = true
            this.isEdit = true
            this.newTag = tag
            this.axis = this.newTag.points
            this.active = tag.index
            if (this.tags.length === 4) {
                this.isMove = !this.isMove
            }
        },
        changeRadio(val) {
            this.isPoint = true
            this.isEdit = true
            this.newTag = this.tags[val]
            this.axis = this.newTag.points
            this.active = val
            const tag = this.tags[val]
            if (this.tags.length === 4) {
                this.isMove = !this.isMove
            }
        },
        initData(tags) {
            this.tags = tags.map(item => {
                const {x,y,z} = item.points
                item.points = {x,y,z}
                item.position = new THREE.Vector3(+x,+y,+z)
                this.tagToElement.set(item, this.createTagElement(item));
                const val = item.points
                const point = new THREE.Vector3(+val.x,+val.y,+val.z)
                const current = this.five.plugins.panoCursorRaycasterPlugin.pointAxesHelper(point);
                this.pointAxesList = [...this.pointAxesList, current]; // 保存辅助坐标轴
                return item
            })
            this.renderTags();
            this.clear3DDomContainer()
            this.create3DDomContainerRender(this.tags, false, true)
        },
    },
};
</script>

<style>
    .el-input-number--small {
        width: 100%;
    }
    .vr__axis .el-radio{
        margin-right: 8px;
        margin-bottom: 0;
    }
    .vr__axis .el-radio__label{
        padding-left: 2px;
    }
    .vr__axis .el-radio__label{
        color: #333;
    }
    .vr__cursor .el-input-number--mini{
        width: 94px;
    }
    .vr__cursor .el-slider__runway.show-input{
        width: 120px;   
        margin-right: 0;
    }
    .vr__cursor .el-slider{
        flex: 1;
    }
</style>

<style scoped lang="scss">
    @import './index.scss';
</style>
