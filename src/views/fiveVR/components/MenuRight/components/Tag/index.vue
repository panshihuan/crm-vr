<template>
    <div class="vr__tag" v-loading="loading">
        <div v-show="!(showDetail || showText)" class="vr__tag__list">
            <div class="vr__tag__adds">
                <div class="vr__tag__adds__btn" @click="handleAddText">文字标签 +</div>
                <div class="vr__tag__adds__btn" @click="handleAddText('3')">内链接标签 +</div>
                <div class="vr__tag__adds__btn" @click="handleAdd">多媒体标签 +</div>
            </div>
            <div class="vr__tag__list__header">
                <div>文字标签</div>
            </div>
            <ul style="padding: 12px;">
                <li v-for="(item, index) in textList" :key="index" style="padding-bottom: 7px;">
                    <span style="cursor: pointer;" @click="handlePanoIndex(item)">{{ item.name }}</span>
                    <i
                        class="el-icon-edit"
                        style="
                            color: #1890ff;
                            padding-left: 6px;
                            cursor: pointer;
                        "
                        @click="handleTextEdit(item)"
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
                </li>
            </ul>
            <div class="vr__tag__list__header">
                <div>内链接标签</div>
            </div>
            <ul style="padding: 12px;">
                <li v-for="(item, index) in linkList" :key="index" style="padding-bottom: 7px;">
                    <span style="cursor: pointer;" @click="handlePanoIndex(item)">{{ item.name }}</span>
                    <i
                        class="el-icon-edit"
                        style="
                            color: #1890ff;
                            padding-left: 6px;
                            cursor: pointer;
                        "
                        @click="handleTextEdit(item)"
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
                </li>
            </ul>
            <div class="vr__tag__list__header">
                <div>多媒体标签</div>
            </div>
            <div>
                <section class="vr__tag__list__item" v-for="(item, index) in mediaList" :key="'media'+index">
                    <div 
                        class="vr__tag__list__acatar" 
                        :style="'background-image:url('+ (item.media_data && item.media_data.length && item.media_data[0].src ? item.media_data[0].src: '')+')'"
                        @click="handlePanoIndex(item)"
                    >
                    </div>
                    <div class="vr__tag__list__content">
                        <span class="vr__tag__list__title">{{item.name}}</span>
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
        <div v-show="showText" class="vr__tag__relative">
            <div class="vr__tag__edit__title">
                <div class="vr__tag__edit__title__txt">{{isLink ? '编辑内链接标签': '编辑文字标签'}}</div>
                <i class="el-icon-close" style="font-size: 22px;cursor: pointer;" @click="handleClose"></i>
            </div>
            <AxisPoint :five="five" :initAxis="initAxis" @changePoint="changePoint" />
            <el-form
                ref="ruleFormText"
                size="mini"
                :model="ruleFormText"
                :rules="rulesText"
                label-position="top"
                class="demo-ruleForm"
            >
                <el-form-item
                    label="标签标题"
                    prop="name"
                    class="vr__edit__label"
                >
                    <el-input
                        v-model="ruleFormText.name"
                        placeholder="请填写标签标题"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="标签介绍"
                    prop="description"
                    class="vr__edit__label"
                >
                    <el-input
                        type="textarea"
                        v-model="ruleFormText.description"
                        placeholder="请填写标签介绍"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="跳转链接"
                    prop="target_url"
                    class="vr__edit__label"
                >
                    <el-input
                        v-model="ruleFormText.target_url"
                        placeholder="请填写跳转链接"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="关联菜单"
                    prop="menu_id"
                    class="vr__edit__label"
                >
                    <el-select v-model="ruleFormText.menu_id" filterable placeholder="请选择">
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
                
                <div class="vr__tag__submit">
                    <el-button @click="handleClose"
                        >取消</el-button
                    >
                    <el-button type="primary" @click="submitForm('ruleFormText')"
                        >保存</el-button
                    >
                </div>
            </el-form>
        </div>
        <div v-show="showDetail" class="vr__tag__relative">
            <div class="vr__tag__edit__title">
                <div class="vr__tag__edit__title__txt">编辑多媒体标签</div>
                <i class="el-icon-close" style="font-size: 22px;cursor: pointer;" @click="handleClose"></i>
            </div>
            <!-- 取点坐标值 -->
            <AxisPoint :five="five" :initAxis="initAxis" @changePoint="changePoint" />
            <el-form
                ref="ruleForm"
                size="mini"
                :model="ruleForm"
                :rules="rules"
                label-position="top"
                class="demo-ruleForm"
            >
                <el-form-item
                    label="上传文件"
                    prop="files"
                    class="vr__edit__label"
                >
                    <UploadAll
                        v-model="ruleForm.files"
                        :uploadUrl="uploadUrl"
                        uploadText="上传文件"
                        :limit="limit"
                        maxFile=200
                    />
                </el-form-item>
                <el-form-item
                    label="标签标题"
                    prop="name"
                    class="vr__edit__label"
                >
                    <el-input
                        v-model="ruleForm.name"
                        placeholder="请填写标签标题"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="标签介绍"
                    prop="description"
                    class="vr__edit__label"
                >
                    <el-input
                        type="textarea"
                        v-model="ruleForm.description"
                        placeholder="请填写标签介绍"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="跳转链接"
                    prop="target_url"
                    class="vr__edit__label"
                >
                    <el-input
                        v-model="ruleForm.target_url"
                        placeholder="请填写链接"
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
                            <span :style="item.p_id ? 'padding: 0 15px;font-size: 12px;': ''">{{ item.name }}</span>
                        </el-option>
                    </el-select>
                    <div class="vr__tips">可关联到用户端快捷菜单入口</div>
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
import {
    getVrSceneTagList,
    uploadUrl,
    editVrSceneTag,
    delVrSceneTag,
} from "@/api/fiveVR";
import { cameraToVec3 } from '@/views/fiveVR/assets/js/tools'
import UploadAll from "@/components/UploadAll/index";
import AxisPoint from "../Axis/index";
import { matchType } from './matchFileType'
import { mapState } from 'vuex'

