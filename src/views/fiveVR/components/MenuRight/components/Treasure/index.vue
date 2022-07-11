<template>
    <div class="vr__tag">
        <div v-show="!showDetail" class="vr__tag__list">
            <div class="vr__tag__adds">
                <div class="vr__tag__adds__btn" @click="handleAdd">新增宝箱 +</div>
            </div>
            <div>
                <section class="vr__tag__list__item" v-for="(item, index) in list" :key="'media'+index">
                    <div 
                        class="vr__tag__list__acatar" 
                        :style="'background-image:url('+ (item && item.extra && item.extra.info && item.extra.info.model && item.extra.info.model)+')'"
                        @click="handlePanoIndex(item)"
                    >
                    </div>
                    <div class="vr__tag__list__content">
                        <span class="vr__tag__list__title">{{item.desc}}</span>
                        <span></span>
                    </div>
                    <div class="vr__tag__list__action">
                        <i
                            class="el-icon-edit"
                            style="
                                color: #1890ff;
                                padding-left: 6px;
                                cursor: pointer;
                            "
                            @click="handleEdit(item)"
                        ></i>
                        <i
                            class="el-icon-delete"
                            style="
                                color: red;
                                padding-left: 6px;
                                cursor: pointer;
                            "
                            @click="handleDel(item)"
                        ></i>
                    </div>
                </section>
            </div>
        </div>
        <div v-show="showDetail" class="vr__tag__relative">
            <div class="vr__tag__edit__title">
                <div class="vr__tag__edit__title__txt">编辑宝箱</div>
                <i class="el-icon-close" style="font-size: 22px;cursor: pointer;" @click="handleClose"></i>
            </div>
            
            <el-form
                ref="ruleForm"
                size="mini"
                :model="ruleForm"
                :rules="rules"
                label-position="top"
                class="demo-ruleForm"
            >
                <!-- 取点坐标值 -->
                <AxisPoint pointType="finger" :five="five" :initAxis="initAxis" @changePoint="changePoint" />

                <el-form-item
                    label="模型类型"
                    prop="tapType"
                    class="vr__edit__label"
                >
                    <el-radio-group v-model="ruleForm.tapType">
                        <el-radio label="link">超链接</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    label="标题"
                    prop="name"
                    class="vr__edit__label"
                >
                    <el-input
                        type="input"
                        v-model="ruleForm.name"
                        placeholder="请输入标题"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="链接地址"
                    prop="url"
                    class="vr__edit__label"
                >
                    <el-input
                        type="input"
                        v-model="ruleForm.url"
                        placeholder="请输入链接地址"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="介绍"
                    prop="desc"
                    class="vr__edit__label"
                >
                    <el-input
                        type="textarea"
                        v-model="ruleForm.desc"
                        placeholder="请填写介绍"
                    ></el-input>
                </el-form-item>
                
                
                <div class="vr__tag__submit">
                    <el-button @click="handleClose"
                        >取消</el-button
                    >
                    <el-button type="primary" @click="submitForm('ruleForm')"
                        >保存</el-button
                    >
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import * as THREE from "three";
import {
    getVrSceneContentList,
    uploadUrl,
    editVrSceneContent,
    delVrSceneContent,
} from "@/api/fiveVR";
import { cameraToVec3, calcCenterPoint } from '@/views/fiveVR/assets/js/tools'
import UploadAll from "@/components/UploadAll/index";
import AxisPoint from "../Axis/index";
import Rectangle from "../A-Rectangle/index";
import { matchType } from '../Tag/matchFileType'

import { ARVideoFigureScene } from "@realsee/dnalogel/components/ARVideoFigure/ARVideoFigureScene.js"
import { GLTFLoader } from "@realsee/five/gltf-loader"
import arVideoSrc from "../../../../assets/img/green1.mp4";


