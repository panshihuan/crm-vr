<template>
    <div class="vr__tag" v-loading="loading">
        <div v-show="!showDetail" class="vr__tag__list">
            <div class="vr__tag__adds">
                <div class="vr__tag__adds__btn" @click="handleAdd">新增绿幕 +</div>
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
                <div class="vr__tag__edit__title__txt">编辑绿幕内容</div>
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
                <el-form-item
                    v-if="type == 3"
                    label="上传绿幕视频"
                    prop="files"
                    class="vr__edit__label vr--required"
                >
                    <div class="vr__tips">视频分辨率为：720*1280</div>
                    <UploadAll
                        v-model="ruleForm.files"
                        :uploadUrl="uploadUrl"
                        uploadText="上传绿幕视频"
                        maxFile=100
                        listType="text"
                        @change="changeFile"
                    />
                </el-form-item>

                <el-form-item
                    label="触发形式"
                    prop="trigger_type"
                    class="vr__edit__label"
                >
                    <el-radio-group v-model="ruleForm.trigger_type" @change="changeRadio">
                        <el-radio 
                            v-for="(item, index) in triggerTypeList"
                            style="color: #fff;" 
                            :key="index+'radio'" 
                            :label="+item.value"
                        >{{item.label}}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <!-- 取点坐标值 -->
                <AxisPoint v-show="ruleForm.trigger_type == 2" :five="five" :initAxis="initAxis" @changePoint="changePoint" />

                <el-form-item
                    label="缩放比例"
                    prop="scale"
                    class="vr__edit__label"
                >
                    <el-input
                        v-model="ruleForm.scale"
                        placeholder="0.0015"
                        @input="changeScale"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    prop="scale"
                    class="vr__edit__label"
                >
                    <el-slider v-model="uniforms.range" :min="min" :max="max" :step="step" @change="changeUniforms"></el-slider>
                </el-form-item>
                <el-form-item
                    prop="scale"
                    class="vr__edit__label"
                >
                    <el-slider v-model="uniforms.edge0" :min="min" :max="max" :step="step" @change="changeUniforms"></el-slider>
                </el-form-item>
                <el-form-item
                    prop="scale"
                    class="vr__edit__label"
                >
                    <el-slider v-model="uniforms.edge1" :min="min" :max="max" :step="step" @change="changeUniforms"></el-slider>
                </el-form-item>

                <el-divider></el-divider>

                <el-form-item
                    label="名称"
                    prop="title"
                    class="vr__edit__label"
                >
                    <el-input
                        v-model="ruleForm.title"
                        placeholder="请填写名称"
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
                    v-show="ruleForm.trigger_type == 1"
                    label="提示内容"
                    prop="trigger_type"
                    class="vr__edit__label"
                >
                    <el-input
                        type="textarea"
                        v-model="ruleForm.tips"
                        placeholder="请填写标签提示内容"
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
                        </el-option>
                    </el-select>
                    <div class="vr__tips">可关联到用户端快捷菜单入口</div>
                </el-form-item>

                <el-form-item
                    label="截图"
                    class="vr__edit__label"
                >
                <br>
                    <HtmlToImg :initData="initData" :showText="showDetail" :five="five" @change="changeUrl"/>
                </el-form-item>

                <el-divider></el-divider>
                
                
                
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
import arVideoSrc from "../../../../assets/img/green1.mp4";
import HtmlToImg from '@/components/HtmlToImg/index';
import { mapState } from 'vuex'
import imgEdit from '@/assets/img/noData.png'
import { moveAndCamera } from '@/utils/moveAndCamera'

