<template>
    <div class="vr">
        <header class="vr__header">
            <MenuHeader />
        </header>
        <main class="vr__main">
            <div class="vr__left">
                <MenuLeft :enumCrm="enumCrm" />
            </div>
            <div class="vr__center">
                <div class="vr__five">
                    <div id="appCVS" ref="appCVS" class="appCVS">
                        <!-- footer-bar -->
                        <ModeMenuTab
                            :five="five"
                            @updateRoomsListShow="updateRoomsListShow"
                            @updateRoomsShow="updateRoomsShow"
                        />
                        <template v-if="showSnapshoot">
                            <template v-for="it in tagList">
                                <TagFloat
                                    v-if="!it.isEdit"
                                    :key="it.id"
                                    :info="it"
                                    :five="five"
                                />
                            </template>
                        </template>

                        <template v-if="showSnapshoot">
                            <template v-for="it in contentList">
                                <RadarFloat
                                    v-if="!it.isEdit"
                                    :key="'radar'+it.id"
                                    :info="it"
                                    :five="five"
                                />
                            </template>
                        </template>

                        <template v-if="showSnapshoot">
                            <template v-for="(it,index) in pointList">
                                <NavigationFloat
                                    :key="index+'point'"
                                    :info="it"
                                    :five="five"
                                />
                            </template>
                        </template>

                        <StandGuide :five="five" />

                        <!-- 切换楼层浮漂 -->
                        <SceneTab :five="five" :workJson="workJson" />
                        
                        <transition
                            name="fadeIn"
                            enter-active-class="animate__animated an_dur500 animate__zoomIn"
                            leave-active-class="animate__animated an_dur500 animate__zoomOut"
                        >
                            <!-- 指引导航 -->
                            <!-- <NavGuide
                                v-if="navModel"
                                :five="five"
                                :list="navGuideList"
                                :workJson="workJson"
                                @updateRoomsListShow="updateRoomsListShow"
                            /> -->
                        </transition>
                        <!-- 分馆 -->
                        <!-- <transition
                            name="fadeIn"
                            enter-active-class="animate__animated an_dur500 animate__fadeInDown"
                            leave-active-class="animate__animated an_dur500 animate__fadeOutUp"
                        >
                            <div v-if="roomsListShow" class="roomsWrap bgBlur5">
                                <a
                                    v-for="it in roomList"
                                    :key="it.id"
                                    :href="'/?id=' + id + '&code=' + it.id"
                                    :class="code == it.id && 'current'"
                                    :style="{
                                        backgroundImage:
                                            'url(' + it.cover + ')',
                                    }"
                                    v-html="it.title"
                                >
                                    {{ it.title }}
                                </a>
                                <i
                                    class="iconfont close"
                                    @click="roomsListShow = false"
                                    >&#xe7dc;</i
                                >
                            </div>
                        </transition> -->
                    </div>
                    <!-- 户型图相关 -->
                    <div
                        class="floorplanWrapper"
                        @click="changeMode"
                    ></div>
                    <div class="topview_floorplan_wrap">
                        <div
                            class="topview_floorplan"
                            id="topview_floorplan"
                        ></div>
                    </div>
                </div>
                <!-- <footer class="vr__center__footer">
                    <MenuFooter :five="five" />
                </footer> -->
            </div>
            <div class="vr__right">
                <MenuRight :enumCrm="enumCrm" :floorIndex="floorIndex" :five="five" />
            </div>
        </main>
    </div>
</template>

<script>
import * as THREE from "three";
import { Five } from "@realsee/five";
import { CSS3DRenderPlugin } from "@realsee/dnalogel/plugins/CSS3DRenderPlugin";
import ModelTVVideoPlugin from "@realsee/dnalogel/plugins/ModelTVVideoPlugin";
import PanoFloorplanRadarPlugin from "@realsee/dnalogel/plugins/floorplan/PanoFloorplanRadarPlugin";
import TopviewFloorplanPlugin from "@realsee/dnalogel/plugins/floorplan/TopviewFloorplanPlugin";
import TreasurePlugin from "@realsee/dnalogel/plugins/TreasurePlugin";
import PanoCursorRaycasterPlugin from '@realsee/dnalogel/plugins/PanoCursorRaycasterPlugin'
import { getCrmEnum } from '@/api/common';

