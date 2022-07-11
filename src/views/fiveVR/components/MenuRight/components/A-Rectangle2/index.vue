<template>
    <div class="vr__cursor">
        <div>
            <el-button v-if="pointState != 3" type="primary" size="mini" @click="handleToggle">{{pointState == 1 ? STATELABEL.start : pointState == 2 ? STATELABEL.stop : STATELABEL.over}}</el-button>
            <el-button type="danger" size="mini" @click="clearPoints">清除</el-button>
            <el-button v-if="points.length" type="info" size="mini" @click="handleBack">撤销上一步</el-button>
        </div>
        <div v-if="renderType == 'video'" class="vr__cursor__slider-container">
            <section v-for="(item, index) in points" :key="index+'slider'" class="vr__cursor__slider">
                <div class="vr__cursor__slider__color" :style="{background: getColor(index)}"></div>
                <el-slider v-model="sliderModel[index]" :max="max" :min="min" :step="step" show-input input-size="mini" @change="(val) => changeSlider(val, index)"></el-slider>
            </section>
        </div>
    </div>
</template>

<script>
import {} from "@/api/fiveVR";
import * as THREE from "three";
import { Vector3 } from "three";
import Vue from "vue";

import jpg1 from "../../../../../../assets/img/home-2022.jpg";
import mp4 from "../../../../assets/img/normal_video.mp4";

const POINTCOLOR = {
    point1: '#d9f7ac',
    point2: '#0d9507',
    point3: '#b08f1c',
    point4: '#e54a23',
}

let app = null;