export default {
    name: "ArVedio",
    components: {
        UploadAll,
        AxisPoint,
        Rectangle,
        HtmlToImg,
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
                title: "",
                desc: "",
                id: '',
                trigger_type: 2,
                scale: 0.0015,
            },
            uniforms: {
                range: 0.25,
                edge0: 0.1,
                edge1: 0.2
            },
            min: 0,
            max: 1,
            step: 0.0001,
            rules: {
                title: [
                    {
                        required: true,
                        message: "请输入名称",
                        trigger: "blur",
                    },
                ],
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
            initData: null,
            screenshot: null,
            imgEdit: imgEdit
        };
    },
    computed: {
        ...mapState('vr', [
            'menuList',
        ]),
        triggerTypeList() {
            const result = this.enumCrm.vr_content_trigger_type.filter(item => item.value == 2)
            return result
        }
    },
    created() {
        console.log(55555, imgEdit)
        const { groupId, id } = this.$route.query;
        this.groupId = groupId;
        this.sceneId = id;
        this.getVrSceneContentList();
        this.$bus.$on('clickEditPoint', this.clickEditPoint)
        this.$bus.$on('vrTabEditChange', this.handleClose)
        this.endCallback = null
    },
    mounted() {
        this.$nextTick(() => {
            this.arv = new ARVideoFigureScene(document.getElementById("arVideo"));
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
                    title,
                    files,
                    link
                } = this.ruleForm
                if (this.ruleForm.trigger_type == 2 && !this.position.length) {
                    this.$message.error('请先取点！')
                    return
                }
                if (this.ruleForm.trigger_type == 1 && !this.ruleForm.tips) {
                    this.$message.error('请填写标签提示内容！')
                    return
                }
                if (!files?.length) {
                    this.$message.error('请上传视频！')
                    return
                }
                const extra = {
                    type: this.type,
                    position: this.position || '',
                    trigger_type: this.ruleForm.trigger_type,
                    tips: this.ruleForm.tips || '',
                    info: {
                        src: this.type == 4 ? link : files[0]?.url,
                        src_name: this.type == 4 ? '' : files[0]?.name,
                        panoIndex: this.panoIndex,
                        uniforms: this.uniforms,
                        scale: this.ruleForm.scale,
                        screenshot: this.screenshot
                    },
                }
                params = {
                    id: id || '',
                    group_id: this.groupId,
                    vr_id: this.sceneId,
                    desc: desc || '',
                    title: title || '',
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
            this.endCallback = null
            this.isEdit = true;
            this.ruleForm = {
                scale: 0.0015,
                trigger_type: 2
            }
            this.uniforms = {
                range: 0.25,
                edge0: 0.1,
                edge1: 0.2
            }
            this.position = []
            this.initAxis = null
            this.initData = {}
            this.emitRefreshList(this.isEdit, false)
        },
        handleEdit(val) {
            this.endCallback = null
            this.handleClose()
            let item = _.cloneDeep(val)
            this.showDetail = true;
            this.isEdit = true;
            this.$set(this.ruleForm, 'title', item.title || '')
            this.$set(this.ruleForm, 'desc', item.desc || '')
            this.$set(this.ruleForm, 'id', item.id || '')
            this.$set(this.ruleForm, 'tips', item.extra.tips || '')
            this.$set(this.ruleForm, 'trigger_type', item.extra.trigger_type || 2)
            this.$set(this.ruleForm, 'scale', item.extra.info.scale || '')
            this.$set(this.ruleForm, 'menu_id', item.menu_id || '')
            this.initData = item?.extra?.info?.screenshot
            this.screenshot = this.initData
            this.panoIndex = item.extra.info.panoIndex
            const [x,y,z] = item.extra.position
            this.position = item.extra.position
            this.uniforms = item?.extra?.info?.uniforms
            this.initAxis = {x,y,z}
            if (this.type == 1 || this.type == 2 || this.type == 3) {
                const files = [{
                    url: item.extra.info.src,
                    name: item.extra.info.src_name
                }]
                this.$set(this.ruleForm, 'files', files)
            }
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
            this.endCallback = null
            this.emitRefreshList(this.isEdit, false)
            this.emitRefreshItem()
            this.removeAr()
        },
        // 刷新主页TagFloat
        emitRefreshList(isEdit=false,isFetch=false, item=null) {
            if (this.arv?.mesh) {
                this.five.scene.remove(this.arv.mesh);
            }
            this.$bus.$emit('refreshPlaneList', { isEdit, isFetch: isFetch, item })
        },
        // 刷新单个tag
        emitRefreshItem() {
            this.$bus.$emit('refreshTagItem')
        },
        handlePanoIndex(item) {
            const panoIndex = item.extra.info.panoIndex
            moveAndCamera(item, this.five, panoIndex, item.position)
        },
        changeRadio(val) {
            
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
            if (this.endCallback) {
                this.arv.mesh.pause();
                const position = _.cloneDeep(this.position)
                this.arv.mesh.position.set(...position)
                let bound = this.arv.mesh.geometry.boundingBox;
                const scale = this.ruleForm.scale
                this.arv.mesh.scale.set(scale, scale, scale)
                this.arv.mesh.translateY((bound.max.y - bound.min.y) * scale / 2)
                this.arv.mesh.updateUniforms(this.uniforms)
                setTimeout(() => {
                    this.play()
                    this.five.refresh()
                }, 200)
                return
            }
            this.initLv()
        },
        async initLv(callback) {
            this.removeAr()
            this.arv = new ARVideoFigureScene(document.getElementById("arVideo"));
            const url = (this.ruleForm.files?.length) ? this.ruleForm.files[0].url : '' 
            const scale = this.ruleForm.scale
            const position = _.cloneDeep(this.position)
            const uniforms = this.uniforms
            this.endCallback = true;
            await this.arv.mesh.update(url);
            this.arv.mesh.position.set(...position)
            this.arv.mesh.scale.set(scale, scale, scale)
            this.arv.mesh.geometry.computeBoundingBox();
            let bound = this.arv.mesh.geometry.boundingBox;
            this.arv.mesh.translateY((bound.max.y - bound.min.y) * scale / 2)
            this.arv.mesh.updateUniforms(uniforms)
            this.five.scene.add(this.arv.mesh);
            this.play()
            this.five.refresh()
            setTimeout(() => {
                this.five.refresh()
            }, 300)
        },
        updateLv() {
            const scale = this.ruleForm.scale
            this.arv.mesh.scale.set(scale, scale, scale)
            this.arv.mesh.updateUniforms(this.uniforms)
            this.five.refresh()
        },
        play() {
            if (this.arv?.mesh?.play) {
                this.arv.mesh.lookAt(this.five.camera.position)
                this.arv.mesh.play();
            }
        },
        removeAr() {
            if (this.arv?.mesh?.pause) {
                this.arv.mesh.pause();
                this.arv.videoInstance.currentTime = 0;
                this.five.scene.remove(this.arv.mesh);
                this.arv = null
            }
        },
        changeFile() {
            this.initLv()
            this.endCallback = null;
        },
        changeScale: _.throttle(function() {
            this.updateLv()
        }, 300),
        changeUniforms: _.throttle(function() {
            this.updateLv()
        }, 300),
        changeUrl(val) {
           this.screenshot = val
        },
    },
};
</script>

<style scoped lang="scss">
    @import '../Tag/index.scss';
</style>