import {
    getVrById,
    getVrSceneTagList,
    getVrScenePointList,
    getVrFloorPlanById,
    getVrSceneContentList,
} from "@/api/fiveVR";
import ModeMenuTab from "./components/ModeMenuTab/index";
import TagFloat from "./components/TagFloat/index";
import RadarFloat from "./components/RadarFloat/index";
import NavigationFloat from "./components/NavigationFloat/index";
import StandGuide from "./components/StandGuide/index";
import SceneTab from "./components/SceneTab/index";
// import NavGuide from "./components/NavGuide/index";
import MenuLeft from "./components/MenuLeft/index";
import MenuRight from "./components/MenuRight/index";
import MenuFooter from "./components/MenuFooter/index";
import MenuHeader from "./components/MenuHeader/index";
import { mapState, mapActions } from 'vuex'

let five = null;

export default {
    name: "FiveVR",
    components: {
        ModeMenuTab,
        // NavGuide,
        TagFloat,
        RadarFloat,
        NavigationFloat,
        StandGuide,
        SceneTab,
        MenuLeft,
        MenuRight,
        MenuFooter,
        MenuHeader,
    },
    data() {
        const { id = "10" } = this.$route.query;
        return {
            workJson: {},
            groupId: "", // 场景组id
            sceneId: "", // 场景id
            code: "Ug",
            sid: "16935",
            tabValue: id,
            five: null,
            navModel: false,
            roomsListShow: false,
            roomList: [],
            tagList: [],
            pointList: [],
            isEdit: false,
            enumCrm: [],
            floorIndex: null,
            navGuideList: [],
            contentList: [],
            showSnapshoot: true,
        };
    },
    computed: {
        ...mapState('vr', [
            'menuList',
        ]),
    },
    created() {
        const { groupId, id } = this.$route.query;
        this.crmEnum()
        this.groupId = groupId;
        this.sceneId = id;
        five = new Five({
            antialias: false, //抗锯齿
            onlyRenderIfNeeds: true, // 只加载所需
            poweredByRealsee: false, //logo露出
            plugins: [
                [CSS3DRenderPlugin, "css3DRender", {}],
                [ModelTVVideoPlugin, "modelTVVideoPlugin", {}],
                [
                    PanoFloorplanRadarPlugin,
                    "panoFloorplanRadar",
                    { wrapper: ".floorplanWrapper", hoverEnable: true },
                ],
                [
                    TopviewFloorplanPlugin,
                    "topviewFloorplan",
                    { selector: "#topview_floorplan", scale: 0.1 },
                ],
                [TreasurePlugin, "treasurePlugin"],
                [PanoCursorRaycasterPlugin, "panoCursorRaycasterPlugin", {
                    enable: true,
                    pointAxesHelperEnable: true,
                    movePointTowradsCameraEnable: true,
                    dashLineFollowCursor: true,
                }],
            ],
        });
        this.five = five;
        window.addEventListener("resize", () => {
            five.appendTo(document.getElementById("appCVS"));
            var axisHelper = new THREE.AxesHelper(250);
            five.scene.add(axisHelper);
            this.five.refresh()
        });

        this.$nextTick(() => {
            five.appendTo(document.getElementById("appCVS"));
            var axisHelper = new THREE.AxesHelper(250);
            five.scene.add(axisHelper);
        });
        
        getVrById({ id: this.sceneId }).then((res) => {
            this.workJson = res.data;
            this.floorIndex = res.data?.observers
            five.load(res.data, {
                fov: 90,
            });
            this.getFlorrPlan();
            this.getTagList();
            this.getVrScenePointList();
            this.getVrSceneContentList()
            this.setFloorIndex()
        });

        

        this.getVrGroupMenuList({ group_id: this.groupId })

        five.on("panoArrived", (panoIndex) => {
        });
        this.$bus.$on('refreshTagList', ({ isEdit=false, isFetch=false, item=null }) => {
            this.isEdit = isEdit
            if (!isEdit) {
                this.tagList = this.tagList.map(it => {
                    it.isEdit = false
                    return it
                })
            }
            if (isFetch) {
                this.getTagList()
                this.getVrSceneContentList()
            }
            if (isEdit && item) {
                const currentIndex = this.tagList.findIndex(it => it.id == item.id)
                const currentItem = this.tagList[currentIndex]
                currentItem.isEdit = true
                this.$set(this.tagList, currentIndex, currentItem)
            }
        })
        this.$bus.$on('refreshNavigationPoint', () => {
            this.getVrScenePointList()
        })
        this.$bus.$on('refreshPlaneList', ({ isEdit=false, isFetch=false, item=null }, isRefresh=false) => {
            if (isFetch) {
                this.getVrSceneContentList()
            }
        })
        this.$bus.$on('emitShowSnapshoot', (val) => {
            this.showSnapshoot = val
        })
    },
    methods: {
        ...mapActions('vr', [
            'getVrGroupMenuList'
        ]),
        crmEnum(){
            getCrmEnum({module_name:'vr'}).then((res={})=>{
                this.enumCrm = res
            })
        },
        changeTab(v) {
            this.tabValue = v.name;
        },
        updateRoomsListShow(val) {
            this.navModel = val;
        },
        updateRoomsShow(val) {
            this.roomsListShow = val;
        },
        // 获取户型图
        async getFlorrPlan() {
            getVrFloorPlanById({ id: this.sceneId }).then(data => {
                const res = data.data
                const panoFloorplanRadar = this.five.plugins.panoFloorplanRadar;
                panoFloorplanRadar.load(res);
                const topviewFloorplan = this.five.plugins.topviewFloorplan;
                topviewFloorplan.load(res);
            })
        },
        // 获取标签数据
        async getTagList() {
            getVrSceneTagList({
                group_id: this.groupId,
                vr_id: this.sceneId
            }).then((res) => {
                this.tagList = res.list;
            });
        },
        getVrScenePointList() {
            getVrScenePointList({
                group_id: this.groupId,
                vr_id: this.sceneId
            }).then(res => {
                this.pointList = res.list
            })
        },
        changeMode() {
            this.five.changeMode('Floorplan')
        },
        getVrSceneContentList() {
            const { groupId, id } = this.$route.query;
            getVrSceneContentList({
                group_id: groupId,
                vr_id: id,
            }).then((res) => {
                const arr = []
                res.list.map(item => {
                    if (item.extra.trigger_type == 1) {
                        arr.push(item)
                    }
                })
                this.contentList = arr;
            });
        },
        setFloorIndex() {
            // 添加索引标记
            this.workJson.observers.map((it) => {
                var canvas = document.createElement("canvas");
                canvas.width = 100;
                canvas.height = 100;
                var ctx = canvas.getContext("2d");
                // ctx.fillStyle = "white";
                // ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#ff0000";
                ctx.font = "bold 40px 宋体";
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.fillText(it.index, 30, 30);
                // 使用canvas作为texture
                var texture = new THREE.CanvasTexture(canvas);
                // texture.repeat.set(10, 10);
                // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                var material = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    side: THREE.DoubleSide,
                });
                var guideMark = new THREE.Sprite(material);
                guideMark.name = "num_mark" + new Date() + Math.random();
                guideMark.rotation.x = -Math.PI / 2;
                guideMark.position.set(...it.standing_position);
                this.five.scene.add(guideMark);
            });
        },
    },
};
</script>