export default {
    name: "Rectangle2",
    components: {},
    props: {
        five: {
            type: [Object, Array],
        },
        initRectangle: {
            type: [Object, Array],
        },
        type: {
            type: [Number, String],
        },
        renderType: {
            type: [String],
            default: 'css3D'  // video
        }
    },
    data() {
        return {
            pointState: 1, // 1开始取点，2停止取点，3完成取点
            points: [], // 坐标点
            originalPoints: [], // 原始坐标点
            pointAxesList: [], // 辅助坐标轴
            divs: [], // dom点
            destroy: null,
            dispose: null,
            jpg1: jpg1,
            mp4: mp4,
            STATELABEL: {
                start: '开始取点',
                stop: '停止取点',
                over: '完成取点',
            },
            max: 2,
            min: -1,
            step: 0.1,
            sliderModel: {
            },
            tagToElement: new WeakMap(),
        };
    },
    watch: {
        initRectangle(val, oldVal) {
            if (!val) {
                this.tags = []
                return
            }
            if (val !== oldVal) {
                this.initData(val)
            }
        }
    },
    created() {},
    mounted() {
        this.$nextTick(() => {
            app = document.querySelector("#appCVS")
            this.five.on("cameraUpdate", this.renderTags);
        })
        const { destroy } = this.five.plugins.panoCursorRaycasterPlugin;
        this.destroy = destroy;
        this.points = [];
        this.five.on("wantsTapGesture", () => {
            if (this.points.length >= 4) {
                return;
            }
            if (this.pointState != 2) {
                return
            }
            const pos = this.five.plugins.panoCursorRaycasterPlugin.intersection();
            if (!pos) {
                return;
            }
            const point = pos.point
            const current = this.five.plugins.panoCursorRaycasterPlugin.pointAxesHelper(point);
            this.pointAxesList = [...this.pointAxesList, current]; // 保存辅助坐标轴
            this.points = [...this.points, point]; // 保存点位
            // this.tagToElement.set(point, this.createTagElement(this.points.length - 1));
            this.tagToElement.set([`point${this.points.length - 1}`], this.createTagElement(this.points.length - 1));
            this.renderTags()
            if (this.points.length === 4) {
                this.pointState = 3  // 完成取点
                if (this.renderType == 'css3D') {
                    this.create3DDomContainerRender()
                } else if (this.renderType == 'video') {
                    this.loadTV();
                } else {
                    this.create3DDomContainerRender()
                }
            }
            this.originalPoints = _.cloneDeep(this.points)
            return false;
        });
    },
    methods: {
        createTagElement(index){
            const div = document.createElement("div");
            div.className = "panoCursor";
            div.style.display = "none";
            const color = this.getColor(index)
            div.innerHTML = `<div class="panoCursor-point" style="border-color: ${color}"></div>`;
            this.div = div
            app.appendChild(div);
            return div;
        },
        renderTags(){
            this.points.map((tag, index) => {
                const element = this.tagToElement.get([`point${index}`]);
                if (element) {
                    const position = this.five.project2d(tag, true);
                    if (position === null) {
                        element.style.display = "none";
                    } else {
                        element.style.display = "";
                        element.style.left = position.x + "px";
                        element.style.top = position.y + "px";
                    }
                }
            })
            // for (const tag of [...this.points]) {
            //     if (!tag) continue;
            //     const element = this.tagToElement.get(tag);
            //     if (!element) continue;
            //     const position = this.five.project2d(tag, true);
            //     if (position === null) {
            //         element.style.display = "none";
            //     } else {
            //         element.style.display = "";
            //         element.style.left = position.x + "px";
            //         element.style.top = position.y + "px";
            //     }
            // }
        },
        handleToggle() {
            this.pointState = this.pointState == 1 ? 2 : this.pointState == 2 ? 1 : 1
        },
        async loadTV() {
            const points = this.points.map((item) => {
                if ((Object.prototype.toString.call(item) === '[object Object]')) {
                    return item
                }
                const [x, y, z] = item.toArray();
                return { x, y, z };
            });
            let [a, b, c, d] = points;
            const data = {
                video_src: '//vrlab-public.ljcdn.com/release/web/videos/tv_ads/360/009.mp4',
                video_poster_src: "https://vrlab-public.ljcdn.com/release/web/videos/posters/002.9203cf99.jpg",
                points: [[d, a, b, c]],
            };
            this.five.plugins.modelTVVideoPlugin.disable();
            await this.five.plugins.modelTVVideoPlugin.load(data);
            this.five.plugins.modelTVVideoPlugin.enable();
            this.change3DDomEmit()
        },
        create3DDomContainerRender() {
            this.clear3DDomContainer()
            const points = this.points
            const css3DRender = this.five.plugins.css3DRender;
            let { container, dispose } = css3DRender.create3DDomContainer(points);
            this.dispose = dispose;
            container.style.pointerEvents = 'all';
            container.innerHTML = `<div style="border:1px solid #ddd;width:100%;height:100%;background:url() center no-repeat;background-size:cover;background-color: #ddd;" ></div>`;
            container.style.pointerEvents = "none";
            this.change3DDomEmit()
        },
        clear3DDomContainer() {
            this.dispose && this.dispose()
        },
        clearPoints() {
            this.pointAxesList.map((point) => {
                point.clear();
            });
            this.pointState = 1
            this.clearDomPoint()
            this.five.plugins.modelTVVideoPlugin.disable()
            this.dispose && this.dispose()
            this.sliderModel = {}
            this.points = [];
            this.five.refresh();
        },
        clearDomPoint() {
            // this.points.map((tag, index) => {
            //     const div = this.tagToElement.get([`point${index}`])
            //     app.removeChild(div)
            //     div = null
            // })
            // for (const tag of this.points){
            //     const div = this.tagToElement.get(tag)
            //     app.removeChild(div)
            //     div = null
            // }
        },
        handleBack() {
            this.points.pop()
            this.pointState = 1
            this.pointAxesList[this.pointAxesList.length - 1].clear();
            this.pointAxesList.pop()
            this.five.plugins.modelTVVideoPlugin.disable();
            this.clear3DDomContainer()
            this.five.refresh();
        },
        changeSlider(distance, index) {
            const point = this.originalPoints[index]
            const newPoint = this.five.plugins.panoCursorRaycasterPlugin.movePointTowardsCamera(point, distance)
            this.$set(this.points, index, newPoint)
            this.loadTV()
        },
        getColor(index) {
            const key = `point${index+1}`
            return POINTCOLOR[key]
        },
        change3DDomEmit() {
            const points = this.points.map((item, index) => {
                if ((Object.prototype.toString.call(item) === '[object Object]')) {
                    return {
                        index,
                        label: '',
                        points: item
                    }
                }
                const [x, y, z] = item.toArray();
                return {
                    index,
                    label: '',
                    points: {x,y,z}
                }
            });
            this.$emit('change3DDomContainer', points)
        },
        initData(tags) {
            this.points = tags.map(item => {
                const {x,y,z} = item.points
                item.position = new THREE.Vector3(+x,+y,+z)
                this.tagToElement.set(item, this.createTagElement(item));
                const val = item.points
                const point = new THREE.Vector3(+val.x,+val.y,+val.z)
                const current = this.five.plugins.panoCursorRaycasterPlugin.pointAxesHelper(point);
                this.pointAxesList = [...this.pointAxesList, current]; // 保存辅助坐标轴
                return item.points
            })
            this.renderTags();
            if (this.renderType == 'css3D') {
                this.create3DDomContainerRender()
            } else if (this.renderType == 'video') {
                this.loadTV();
            } else {
                this.create3DDomContainerRender()
            }
            this.$emit('change3DDomContainer', tags)
        },
    },
};
</script>

<style>
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
    .vr__cursor{
        padding: 20px 0;
        &__slider{
            &-container{
                margin-top: 20px;
            }
            display: flex;
            width: 100%;
            align-items: center;
            &__color{
                width: 16px;
                height: 16px;
                border-radius: 50% 50%;
                margin-right: 15px;
            }
        }
    }
</style>
