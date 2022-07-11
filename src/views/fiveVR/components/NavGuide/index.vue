<template>
    <div class="pageWrap">
        <div v-if="!guideListHide" class="floor_wrap bgBlur5">
            <p class="tit">
                请选择您的目标点位
                <i class="iconfont close" @click="handleClose">&#xe7dc;</i>
            </p>
            <div class="dt" v-if="floorList.length > 1">
                <span :class="[typeFloor == null ? 'current' : '']" @click="typeFloor = null">全部</span>
                <span
                    :class="[typeFloor == it ? 'current' : '']"
                    v-for="it in floorList"
                    :key="it"
                    v-html="'楼层:' + (it + 1)"
                    @click="typeFloor = it"
                ></span>
            </div>
            <div class="dd">
                <span
                    class="item"
                    v-for="item in items"
                    :key="item.panoIndex"
                    v-html="item.name"
                    @click="navTo(item.panoIndex)"
                ></span>
            </div>
        </div>
        <span v-show="guideListHide" class="gdBtn next" @click="goNextPathPoint">
            <i class="iconfont">&#xe8f9;</i>
        </span>
    </div>
</template>

<script>
import * as THREE from "three";
import { cameraToVec3 } from "../../assets/js/tools"
import Graph from "../../assets/js/graph"
import wayDirImg from "../../assets/img/way4.png"
import endPointImg from "../../assets/img/end_point.png"

let prevNavPointIndex = null;//导航模式下上一个点index

let gd_mesh = null;
let gd_geometry = new THREE.PlaneBufferGeometry(2, 30);
let gd_texture = new THREE.TextureLoader().load(wayDirImg);
let gd_material = new THREE.MeshBasicMaterial({
    transparent: true,
    color: 0x00a142,
    side: THREE.DoubleSide,
    map: gd_texture,
});
// 终点标识
let endPointMt = new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load(endPointImg),
    depthWrite: false,
});
let endPointIcon = new THREE.Sprite(endPointMt);

//垂梯1 扶梯2 步梯3 闭门4
const linkTypeDisMap = {
    1: 1,
    2: 2,
    3: 5,
    4: 1,
}
const linkTypeTipMap = {
    1: "请乘坐电梯到达${floor}层",
    2: "请乘扶梯到达${floor}层",
    3: "请走楼梯到达${floor}层",
    4: "请进门到达下一个点",
}

