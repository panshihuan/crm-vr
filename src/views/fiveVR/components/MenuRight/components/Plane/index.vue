<template>
    <div class="vr__tag" v-loading="loadingContent">
        <div v-show="!showDetail" class="vr__tag__list">
            <div class="vr__tag__adds">
                <div class="vr__tag__adds__btn" @click="handleAdd">新增平面内容 +</div>
            </div>
            <div>
                <section class="vr__tag__list__item" v-for="(item, index) in list" :key="'media'+index">
                    <div 
                        class="vr__tag__list__acatar" 
                        :style="'background-image:url('+ (type==1 ?(item && item.extra && item.extra.info && item.extra.info.src && item.extra.info.src): imgEdit)+')'"
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
                <div class="vr__tag__edit__title__txt">编辑平面内容</div>
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
                    v-if="type == 1 || type == 2"
                    label="上传文件（不超过100M）"
                    prop="files"
                    class="vr__edit__label vr--required"
                >
                    <UploadAll
                        v-model="ruleForm.files"
                        :uploadUrl="uploadUrl"
                        uploadText="上传文件"
                        maxFile=200
                        :listType="type == 2 ? 'text': 'picture'"
                        @change="changeFile"
                    />
                </el-form-item>

                <!-- <Rectangle :five="five" :type="type" :showDetail="showDetail" :rectangleType="getRectangleType()" :initRectangle="initRectangle" @change3DDomContainer="change3DDomContainer"/> -->
                <Rectangle3 
                    :five="five" 
                    :type="type" 
                    :showDetail="showDetail" 
                    :rectangleType="getRectangleType()" 
                    :initRectangle="initRectangle" 
                    :initeExtra="initeExtra" 
                    @change3DDomContainer="change3DDomContainer"
                />

                <el-form-item
                    v-if="type == 4"
                    label="网址"
                    prop="link"
                    class="vr__edit__label"
                >
                    <el-input
                        type="textarea"
                        v-model="ruleForm.link"
                        placeholder="请填写网址"
                        @change="changeLink"
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
                    <div class="vr__tips">可关联到用户端快捷菜单入口</div>
                </el-form-item>
                <el-form-item
                    label="触发形式"
                    prop="trigger_type"
                    class="vr__edit__label"
                >
                    <el-radio-group v-model="ruleForm.trigger_type" @change="changeRadio">
                        <el-radio 
                            v-for="(item, index) in enumCrm.vr_content_trigger_type"
                            style="color: #fff;" 
                            :key="index+'radio'" 
                            :label="item.value"
                        >{{item.label}}</el-radio>
                    </el-radio-group>
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
                
                <!-- 取点坐标值 -->
                <AxisPoint v-show="ruleForm.trigger_type == 2" :five="five" :initAxis="initAxis" @changePoint="changePoint" />
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
import Rectangle2 from "../A-Rectangle2/index";
import Rectangle3 from "../A-Rectangle3/index";
import { matchType } from '../Tag/matchFileType'
import { mapState } from 'vuex'
import imgEdit from '@/assets/img/noData.png'
import { moveAndCamera } from '@/utils/moveAndCamera'

const rectangleType = [
    { key: 'link', value: [4] },
    { key: 'img', value: [1] },
    { key: 'video', value: [2] },
]