export default {
    name: "TreasureEdit",
    components: {
        UploadAll,
        AxisPoint,
        Rectangle,
    },
    props: {
        five: {
            type: [Object, Array],
        },
        type: {
           type: [Number, String], 
        },
        enumCrm: {
           type: [Object], 
        }
    },
    data() {
        return {
            uploadUrl: uploadUrl,
            groupId: "",
            sceneId: "",
            showDetail: false,
            list: [],
            ruleForm: {
                name: "",
                desc: "",
                id: '',
                link: '',
                tapType: 'link',
            },
            rules: {
                desc: [
                    {
                        required: true,
                        message: "请输入描述内容",
                        trigger: "blur",
                    },
                ],
            },
            position: [], // 取点坐标
            initAxis: null,
            isEdit: false,
            panoIndex: null,
            extra: {},
            arv: null,
            group: null,
            infoId: '',
        };
    },
    created() {
        const { groupId, id } = this.$route.query;
        this.groupId = groupId;
        this.sceneId = id;
        this.getVrSceneContentList();
        this.five.on("panoArrived", (panoIndex) => {
            this.panoIndex = panoIndex
        });
        this.$bus.$on('clickEditPoint', this.clickEditPoint)
        this.$bus.$on('vrTabEditChange', this.handleClose)
    },
    mounted() {
        this.$nextTick(() => {
            this.arv = new ARVideoFigureScene(document.getElementById("arVideo"));
            this.endCallback = null;
            // this.arv.videoInstance.onended = () => {
            //     this.five.scene.remove(this.arv.mesh);
            //     this.endCallback && this.endCallback();
            //     this.endCallback = null;
            // }
        })
    },
    methods: {
        submitForm(formName) {
            let params = {}
            if (this.showDetail) {
                const {
                    id, // 有id则是修改，否则是新增
                    desc,
                    files,
                    link
                } = this.ruleForm
                if (!this.position.length) {
                    this.$message.error('请先取点！')
                    return
                }
                const extra = {
                    type: this.type,
                    position: this.position || '',
                    info: {
                        panoIndex: this.panoIndex,
                        tapType: this.ruleForm.tapType || 'link',
                        name: this.ruleForm.name,
                        link: this.ruleForm.link,
                        id: this.infoId,
                    }
                }
                params = {
                    id: id || '',
                    group_id: this.groupId,
                    vr_id: this.sceneId,
                    desc: desc || '',
                    type: this.type,
                    extra: JSON.stringify(extra)
                    // extra
                }
            }
            console.log(666661, params)
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    editVrSceneContent(params).then(res => {
                        this.$message.success('操作成功!')
                        this.handleClose()
                        this.emitRefreshList(false, true)
                        this.emitRefreshItem()
                        this.getVrSceneContentList()
                    })
                }
            });
        },
        resetForm() {},
        handleAdd() {
            this.showDetail = true;
            this.isEdit = true;
            this.ruleForm = {
                tapType: 'link',
            }
            this.position = []
            this.initAxis = null
            this.emitRefreshList(this.isEdit, false)
        },
        handleEdit(val) {
            this.handleClose()
            let item = _.cloneDeep(val)
            this.showDetail = true;
            this.isEdit = true;
            this.$set(this.ruleForm, 'desc', item.desc)
            this.$set(this.ruleForm, 'id', item.id || '')
            this.$set(this.ruleForm, 'tapType', item.extra.info.tapType || 'link')
            this.$set(this.ruleForm, 'name', item.extra.info.name || '')
            this.panoIndex = item.extra.info.panoIndex
            const [x,y,z] = item.extra.position
            this.position = item.extra.position
            this.infoId = item.extra.info.id || ''
            this.initAxis = {x,y,z}
            this.emitRefreshList(this.isEdit, false, item)
            this.initLv()
        },
        handleDel(item) {
            this.$confirm('确定删除该数据?, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delVrSceneContent({
                    id: item.id
                }).then(() => {
                    this.$message.success('删除成功!')
                    this.emitRefreshList(false, true)
                    this.getVrSceneContentList()
                })
            }).catch(() => {
            })
        },
        getVrSceneContentList() {
            getVrSceneContentList({
                group_id: this.groupId,
                vr_id: this.sceneId,
                type: this.type
            }).then((res) => {
                this.list = res.list;
            });
        },
        
        handleClose() {
            this.showDetail = false;
            this.isEdit = false
            this.emitRefreshList(this.isEdit, false)
            this.emitRefreshItem()
        },
        // 刷新主页TagFloat
        emitRefreshList(isEdit=false,isFetch=false, item=null) {
            this.group && this.five.scene.remove(this.group);
            this.$bus.$emit('refreshPlaneList', { isEdit, isFetch: isFetch, item })
        },
        // 刷新单个tag
        emitRefreshItem() {
            this.$bus.$emit('refreshTagItem')
        },
        handlePanoIndex(item) {
            const panoIndex = item.extra.info.panoIndex
            // const points = item.extra.info.points
            // const {x,y,z} = calcCenterPoint(points)
            // const position = [x,y,z]
            this.five.moveToPano(panoIndex)
            setTimeout(() => {
                cameraToVec3(this.position, this.five)
            }, 3000)
        },
        clickEditPoint({type, index, info}) {
            if (this.list.some(item => item.id == info.id)) {
                this.$emit('tabChange', type)
                this.handleEdit(info)
            }
        },
        changePoint(position, panoIndex) {
            const { x,y,z } = position
            this.position = [x,y,z]
            // this.panoIndex = panoIndex
            this.initLv()
        },
        async initLv() {
            this.group && this.five.scene.remove(this.group);
            const infoId = this.infoId || Math.floor(Math.random() * 100000000000)
            this.infoId = infoId
            const treasureBox = this.five.plugins.treasurePlugin;
            const box = {
                position: this.position,
                id: this.infoId,
                type: 2
            }
            treasureBox.load({ treasures: [box] }, ({ scene }) => {
            })
        },
        changeScale(val) {
            this.initLv()
        },
        changeUniforms(val) {
            this.initLv()
        },
    },
};
</script>

<style>
    .el-radio__label{
        color: #fff;
    }
</style>

<style scoped lang="scss">
    @import '../Tag/index.scss';
</style>