export default {
    name: 'NavGuide',
    components: {
    },
    props: {
        five:{
            type: [Object, Array]
        },
        list:{
            type: [Array]
        },
        workJson:{
            type: [Object, Array]
        },
        // tipObj:{
        //     type: [Object, Array]
        // },
    },
    data() {
        const { id='10' } = this.$route.query;
        return {
            navModel: '',
            currentMode: 'Panorama',
            typeFloor: null,
            guideListHide: false,
            path: [],
            tipObj: null
        }
    },
    computed: {
        floorList() {
            let floorSet = new Set();
            this.list.forEach(it => {
                floorSet.add(it.floorIndex)
            })
            return [...floorSet.values()].sort();
        },
        items() {
           if (this.typeFloor == null) {
                return this.list;
            }
            return this.list.filter(it => {
                return it.floorIndex == this.typeFloor;
            }) 
        }
    },
    watch:{
        navModel(newVal,oldVal){
            if (!newVal) {
                this.outNavModel();
            }
        }
    },
    created() {
        this.five.changeMode("Panorama");
        this.initPoint()
        this.five.on("wantsChangeMode", (mode) => {
            if (mode != "Panorama") {
                this.outNavModel();
            }
        })
        this.five.on("panoWillArrive", () => {
            // console.log(five.state.panoIndex)
            // 导航模式
            if (this.guideListHide) {
                prevNavPointIndex = this.five.state.panoIndex;
            }
        })

        this.five.on("panoArrived", () => {
            // 导航模式
            if (this.guideListHide) {
                let toIndex = this.path[this.path.length - 1];
                let ctNavPoint = this.list.filter(it => {
                    return it.panoIndex == this.five.state.panoIndex;
                })[0];
                let prevNavPoint = prevNavPointIndex === null ? null : this.list.filter(it => {
                    return it.panoIndex == prevNavPointIndex;
                })[0];

                if (toIndex == this.five.state.panoIndex) {
                    this.tipObj = {
                        text: "到达目的地！已退出导航模式。",
                        delay: 5000
                    };
                    this.outNavModel();
                    setTimeout(() => {
                        if (ctNavPoint?.point) {
                            let { x, y, z } = ctNavPoint.point;
                            cameraToVec3([x, y, z], this.five);
                        }
                    }, 300)
                    return false;
                }
                else {
                    console.log("nav to again")
                    this.navTo(toIndex)
                }
                // 点位镜头指向(进入需要，出link点不需要指向)
                // 连接引导点
                if (ctNavPoint?.link && (!prevNavPoint?.link || ctNavPoint?.link.group != prevNavPoint?.link.group)) {
                    setTimeout(() => {
                        let { x, y, z } = ctNavPoint.point;
                        cameraToVec3([x, y, z], this.five);
                        this.tipObj = {
                            text: ctNavPoint.tip || linkTypeTipMap[ctNavPoint.link.type].replace('${floor}', +this.workJson.observers[this.path[1]].floor_index + 1),
                            delay: 5000
                        };
                    }, 300)
                }
            }
        })
    },
    methods:{
        guideAnmateSet({ five, gd_mesh, start, end, }){
            gd_mesh.rotation.x = Math.PI / 2;
            let s1 = new THREE.Vector3(
                end.standing_position[0] - start.standing_position[0],
                0,
                end.standing_position[2] - start.standing_position[2] ,
            );
            let s2 = new THREE.Vector3(0, 0, 1);
            let ag = s1.angleTo(s2);
            s1.cross(s2);
            gd_mesh.rotation.z = s1.y > 0 ? ag : -ag;
            gd_mesh.position.set(...start.standing_position);
            setTimeout(() => {
                cameraToVec3(end.standing_position, five);
            }, 200)
        },
        initPoint() {
            // 斑马方向箭头
            gd_mesh = null;
            gd_geometry = new THREE.PlaneBufferGeometry(2, 30);
            gd_texture = new THREE.TextureLoader().load(wayDirImg);
            gd_texture.wrapS = THREE.RepeatWrapping;
            gd_texture.wrapT = THREE.RepeatWrapping;

            gd_texture.needsUpdate = true;
            gd_texture.repeat.set(1, 20);
            gd_material = new THREE.MeshBasicMaterial({
                transparent: true,
                color: 0x00a142,
                side: THREE.DoubleSide,
                map: gd_texture,
            });
            gd_material.opacity = 0.3;
            gd_material.visible = false;
            gd_mesh = new THREE.Mesh(gd_geometry, gd_material);
            gd_mesh.rotation.x = Math.PI / 2;
            this.five.scene.add(gd_mesh)

            // 终点标识
            endPointMt = new THREE.SpriteMaterial({
                map: new THREE.TextureLoader().load(endPointImg),
                depthWrite: false,
            });
            endPointIcon = new THREE.Sprite(endPointMt);
            endPointMt.visible = false;
            endPointIcon.scale.set(0.5, 0.5);
            this.five.scene.add(endPointIcon);

            function gd_animate() {
                requestAnimationFrame(gd_animate);
                gd_texture.offset.y -= 0.01;
            }
            gd_animate();
        },
        outNavModel(){
            prevNavPointIndex = null;
            this.guideListHide = false;
            gd_mesh.visible = false;
            gd_geometry.dispose();
            gd_material.dispose();
            this.five.scene.remove(gd_mesh)
            this.navModel = false;
            endPointMt.visible = false;
        },
        getRoad({ observers, currentIndex, goalIndex, }){
            console.log(observers)
            let pathMap = {};
            for (let item of observers) {
                let pointPathMap = {};
                for (let it of item.accessible_nodes) {
                    let dis = (new THREE.Vector3(...item.standing_position)).distanceTo(new THREE.Vector3(...observers[it].standing_position));
                    // 连接点类型距离*类型系数
                    let stdPoint = this.list.find(otem => otem.panoIndex == item.index);
                    let edPoint = this.list.find(otem => otem.panoIndex == observers[it].index);
                    if (stdPoint && edPoint && stdPoint.link?.type == edPoint.link?.type) {
                        dis = linkTypeDisMap[+stdPoint.link?.type] * dis;
                    }
                    pointPathMap['' + it] = dis;
                }
                pathMap['' + item.index] = pointPathMap;
            }
            // console.log(pathMap)
            let graph = new Graph(pathMap);
            let result = graph.findShortestPath('' + currentIndex, '' + goalIndex);
            console.log(result)
            if (result.length <= 1) {
                throw new Error("你当前就在目标点位上！")
            }
            return result.map(it => +it);
        },

        navTo(panoIndex){
            let ctNavPoint = this.list.filter(it => {
                return it.panoIndex == this.five.state.panoIndex;
            })[0];
            try {
                // 将连接点位（同组电梯等）可访问列表补全
                let obsList = [...this.workJson.observers];
                // console.log(obsList)
                // console.log(this.list)
                for (let item of this.list) {
                    for (let it of this.list) {
                        if (item.panoIndex != it.panoIndex && item.link && item.link?.group == it.link?.group) {
                            obsList[item.panoIndex].accessible_nodes.push(it.panoIndex);
                        }
                    }
                }
                console.log(obsList)
                this.path = this.getRoad({
                    observers: obsList,
                    currentIndex: this.five.state.panoIndex,
                    goalIndex: panoIndex,
                })
                console.log(this.path)
                if (this.path.length == 0) {
                    throw Error("无法达到目的地！")
                }
                this.guideListHide = true;

                endPointIcon.position.set(...this.workJson.observers[this.path[this.path.length - 1]].standing_position);
                endPointIcon.geometry.computeBoundingBox()
                let bound = endPointIcon.geometry.boundingBox;
                endPointIcon.translateY(-bound.min.y * endPointIcon.scale.y)
                gd_material.visible = true;
                endPointMt.visible = true;
                let nextNavPoint = this.list.filter(it => {
                    return it.panoIndex == this.path[1];
                })[0];
                if (ctNavPoint?.link && nextNavPoint?.link && ctNavPoint?.link.group == nextNavPoint?.link.group) {
                    setTimeout(() => {
                        let { x, y, z } = ctNavPoint.point;
                        cameraToVec3([x, y, z], this.five);
                    }, 300)
                }
                else {
                    this.guideAnmateSet({
                        five:this.five,
                        gd_mesh,
                        start: this.workJson.observers[this.five.panoIndex],
                        end: this.workJson.observers[this.path[1]]
                    })
                }
            }
            catch (e) {
                console.log(e)
                this.tipObj = {
                    type: "warn",
                    text: e
                }
            }

        },
        goNextPathPoint(){
            this.five.moveToPano(this.path[1]);
        },
        handleClose() {
            this.$emit('updateRoomsListShow', false)
        }
    }
}
</script>

<style lang="scss" scoped>
    @import './index.scss';
</style>