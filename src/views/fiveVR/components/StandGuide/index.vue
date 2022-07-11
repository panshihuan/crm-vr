<template>
    <div class="stand">
        <template v-for="(it, index) in list">
            <div
                class="dotWrap"
                v-show="styles[index] && !it.position.length"
                :key="index+'stand'"
                :style="styles[index]"
                @click="eleClick({ type: 'dotGuide', index }, it)"
            >
                <i class="dot"></i>
            </div>
        </template>
    </div>
</template>

<script>
import {
    getVrSceneContentList,
} from "@/api/fiveVR";
import { GLTFLoader } from "@realsee/five/gltf-loader";
import { cameraToVec3, calcCenterPoint } from "../../assets/js/tools";
// import spritesImg from "../assets/img/sprites.png";
import videoIconImg from "../../assets/img/play-64.png";
import waveImg from "../../assets/img/wave.png";
import circleImg from "../../assets/img/circle32.png";
import wave2 from "../../assets/img/wave2.png";
import wave3 from "../../assets/img/wave3.png";
import TWEEN from "@tweenjs/tween.js";
import * as THREE from "three";
import css3DRender from './components/css3dRenderCmp/index'


export default {
    name: "StandGuide",
    components: {},
    props: {
        five: {
            type: [Object, Array],
        },
    },
    data() {
        return {
            cmp: {},
            tipObj: {},
            scopeObj: {},
            ctStandPos: new THREE.Vector3({ x: 0, y: 0, z: 0 }),
            obj3dAnmDisLimit: 5,
            styles: [],
            circleMesh: null,
            waveMesh: null,
            standGroup: null,
            currentState: null,
            isEdit: false,
            refresh: true,
            list: [],
        };
    },
    created() {
        this.$bus.$on('refreshPlaneList', ({ isEdit=false, isFetch=false, item=null }, isRefresh=false) => {
            this.isEdit = isEdit
            if (!isEdit) {
                const list = _.cloneDeep(this.list)
                this.list = list.map(it => {
                    it.isEdit = false
                    return it
                })
            }
            if (isFetch) {
                for (let key in this.scopeObj) {
                    if (this.scopeObj[key]?.group) {
                        this.five.scene.remove(this.scopeObj[key].group)
                    }
                }
                this.initThree()
                this.getVrSceneContentList()
            }
            if (isEdit && item) {
                let currentIndex = this.list.findIndex(it => it.id == item.id)
                if (currentIndex != -1) {
                    const currentItem = this.list[currentIndex]
                    currentItem.isEdit = true
                    this.$set(this.list, currentIndex, currentItem)
                    for (let key in this.scopeObj) {
                        if (this.scopeObj[key]?.group) {
                            this.five.scene.remove(this.scopeObj[key].group)
                        }
                    }
                    this.initThree()
                    this.initAllRender()
                }
            }
            if (isRefresh) {
                for (let key in this.scopeObj) {
                    if (this.scopeObj[key]?.group) {
                        this.five.scene.remove(this.scopeObj[key].group)
                    }
                }
                this.initThree()
                this.initAllRender()
            }
        })
    },
    mounted() {
        this.initThree()
        this.getVrSceneContentList()
        // 绑定点击事件
        this.five.on("wantsTapGesture", (raycaster, tapPosition) => {
            let hasClickEle = raycaster.intersectObjects(
                this.five.scene.children,
                true
            );
            let target = hasClickEle.filter(
                (it) => it.object.name.indexOf("standGuide_") == 0
            );
            let obj3d = hasClickEle.filter(
                (it) => it.object?.parent?.name.indexOf("object3d_") == 0
            );
            let type = target[0] ? "standGuide" : obj3d[0] && "object3d";
            let index = -1;
            if (target && target[0]) {
                index = +target[0].object.name.replace("standGuide_", "");
            } else if (obj3d && obj3d[0]) {
                index = this.list.findIndex(
                    (it) => {
                        if (it.extra?.info?.id) {
                            return it.extra.info.id ==
                            obj3d[0].object?.parent?.name.replace("object3d_", "")
                        }
                    }
                );
            }

            return this.eleClick({ type, index });
        });

        this.five.on("panoWillArrive", () => {
            for (let index of Object.keys(this.scopeObj)) {
                if (this.scopeObj[index]?.group) {
                    this.scopeObj[index].group.visible = true;
                }
            }
        });

        this.five.on("panoArrived", () => {
            this.ctStandPos = this.five.state.offset;
        });
    },
    methods: {
        initThree() {
            this.currentState = this.five.getCurrentState();
            this.initCircleMesh();
            this.initWaveMesh();
            this.initStandGroup();
        },
        getVrSceneContentList() {
            const { groupId, id } = this.$route.query;
            getVrSceneContentList({
                group_id: groupId,
                vr_id: id,
            }).then((res) => {
                this.list = _.cloneDeep(res.list);
                this.initAllRender()
            });
        },
        initAllRender() {
            for (let i = 0; i < this.list.length; i++) {
                this.scopeObj[i] = {};
                this.styles[i] = {};
                let scope = this.scopeObj[i];
                this.initRender(scope, this.list[i], i);
            }
            setTimeout(() => {
                this.five.refresh()
            }, 1000)
        },
        initCircleMesh() {
            let textureCircle = new THREE.TextureLoader().load(wave3);
            textureCircle.needsUpdate = true;
            const geometryCircle = new THREE.PlaneBufferGeometry(
                0.3,
                0.3,
                1,
                1
            );
            let materialCircle = new THREE.MeshLambertMaterial({
                transparent: true,
                // emissive: 0xffffff,
                side: THREE.DoubleSide,
                depthWrite: false,
                map: textureCircle,
            });
            let circleMesh = new THREE.Mesh(geometryCircle, materialCircle);
            circleMesh.rotation.x = Math.PI / 2;
            this.circleMesh = circleMesh;
        },
        initWaveMesh() {
            let textureWave = new THREE.TextureLoader().load(wave2);
            textureWave.needsUpdate = true;
            const geometryWave = new THREE.PlaneBufferGeometry(0.3, 0.3, 1, 1);
            let materialWave = new THREE.MeshLambertMaterial({
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false,
                map: textureWave,
            });

            let waveMesh = new THREE.Mesh(geometryWave, materialWave);
            waveMesh.rotation.x = Math.PI / 2;
            this.waveMesh = waveMesh;
        },
        initStandGroup() {
            // 站立标组
            let standGroup = new THREE.Group();
            let circleMeshClone = this.waveMesh.clone();
            let circleMeshBaseClone = this.circleMesh.clone();
            circleMeshClone.position.set(0, 0.01, 0);
            circleMeshBaseClone.position.set(0, 0.01, 0);
            standGroup.add(circleMeshClone);
            standGroup.add(circleMeshBaseClone);
            // 线
            let lineGeometry = new THREE.BufferGeometry();
            lineGeometry.setFromPoints([
                new THREE.Vector3(0, 0.01, 0),
                new THREE.Vector3(0, 0.7, 0),
            ]);
            let lineMaterial = new THREE.LineBasicMaterial({
                color: 0xffffff,
            });
            let standLine = new THREE.Line(lineGeometry, lineMaterial);
            standGroup.add(standLine);
            let iconMat = new THREE.SpriteMaterial({
                map: new THREE.TextureLoader().load(videoIconImg),
                depthWrite: false,
            });
            // 悬浮图标
            let standIcon = new THREE.Sprite(iconMat);

            standIcon.position.set(0, 0.75, 0);
            standIcon.scale.set(0.15, 0.15);
            standGroup.add(standIcon);
            this.standGroup = standGroup;
        },
        scaleWave(mesh) {
            let scaleTrack = new THREE.KeyframeTrack(
                ".scale",
                [0, 20],
                [1, 1, 1, 1.5, 1.5, 1.5]
            );
            // 透明动画
            let opacityTrack = new THREE.KeyframeTrack(
                ".material.opacity",
                [0, 20],
                [1, 0]
            );
            let clip = new THREE.AnimationClip("default", 20, [
                scaleTrack,
                opacityTrack,
            ]);
            let clock = new THREE.Clock();
            //缩放动画
            //   混合播放器
            let mixer = new THREE.AnimationMixer(mesh);
            let action = mixer.clipAction(clip);
            action.timeScale = 10;
            action.play();

            function animateWave() {
                requestAnimationFrame(animateWave);
                mixer.update(clock.getDelta());
            }
            animateWave();
        },
        async initRender(scope, itemPayload, index) {
            const payload = itemPayload.extra
            // 未配置站立标位置使用引导点
            if ([2, 4, 1].includes(payload.type) && !payload.position?.length) {
                let { points } = payload.info;
                let { x, y, z } = calcCenterPoint(points);
                this.five.on("currentStateChange", (state) => {
                    let scrPos = this.five.project2d(
                        new THREE.Vector3(x, y, z),
                        true
                    );
                    if (scrPos) {
                        // 计算当前位置与标签坐标间距离
                        this.styles[index].display = "block";
                        this.styles[index].left = scrPos.x + "px";
                        this.styles[index].top = scrPos.y + "px";
                    } else {
                        this.styles[index].display = "none";
                    }
                });
            }
            // 宝箱
            if (payload.type == 666) {
                setTimeout(async () => {
                    let box = await this.cmp.treasure.appendBox(
                        {
                            position: payload.position,
                            id: payload.info.id,
                            type: 2,
                        },
                        payload
                    );
                }, 5000);
                return false;
            }
            // 3d 模型
            if (payload.type == 5) {
                    let loader = new GLTFLoader();
                    loader.load(payload.info.model, ({ scene }) => {
                        let gp = new THREE.Group();
                        gp.position.set(...payload.position);
                        scene.scale.set(
                            payload.info.scale,
                            payload.info.scale,
                            payload.info.scale
                        );
                        scene.rotateY(Math.PI * payload.info.rotateY);
                        scene.name = "object3d_" + payload.info.id;

                        // new THREE.TextureLoader().load()

                        gp.add(scene);
                        this.five.scene.add(gp);
                        scope.group = gp;
                        if (itemPayload.isEdit) {
                            this.five.scene.remove(gp)
                        }
                        if (payload.info.animate) {
                            let animate = null;
                            let rotateMap = {
                                rotateY: "y",
                                rotateX: "x",
                                rotateZ: "z",
                            };
                            if (rotateMap[payload.info.animate]) {
                                let speed = 0.01;
                                animate = () => {
                                    let dis = this.ctStandPos.distanceTo(
                                        new THREE.Vector3(...payload.position)
                                    );
                                    if (dis < this.obj3dAnmDisLimit) {
                                        gp.rotation[
                                            rotateMap[payload.info.animate]
                                        ] += speed;
                                    }
                                    requestAnimationFrame(animate);
                                };
                            }
                            if (payload.info.animate == "scale") {
                                let speed = 0.005;
                                let min = 0.9;
                                let max = 1.1;
                                let scale = 1;
                                animate = () => {
                                    let dis = this.ctStandPos.distanceTo(
                                        new THREE.Vector3(...payload.position)
                                    );
                                    if (dis < this.obj3dAnmDisLimit) {
                                        if (scale >= max || scale <= min) {
                                            speed = -speed;
                                        }
                                        scale += speed;
                                        gp.scale.set(scale, scale, scale);
                                    }
                                    requestAnimationFrame(animate);
                                };
                            }
                            if (payload.info.animate == "jump") {
                                let startY = payload.position[1];
                                let endY = startY * (startY > 0 ? 1.4 : 0.8);
                                gp.position.y = endY;
                                var tween = new TWEEN.Tween(gp.position)
                                    .delay(3000 + 2000 * Math.random())
                                    .easing(TWEEN.Easing.Back.InOut)
                                    .to({ y: startY }, 1000)
                                    .start();
                                tween.repeat(Infinity);
                                // tween.yoyo(true)
                                animate = () => {
                                    let dis = this.ctStandPos.distanceTo(
                                        new THREE.Vector3(...payload.position)
                                    );
                                    if (dis < this.obj3dAnmDisLimit) {
                                        TWEEN.update();
                                    }
                                    requestAnimationFrame(animate);
                                };
                            }
                            setTimeout(() => {
                                animate && animate();
                            }, 100);
                        }
                    });
                return false;
            }

            if (payload.position?.length == 3) {
                // 帧动画;
                let standPos = payload.position;
                standPos[1] += 0.01;
                let iconPos = [...standPos];
                iconPos[1] += 0.8;

                let standGroupClone = this.standGroup.clone();
                this.scaleWave(standGroupClone.children[0]);
                standGroupClone.position.set(...payload.position);
                standGroupClone.children[3].name = "standGuide_" + index;
                scope.group = standGroupClone;
                this.five.scene.add(standGroupClone);
            }
        },
        eleClick({type,index}, item) {
            if (!type) {
                return
            }
            // 站立标
            if (type == "standGuide" || type == "dotGuide" || type === 'object3d') {
                let vr = this.list[index];
                let info = vr.extra
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
                    this.$bus.$emit('clickEditPoint', {type: info.type, index, info: vr})
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
            }
        },
    },
};
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
