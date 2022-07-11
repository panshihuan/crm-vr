<template>
    <div class="vr__tag" v-loading="loading">
        <div v-show="!showDetail" class="vr__tag__list">
            <div class="vr__tag__adds">
                <div class="vr__tag__adds__btn" @click="handleAdd">新增3D模型 +</div>
            </div>
            <div>
                <section class="vr__tag__list__item" v-for="(item, index) in list" :key="'media'+index">
                    <div 
                        class="vr__tag__list__acatar" 
                        :style="'background-image:url('+ imgEdit+')'"
                        @click="handlePanoIndex(item)"
                    >
                    </div>
                    <div class="vr__tag__list__content">
                        <span class="vr__tag__list__title" @click="handlePanoIndex(item)">{{item.desc}}</span>
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
                <div class="vr__tag__edit__title__txt">编辑3D模型</div>
                <i class="el-icon-close" style="font-size: 22px;cursor: pointer;" @click="handleCancel"></i>
            </div>
            
            <el-form
                ref="ruleForm"
                size="mini"
                :model="ruleForm"
                :rules="rules"
                label-position="top"
                class="demo-ruleForm"
            >
                <el-form-item
                    label="上传模型文件"
                    prop="files"
                    class="vr__edit__label vr--required"
                >
                    <UploadAll
                        v-model="ruleForm.files"
                        :uploadUrl="uploadUrl"
                        uploadText="上传模型文件"
                        maxFile=200
                        listType="text"
                        @change="changeUpload"
                    />
                </el-form-item>

                <!-- 取点坐标值 -->
                <AxisPoint pointType="finger" :showDetail="showDetail" :five="five" :initAxis="initAxis" @changePoint="changePoint" />

                <el-form-item
                    label="缩放比例"
                    prop="scale"
                    class="vr__edit__label"
                >
                    <el-input
                        v-model="ruleForm.scale"
                        placeholder="1"
                        @input="changeScale"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="Y轴旋转角度"
                    prop="rotateY"
                    class="vr__edit__label"
                >
                    <!-- <el-input
                        type="input"
                        v-model="ruleForm.rotateY"
                        placeholder="1"
                        @input="changeUniforms"
                    ></el-input> -->
                    <el-slider v-model="ruleForm.rotateY" :min="min" :max="max" :step="step" @change="changeUniforms"></el-slider>
                </el-form-item>
                <el-form-item
                    label="模型类型"
                    prop="tapType"
                    class="vr__edit__label"
                >
                    <el-radio-group v-model="ruleForm.tapType">
                        <el-radio label="text">文字提示</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    label="动画形式"
                    prop="animate"
                    class="vr__edit__label"
                >
                    <el-radio-group v-model="ruleForm.animate">
                        <el-radio label="">无动画</el-radio>
                        <el-radio label="rotateY">旋转</el-radio>
                        <el-radio label="jump">跳动</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    label="提示内容"
                    prop="text"
                    class="vr__edit__label"
                >
                    <el-input
                        type="input"
                        v-model="ruleForm.text"
                        placeholder="请输入提示内容"
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
                <el-form-item
                    label="关联菜单"
                    prop="menu_id"
                    class="vr__edit__label"
                >
                    <el-select v-model="ruleForm.menu_id" filterable placeholder="请选择">
                        <el-option
                            v-for="(item, index) in menuList"
                            :key="index+'loca'"
                            :label="item.name"
                            :value="item.id"
                        >
                            <span :style="item.p_id ? 'padding-left: 20px;font-size: 12px;': ''">{{ item.name }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                
                <div class="vr__tag__submit">
                    <el-button @click="handleCancel"
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
import { mapState } from 'vuex'
import imgEdit from '@/assets/img/noData.png'
import { moveAndCamera } from '@/utils/moveAndCamera'


export default {
    name: "ModelEdit",
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
            loading: false,
            uploadUrl: uploadUrl,
            groupId: "",
            sceneId: "",
            showDetail: false,
            list: [],
            ruleForm: {
                name: "",
                desc: "",
                id: '',
                scale: 1,
                rotateY: 0,
                tapType: 'text',
                animate: '',
            },
            min: 0,
            max: 2,
            step: 0.01,
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
            currentItem: null,
            imgEdit: imgEdit,
        };
    },
    computed: {
        ...mapState('vr', [
            'menuList',
        ]),
    },
    created() {
        const { groupId, id } = this.$route.query;
        this.groupId = groupId;
        this.sceneId = id;
        this.getVrSceneContentList();
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
                if (!this.position?.length) {
                    this.$message.error('请先取点！')
                    return
                }
                if ( !files.length) {
                    this.$message.error('请上传模型文件！')
                    return
                }
                const extra = {
                    type: this.type,
                    position: this.position || '',
                    info: {
                        model: files[0]?.url,
                        src_name: files[0]?.name,
                        panoIndex: this.panoIndex,
                        scale: this.ruleForm.scale,
                        rotateY: this.ruleForm.rotateY,
                        animate: this.ruleForm.animate,
                        tapType: this.ruleForm.tapType || 'text',
                        text: this.ruleForm.text,
                        id: this.infoId,
                    }
                }
                // extra.info.model = 'httpS://wk5.bookan.com.cn/static/ar_demo1.glb'   // 测试用
                params = {
                    id: id || '',
                    group_id: this.groupId,
                    vr_id: this.sceneId,
                    desc: desc || '',
                    type: this.type,
                    menu_id: this.ruleForm.menu_id || '',
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
                scale: 1,
                rotateY: 0,
                tapType: 'text',
                animate: '',
            }
            this.position = []
            this.initAxis = null
            this.emitRefreshList(this.isEdit, false)
        },
        handleEdit(val) {
            this.handleClose()
            let item = _.cloneDeep(val)
            this.currentItem = item
            this.showDetail = true;
            this.isEdit = true;
            this.$set(this.ruleForm, 'desc', item.desc)
            this.$set(this.ruleForm, 'id', item.id || '')
            this.$set(this.ruleForm, 'scale', item.extra.info.scale || 1)
            this.$set(this.ruleForm, 'rotateY', item.extra.info.rotateY || 0)
            this.$set(this.ruleForm, 'tapType', item.extra.info.tapType || 'text')
            this.$set(this.ruleForm, 'animate', item.extra.info.animate || '')
            this.$set(this.ruleForm, 'menu_id', item.menu_id || '')
            this.$set(this.ruleForm, 'text', item.extra.info.text || '')
            this.panoIndex = item.extra.info.panoIndex
            const [x,y,z] = item.extra.position
            this.position = item.extra.position
            this.infoId = item.extra.info.id || ''
            this.initAxis = {x,y,z}
            const files = [{
                url: item.extra.info.model,
                name: item.extra.info.src_name
            }]
            this.$set(this.ruleForm, 'files', files)
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
            this.loading = true
            getVrSceneContentList({
                group_id: this.groupId,
                vr_id: this.sceneId,
                type: this.type
            }).then((res) => {
                this.loading = false
                this.list = res.list;
            }).catch(() => {
                this.loading = false
            })
        },
        handleClose() {
            this.showDetail = false;
            this.isEdit = false
            this.emitRefreshList(this.isEdit, false)
            this.emitRefreshItem()
        },
        handleCancel() {
            this.showDetail = false;
            this.isEdit = false
            this.emitRefreshList(this.isEdit, false, null, true)
            this.emitRefreshItem()
        },
        // 刷新主页TagFloat
        emitRefreshList(isEdit=false,isFetch=false, item=null, isRefresh=false) {
            this.group && this.five.scene.remove(this.group);
            this.$bus.$emit('refreshPlaneList', { isEdit, isFetch: isFetch, item }, isRefresh)
        },
        // 刷新单个tag
        emitRefreshItem() {
            this.$bus.$emit('refreshTagItem')
        },
        handlePanoIndex(item) {
            const panoIndex = item.extra.info.panoIndex
            moveAndCamera(item, this.five, panoIndex, item.position)
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
            this.panoIndex = panoIndex
            this.initLv()
        },
        changeUpload() {
            this.initLv()
        },
        async initLv() {
            this.group && this.five.scene.remove(this.group);
            if (!this.ruleForm.files?.length) {
                this.$message.error('请先上传模型文件')
                return
            }
            if (!this.position?.length) {
                return
            }
            let loader = new GLTFLoader();
            let model = this.ruleForm.files?.length ? this.ruleForm.files[0]?.url : 'httpS://wk5.bookan.com.cn/static/ar_demo1.glb'
            loader.load(model, ({ scene }) => {
                const scale = this.ruleForm.scale
                let gp = new THREE.Group();
                gp.position.set(...this.position);
                scene.scale.set(scale, scale, scale);
                scene.rotateY(Math.PI * this.ruleForm.rotateY);
                const infoId = this.infoId || Math.floor(Math.random() * 100000000000)
                this.infoId = infoId
                scene.name = "object3d_" + infoId;
                gp.add(scene);
                this.group = gp;
                this.five.scene.add(gp);
            })
            setTimeout(() => {
                this.five.refresh()
            }, 200)
        },
        changeScale(val) {
            const scale = +val
            // this.$set(this.ruleForm, 'scale', scale)
            // this.arv.mesh.scale.set(scale, scale, scale)
            this.initLv()
        },
        changeUniforms(val) {
            // this.arv.mesh.updateUniforms(this.uniforms)
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