export default {
    name: "TagEdit",
    components: {
        UploadAll,
        AxisPoint,
    },
    props: {
        five: {
            type: [Object, Array],
        },
    },
    data() {
        return {
            limit: 100,
            loading: false,
            uploadUrl: uploadUrl,
            groupId: "",
            sceneId: "",
            showDetail: false,
            showText: false,
            list: [],
            textList: [],
            linkList: [],
            mediaList: [],
            ruleForm: {
                name: "",
                description: "",
                target_url: '',
                id: '',
            },
            ruleFormText: {
                name: '',
                description: '',
                id: '',
                target_url: ''
            },
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入标签标题",
                        trigger: "blur",
                    },
                ],
                description: [
                    {
                        required: true,
                        message: "请输入标签介绍",
                        trigger: "blur",
                    },
                ],
            },
            rulesText: {
                name: [
                    {
                        required: true,
                        message: "请输入标签标题",
                        trigger: "blur",
                    },
                ],
                description: [
                    {
                        required: true,
                        message: "请输入标签介绍",
                        trigger: "blur",
                    },
                ],
            },
            position: [], // 取点坐标
            initAxis: null,
            isEdit: false,
            panoIndex: null,
            isLink: false,
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
        this.getVrSceneTagList();
        this.$bus.$on('vrTabEditChange', this.handleClose)
        this.$bus.$on('handleTagFloat', this.handleTagFloat)
    },
    methods: {
        submitForm(formName) {
            let params = {}
            if (this.showDetail) { // 多媒体标签
                const {
                    id, // 有id则是修改，否则是新增
                    name,
                    description,
                    target_url,
                    files,
                    video,
                    menu_id
                } = this.ruleForm
                if (!this.position.length) {
                    this.$message.error('请先取点！')
                    return
                }
                if (!files?.length) {
                    this.$message.error('请至少上传一张图片或视频！')
                    return
                }
                const filesCopy = files.map(item => {
                    return {
                        name: item.name,
                        src: item.url,
                        type: matchType(item.url)
                    }
                })
                params = {
                    id: id || '',
                    group_id: this.groupId,
                    vr_id: this.sceneId,
                    name,
                    menu_id: menu_id || '',
                    description: description || '',
                    target_url: target_url || '',
                    position: JSON.stringify(this.position),
                    media_data: JSON.stringify(filesCopy),
                    pano_index: this.panoIndex || 0
                }
            } else if (this.showText) { // 文字标签
                params = {
                    id: this.ruleFormText.id || '',
                    group_id: this.groupId,
                    vr_id: this.sceneId,
                    name: this.ruleFormText.name,
                    description: this.ruleFormText.description || '',
                    target_url: this.ruleFormText.target_url || '',
                    position: JSON.stringify(this.position),
                    pano_index: this.panoIndex || 0,
                    menu_id: this.ruleFormText.menu_id || '',
                }
            }
            params.type = formName == 'ruleFormText'? this.isLink ? 'preview': 'normal' : 'media'
            
            console.log(666661, params)
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    editVrSceneTag(params).then(res => {
                        this.$message.success('操作成功!')
                        this.handleClose()
                        this.emitRefreshList(false, true)
                        this.emitRefreshItem()
                        this.getVrSceneTagList()
                    })
                }
            });
        },
        resetForm() {},
        handleAdd() {
            this.showDetail = true;
            this.isEdit = true;
            this.ruleForm = {}
            this.position = []
            this.initAxis = null
            this.emitRefreshList(this.isEdit, false)
        },
        handleAddText(val) {
            this.isLink = val == 3
            this.showText = true;
            this.isEdit = true;
            this.ruleFormText = {}
            this.emitRefreshList(this.isEdit, false)
        },
        handleEdit(item) {
            this.handleClose()
            this.showDetail = true;
            this.isEdit = true;
            this.$set(this.ruleForm, 'name', item.name)
            this.$set(this.ruleForm, 'description', item.description)
            this.$set(this.ruleForm, 'target_url', item.target_url)
            this.$set(this.ruleForm, 'id', item.id || '')
            this.$set(this.ruleForm, 'menu_id', item.menu_id || '')
            this.panoIndex = item.pano_index
            const [x,y,z] = item.position
            this.position = item.position
            this.initAxis = {x,y,z}
            const files = item.media_data.map(it => {
                return {
                    url: it.src,
                    name: it.name
                }
            })
            this.$set(this.ruleForm, 'files', files)
            this.emitRefreshList(this.isEdit, false, item)
        },
        handleTextEdit(item) {
            this.showText = true;
            this.isEdit = true;
            this.isLink = item.type == 'preview'
            this.panoIndex = item.pano_index
            this.$set(this.ruleFormText, 'name', item.name)
            this.$set(this.ruleFormText, 'description', item.description)
            this.$set(this.ruleFormText, 'target_url', item.target_url)
            this.$set(this.ruleFormText, 'id', item.id || '')
            this.$set(this.ruleFormText, 'menu_id', item.menu_id || '')
            const [x,y,z] = item.position
            this.position = item.position
            this.initAxis = {x,y,z}
            this.emitRefreshList(this.isEdit, false, item)
        },
        handleDel(item) {
            this.$confirm('确定删除该标签?, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delVrSceneTag({
                    id: item.id
                }).then(() => {
                    this.$message.success('删除成功!')
                    this.emitRefreshList(false, true)
                    this.getVrSceneTagList()
                })
            }).catch(() => {
            })
        },
        getVrSceneTagList() {
            this.loading = true
            getVrSceneTagList({
                group_id: this.groupId,
                vr_id: this.sceneId
            }).then((res) => {
                this.loading = false
                this.list = res.list;
                const textList = res.list.filter(item => item.type == 'normal')
                const mediaList = res.list.filter(item => item.type == 'media')
                const linkList = res.list.filter(item => item.type == 'preview')
                this.textList = textList
                this.mediaList = mediaList
                this.linkList = linkList
            }).catch(() => {
                this.loading = false
            })
        },
        changePoint(position, panoIndex) {
            const { x,y,z } = position
            this.position = [x,y,z]
            this.panoIndex = panoIndex
        },
        handleClose() {
            this.showDetail = false;
            this.showText = false;
            this.isEdit = false
            this.emitRefreshList(this.isEdit, false)
            this.emitRefreshItem()
        },
        // 刷新主页TagFloat
        emitRefreshList(isEdit=false,isFetch=false, item=null) {
            this.$bus.$emit('refreshTagList', { isEdit: this.isEdit, isFetch: isFetch, item })
        },
        // 刷新单个tag
        emitRefreshItem() {
            this.$bus.$emit('refreshTagItem')
        },
        handlePanoIndex(item) {
            this.five.moveToPano(item.pano_index)
            setTimeout(() => {
                cameraToVec3(item.position, this.five)
            }, 3000)
        },
        handleTagFloat(info) {
            if (info.type === "normal") {
                this.handleTextEdit(info)
            } else if (info.type === "media") {
                this.handleEdit(info)
            }
        },
    },
};
</script>

<style scoped lang="scss">
    @import './index.scss';
</style>