<style>
.tag {
    position: absolute;
    width: 0;
    height: 0;
    transform: translateZ(0);
}
.tag-pannel {
    position: absolute;
    width: 100px;
    min-height: 20px;
    transform: translate(-50%, 0);
    left: 50%;
    bottom: 10px;
    background: #333;
    color: #fff;
    border-radius: 2px;
    text-align: center;
    line-height: 20px;
    padding: 8px;
    font-size: 14px;
}
.tag-pannel:after {
    content: "";
    display: block;
    position: absolute;
    width: 10px;
    height: 10px;
    left: 50%;
    bottom: -5px;
    transform: translate(-50%, 0) rotate(45deg);
    background: #333;
    pointer-events: none;
}
.tag-finger{
    height: 15px;
    width: 20px;
    background: url('./assets/img/point.svg') center no-repeat;
    background-size: cover;
    transform: rotate(145deg);
}
.panoCursor{
    position: absolute;
    width: 0;
    height: 0;
    transform: translateZ(0);
}
.panoCursor-point{
    width:22px;
    height: 22px;
    border: 2px solid #333;
    border-radius: 50% 50%;
    transform: translate(-50%, -50%);
}
.vr--required:before{
    content: '*';
    color: #ff4949;
    margin-right: 4px;
    display: inline;
}
</style>

<style scoped lang="scss">
@import "./index.scss";
</style>
