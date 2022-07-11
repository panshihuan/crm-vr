<template>
    <div class="vr__rectangle3">
        <div>
            <el-button 
                type="primary"
                size="mini"
                v-show="state != 1"
                @click="btnClick"
                v-text="['开始拾取', '', '重新拾取'][state]"
            ></el-button>
            <span v-show="state == 1">拾取中...</span>
            <el-button style="margin-left: 10px;" type="danger" size="mini" @click="handleClear">清除</el-button>
        </div>
        <div v-show="rect" class="vr__rectangle3__form">
            <section class="vr__rectangle3__section vr__rectangle3__section--width">
                <label class="vr__rectangle3__label" style="flex: 0 0 30px;">宽：</label>
                <div class="vr__rectangle3__slider vr__rectangle3--si">
                    <el-slider style="color: red;" v-model="width" :max="maxWidth" :min="minWidth" :step="step" show-input input-size="mini" @input="changeSize"></el-slider>
                </div>
            </section>
            <section class="vr__rectangle3__section vr__rectangle3__section--width">
                <label class="vr__rectangle3__label" style="flex: 0 0 30px;">高：</label>
                <div class="vr__rectangle3__slider vr__rectangle3--si">
                    <el-slider v-model="height" :max="maxHeight" :min="minHeight" :step="step" show-input input-size="mini" @input="changeSize"></el-slider>
                </div>
            </section>
            <section class="vr__rectangle3__section">
                <label class="vr__rectangle3__label vr__rectangle3__label2 vr__rectangle3--x">X旋转:</label>
                <div class="vr__rectangle3__slider">
                    <el-slider v-model="rotateX" :max="2 * Math.PI" :min="-2 * Math.PI" :step="step" show-input input-size="mini" @input="changeRotation"></el-slider>
                </div>
            </section>
            <section class="vr__rectangle3__section">
                <label class="vr__rectangle3__label vr__rectangle3__label2 vr__rectangle3--y">Y旋转:</label>
                <div class="vr__rectangle3__slider">
                    <el-slider v-model="rotateY" :max="2 * Math.PI" :min="-2 * Math.PI" :step="step" show-input input-size="mini" @input="changeRotation"></el-slider>
                </div>
            </section>
            <section class="vr__rectangle3__section">
                <label class="vr__rectangle3__label vr__rectangle3__label2 vr__rectangle3--z">Z旋转:</label>
                <div class="vr__rectangle3__slider">
                    <el-slider v-model="rotateZ" :max="2 * Math.PI" :min="-2 * Math.PI" :step="step" show-input input-size="mini" @input="changeRotation"></el-slider>
                </div>
            </section>
            <section class="vr__rectangle3__section" style="margin-top: 10px;">
                <label class="vr__rectangle3__label vr__rectangle3__label2 vr__rectangle3--x">X坐标:</label>
                <div class="vr__rectangle3__slider">
                    <el-input
                        size="mini"
                        v-model="posX"
                        type="number"
                        step=0.01
                        @input="changePosition"
                    ></el-input>
                </div>
            </section>
            <section class="vr__rectangle3__section" style="margin-top: 10px;">
                <label class="vr__rectangle3__label vr__rectangle3__label2 vr__rectangle3--y">Y坐标:</label>
                <div class="vr__rectangle3__slider">
                    <el-input
                        size="mini"
                        v-model="posY"
                        type="number"
                        step=0.01
                        @input="changePosition"
                    ></el-input>
                </div>
            </section>
            <section class="vr__rectangle3__section" style="margin-top: 10px;">
                <label class="vr__rectangle3__label vr__rectangle3__label2 vr__rectangle3--z">Z坐标:</label>
                <div class="vr__rectangle3__slider">
                    <el-input
                        size="mini"
                        v-model="posZ"
                        type="number"
                        step=0.01
                        @input="changePosition"
                    ></el-input>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import * as THREE from "three";
import { Vector3 } from "three";
import Vue from "vue";
import { ImgCmp } from '@/views/fiveVR/components/MenuRight/components/A-Rectangle/imgCmp'