export default {
    name: "PlaneEdit",
    components: {
        UploadAll,
        AxisPoint,
        Rectangle,
        Rectangle2,
        Rectangle3
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
                trigger_type: 1
            },
            rules: {
                desc: [
                    {
                        required: true,
                        message: "请输入描述内容",
                        trigger: "blur",
                    },
                ],
                trigger_type: [
                    {
                        required: true,
                        message: "必填项",
                        trigger: ['blur','change'],
                    },
                ],
            },
            position: [], // 取点坐标
            initAxis: null,
            initRectangle: null,
            initeExtra: null,
            isEdit: false,
            panoIndex: null,
            panoIndexStand: null,
            extra: {},
            rectangle: [],
            arv: null,
            listType: 'picture',
            rectData: '',
            loadingContent: false,
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
    },
    methods: {
        getRectangleType() {
            const it = rectangleType.find(item => item.value.some(it => it == this.type))
            return it?.key
        },
        submitForm(formName) {
            let params = {}
            if (this.showDetail) {
                const {
                    id, // 有id则是修改，否则是新增
                    desc,
                    files,
                    link
                } = this.ruleForm
                if(!this.rectangle?.length) {
                    this.$message.error('请先取平面四个点！')
                    return
                }
                if (this.ruleForm.trigger_type == 2 && !this.position.length) {
                    this.$message.error('请先取点！')
                    return
                }
                if (this.ruleForm.trigger_type == 1 && !this.ruleForm.tips) {
                    this.$message.error('请填写标签提示内容！')
                    return
                }
                if ( (this.type == 1 || this.type == 2 || this.type == 3) && !files.length) {
                    this.$message.error('请上传一张图片或视频！')
                    return
                }
                if ( (this.type == 4) && !link) {
                    this.$message.error('请输入网址')
                    return
                }
                if ( (this.type == 4) && link) {
                    if (/vrar.bookan.com.cn/.test(link)) {
                        this.$message.error('域名冲突!')
                        return
                    }
                }
                const points = this.rectangle.map(item => {
                    return { ...item.points}
                })
                const extra = {
                    type: this.type,
                    position: this.position || '',
                    trigger_type: this.ruleForm.trigger_type,
                    tips: this.ruleForm.tips || '',
                    info: {
                        src: this.type == 4 ? link : files[0]?.url,
                        src_name: this.type == 4 ? '' : files[0]?.name,
                        points,
                        panoIndex: this.panoIndexStand || this.panoIndex,
                        rectangle: this.rectangle,
                        rectData: this.rectData,
                    }
                }
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
                trigger_type: 1
            }
            this.position = []
            this.initAxis = null
            this.emitRefreshList(this.isEdit, false)
            this.$bus.$emit('changeRectangleFile', '')
        },
        handleEdit(val) {
            console.log(199, val)
            // this.handleClose()
            let item = _.cloneDeep(val)
            this.showDetail = true;
            this.isEdit = true;
            this.$set(this.ruleForm, 'desc', item.desc)
            this.$set(this.ruleForm, 'id', item.id || '')
            this.$set(this.ruleForm, 'link', item.extra?.info?.src || '')
            this.$set(this.ruleForm, 'tips', item.extra?.tips || '')
            this.$set(this.ruleForm, 'menu_id', item.menu_id || '')
            this.$set(this.ruleForm, 'trigger_type', item.extra?.trigger_type || 1)
            this.panoIndex = item.extra?.info?.panoIndex
            this.initRectangle = item.extra?.info?.rectangle
            this.initeExtra = item.extra
            this.rectangle = item.extra?.info?.rectangle
            this.rectData = item.extra?.info?.rectData
            
            const [x,y,z] = item.extra?.position
            this.position = item.extra?.position
            this.initAxis = {x,y,z}
            if (this.type == 1 || this.type == 2 || this.type == 3) {
                const files = [{
                    url: item.extra?.info?.src,
                    name: item.extra?.info?.src_name
                }]
                this.$set(this.ruleForm, 'files', files)
            }
            this.changeFile()
            if (this.type == 4) {
                this.$set(this.ruleForm, 'link', item.extra?.info?.src)
            }
            this.emitRefreshList(this.isEdit, false, item)
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
            this.loadingContent = true
            getVrSceneContentList({
                group_id: this.groupId,
                vr_id: this.sceneId,
                type: this.type
            }).then((res) => {
                this.loadingContent = false
                this.list = res.list;
            }).catch(() => {
                this.loadingContent = false
            })
        },
        handleClose() {
            this.showDetail = false;
            this.isEdit = false
            this.emitRefreshList(this.isEdit, false)
            this.emitRefreshItem()
        },
        // 刷新主页TagFloat
        emitRefreshList(isEdit=false,isFetch=false, item=null) {
            this.$bus.$emit('refreshPlaneList', { isEdit, isFetch: isFetch, item })
        },
        // 刷新单个tag
        emitRefreshItem() {
            this.$bus.$emit('refreshTagItem')
        },
        handlePanoIndex(item) {
            // const panoIndex = item.extra.info.panoIndex
            // const points = item.extra.info.points
            // const {x,y,z} = calcCenterPoint(points)
            // const position = [x,y,z]
            // this.five.moveToPano(panoIndex)
            // setTimeout(() => {
            //     cameraToVec3(position, this.five)
            // }, 3000)
            moveAndCamera(item, this.five)
        },
        changePoint(position, panoIndex) {
            const { x,y,z } = position
            this.position = [x,y,z]
            this.panoIndexStand = panoIndex
        },
        change3DDomContainer(val, panoIndex, rectData ='') {
            this.panoIndex = panoIndex
            this.rectangle = val.map(item => {
                const { index, label, points } = item
                return { index, label, points }
            })
            this.rectData = rectData
        },
        changeRadio(val) {

        },
        clickEditPoint({type, index, info}) {
            if (this.list.some(item => item.id == info.id)) {
                this.$emit('tabChange', type)
                this.handleEdit(info)
            }
        },
        changeFile() {
            if (this.ruleForm?.files) {
                this.$bus.$emit('changeRectangleFile', this.ruleForm?.files[0]?.url || '')
            }
        },
        changeLink() {
            this.$bus.$emit('changeRectangleFile', this.ruleForm?.link)
        },
    },
};
</script>

<style scoped lang="scss">
    @import '../Tag/index.scss';
</style>