import jpg1 from "../../../../../../assets/img/home-2022.jpg";
import mp4 from "../../../../assets/img/normal_video.mp4";
import ImgP from '@/views/fiveVR/assets/img/lowPoint.png';

let defaultWidth = 1
let defaultHeight = 0.5

export default {
    name: "Rectangle3",
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
        rectangleType: {
            type: [Number, String],
        },
        initeExtra: {
            type: [Object],
        },
    },
    data() {
        return {
            imgCmp: null,
            destroy: null,
            state: 0, //0初始状态 1跟随光标 2固定
            gp: null,
            rect: null,

            width: defaultWidth,
            height: defaultHeight,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            posX: 0,
            posY: 0,
            posZ: 0,
            src: 'https://vr.bookan.com.cn/backend_management/03deebbf.png',
            minWidth: 0,
            minHeight: 0,
            maxWidth: 20,
            maxHeight: 20,
            step: 0.01,
        };
    },
    watch: {
        initRectangle(val, oldVal) {
            if (!val) {
                this.tags = []
                return
            }
            if (val !== oldVal) {
                this.editData(val)
            }
        }
    },
    created() {
        this.$bus.$on('refreshTagItem', () => {
            this.handleClear()
        })
    },
    mounted() {
        this.imgCmp = new ImgCmp(this.five)

        this.five.on("wantsTapGesture", (raycaster, tapPosition) => {
            if (this.gp) {
                this.rotateX = this.rect.rotation.x;
                this.rotateY = this.rect.rotation.y;
                this.rotateZ = this.rect.rotation.z;
                
                if (this.state == 1) {
                    this.state = 2;
                    this.change3DDomEmit()
                    return false;
                }
            }
        });

        this.five.on("intersectionOnModelUpdate", (intersection, mesh) => {
            if (this.state != 1) {
                return false;
            }
            let {
                distance,
                face: { normal },
                point: { x, y, z },
            } = intersection;
            if (this.gp) {
                this.gp.position.set(x, y, z);
                this.posX = x;
                this.posY = y;
                this.posZ = z;
                let q4 = new THREE.Quaternion();
                q4.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
                this.rect.quaternion.copy(q4);
            }
        });
    },
    methods: {
        init({
            scene = this.five.scene,
            color = 0x74ba1d,
            depth = true,
            opacity = 0.2,
            pos = { x: 0, y: 0, z: 0 },
        }) {
            this.gp = new THREE.Group();
            this.gp.visible = false;
            let gem = new THREE.PlaneGeometry(this.width, this.height);
            let mat = new THREE.MeshBasicMaterial({
                // wireframe: true,
                map: new THREE.TextureLoader().load(ImgP),
                // color,
                transparent: true,
                opacity,
                side: THREE.DoubleSide,
                skinning: true,
                blending: THREE.CustomBlending,
                blendSrc: THREE.SrcColorFactor,
                depthTest: depth,
                depthWrite: depth,
            });
            this.rect = new THREE.Mesh(gem, mat);
            let axisHelper = new THREE.AxesHelper(100);
            this.gp.add(axisHelper);
            // let gridHelper = new THREE.GridHelper(100, 30, 0x2c2c2c, 0x888888);
            // gp.add(gridHelper);
            this.gp.add(this.rect);
            scene.add(this.gp);
        },
        changeSize() {
            if (this.rect) {
                this.rect.scale.set(this.width, this.height*2, 1);
                this.five.refresh()
                this.change3DDomEmit()
            }
        },
        changeRotation(val) {
            if (this.rect) {
                this.rect.rotation.set(this.rotateX, this.rotateY, this.rotateZ);
                this.five.refresh()
                this.change3DDomEmit()
            }
        },
        changePosition() {
            if (this.gp) {
                this.gp.position.set(this.posX, this.posY, this.posZ);
                this.five.refresh()
                this.change3DDomEmit()
            }
        },
        editData(val) {
            const type = this.initeExtra.type
            if (type == 1) {
                this.loadImgCpm(val)
            } else if (type == 2) {
                this.loadTV(val)
            } else if (type == 4) {
                this.loadCss3D(val)
            }
        },
        loadImgCpm(payload) {
            const tags = payload.map(item => item.points)
            this.imgCmp.render(tags, this?.initeExtra?.info?.src || ImgP)
            setTimeout(() => {
                this.five.refresh();
            }, 200)
        },
        async loadTV(payload) {
            const points = payload.map(item => item.points)
            let [a, b, c, d] = points;
            const data = {
                video_src: this?.initeExtra?.info?.src || '//vrlab-public.ljcdn.com/release/web/videos/tv_ads/360/009.mp4',
                video_poster_src: "https://vrlab-public.ljcdn.com/release/web/videos/posters/002.9203cf99.jpg",
                points: [[d, a, b, c]],
            };
            this.five.plugins.modelTVVideoPlugin.disable();
            await this.five.plugins.modelTVVideoPlugin.load(data);
            this.five.plugins.modelTVVideoPlugin.enable();
            setTimeout(() => {
                this.five.refresh();
            }, 200)
        },
        loadCss3D(payload) {
            const points = payload.map(item => item.points)
            const css3DRender = this.five.plugins.css3DRender;
            let { container, dispose } = css3DRender.create3DDomContainer(points);
            this.destroy = dispose;
            container.style.pointerEvents = 'all';
            container.innerHTML = `<iframe src="${this?.initeExtra?.info?.src || 'http://wk5.bookan.com.cn?id=16935'}" style="border:none;width:100%;height:100%" scrolling="no"><p>你的浏览器不支持iframe标签</p></iframe>`;
            setTimeout(() => {
                this.five.refresh()
            }, 300)
        },
        calcPoint4() {
            if (!this.rect) {
                return []
            }
            let rt = [];
            this.rect.geometry.vertices.forEach((el) => {
                var vector = el.clone();
                vector.applyMatrix4(this.rect.matrixWorld);
                let { x, y, z } = vector;
                rt.push({ x, y, z });
                // console.log("旋转后的顶点世界坐标", vector);
            });
            return [rt[2], rt[3], rt[1], rt[0]];
        },
        change3DDomEmit() {
            const tags = this.calcPoint4()
            const result = tags.map(item => {
                const it = {points: item}
                return it
            })
            const rectData = {
                width: this.width,
                height: this.height,
                rotateX: this.rotateX,
                rotateY: this.rotateY,
                rotateZ: this.rotateZ,
                posX: this.posX,
                posY: this.posY,
                posZ: this.posZ,
            }
            this.$emit('change3DDomContainer', result, this.five.state.panoIndex, rectData)
        },
        testRemove() {
            this.five.scene.remove(this.gp);
            this.gp = null;
            this.rect = null;
            this.width = defaultWidth
            this.height = defaultHeight
            this?.imgCmp?.remove()
            this.five.plugins.modelTVVideoPlugin.disable()
            this.destroy && this.destroy()
        },
        btnClick() {
            this.state = this.state == 1 ? 0 : 1;
            if (this.state > 0) {
                this.testRemove();
                this.init({
                    // depth:  this.rectangleType == 'video' ? true: false,
                });
                this.gp.visible = true;
            }
        },
        clearInput() {
            this.width = defaultWidth
            this.height = defaultHeight
            this.rotateX = 0
            this.rotateY = 0
            this.rotateZ = 0
            this.posX = 0
            this.posY = 0
            this.posZ = 0
        },
        handleClear() {
            this.state = 0
            this.testRemove()
            this.clearInput()
            this.five.refresh()
            this.change3DDomEmit()
        }
    },
};
</script>

<style>
    .vr__rectangle3 .el-input-number--mini{
        width: 105px;
    }
    .vr__rectangle3 .el-slider__runway.show-input{
        width: 110px;   
        margin-right: 0;
    }
    .vr__rectangle3 .vr__rectangle3__section--width .el-slider__runway.show-input{
        width: 130px;
    }
    .vr__rectangle3--si .el-slider__bar,.vr__rectangle3--si .el-slider__button{
        background-color: #e7e669;
        border-color: #e7e669;
    }
</style>

<style scoped lang="scss">
 @import './index.scss';
</style>
