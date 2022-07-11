<template>
    <div class="vr__tag">
        <div v-show="!(showDetail || showText)" class="vr__tag__list">
            <div class="vr__tag__adds">
                <div class="vr__tag__adds__btn" @click="handleAddText">添加点位 +</div>
            </div>
            <ul>
                <li v-for="(item, index) in list" :key="index" style="margin-bottom: 6px;">
                    <span style="cursor: pointer;" @click="handlePanoIndex(item)">{{ item.title }}</span>
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
            
        </div>
        <div v-show="showText" class="vr__tag__relative">
            <div class="vr__tag__edit__title">
                <div class="vr__tag__edit__title__txt">编辑点位</div>
                <i class="el-icon-close" style="font-size: 22px;cursor: pointer;" @click="handleClose"></i>
            </div>

            <AxisPoint :five="five" :showDetail="showText" labelText="导航点" pointType="fly" :initAxis="initAxis" @changePoint="changePoint" />

            <el-form
                ref="ruleFormText"
                size="mini"
                :model="ruleFormText"
                :rules="rulesText"
                label-position="top"
                class="demo-ruleForm"
            >
                
                <el-form-item
                    label="标题"
                    prop="title"
                    class="vr__edit__label"
                >
                    <el-input
                        v-model="ruleFormText.title"
                        placeholder="请填写标题"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="描述"
                    prop="desc"
                    class="vr__edit__label"
                >
                    <el-input
                        v-model="ruleFormText.desc"
                        placeholder="请填写描述"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="提示"
                    prop="tips"
                    class="vr__edit__label"
                >
                    <el-input
                        v-model="ruleFormText.tips"
                        placeholder="请填写提示"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="是否显示在导航点位里"
                    prop="nav_show"
                    class="vr__edit__label"
                >
                    <el-switch v-model="ruleFormText.nav_show" active-value="1" inactive-value="0"></el-switch>
                </el-form-item>

                <el-form-item
                    label="导航封面"
                    class="vr__edit__label"
                >
                <br>
                    <HtmlToImg :initData="initData" :showText="showText" :five="five" @change="changeUrl"/>
                </el-form-item>
                
                <div class="vr__tag__submit">
                    <el-button @click="handleClose"
                        >取消</el-button
                    >
                    <el-button type="primary" @click="submitForm"
                        >保存</el-button
                    >
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import {
    uploadUrl,
    getVrScenePointList,
    editVrScenePoint,
    delVrScenePoint,
} from "@/api/fiveVR";

import AxisPoint from "../../../Axis/index";
import { cameraToVec3 } from '@/views/fiveVR/assets/js/tools'
import HtmlToImg from '@/components/HtmlToImg/index';
import { moveAndCamera } from '@/utils/moveAndCamera'

export default {
    name: "NavigationPoint",
    components: {
        AxisPoint,
        HtmlToImg
    },
    props: {
        five: {
            type: [Object, Array],
        },
        enumCrm: {
            type: [Object, Array],
        },
        floorIndex: {
            type: [Object, Array],
        }
    },
    data() {
        return {
            groupId: "",
            sceneId: "",
            showDetail: false,
            showText: false,
            list: [],
            textList: [],
            ruleFormText: {
                id: '',
                title: "",
                desc: "",
                tips: '',
                nav_show: '0'
            },
            rulesText: {
                title: [
                    {
                        required: true,
                        message: "请输入标题",
                        trigger: "blur",
                    },
                ],
                desc: [
                    {
                        required: true,
                        message: "请输入描述",
                        trigger: "blur",
                    },
                ],
            },
            isEdit: false,
            pointList: [],
            panoIndex: '',
            position: [],
            initAxis: null,
            initData: null,
            extra: null,
        };
    },
    created() {
        const { groupId, id } = this.$route.query;
        this.groupId = groupId;
        this.sceneId = id;
        this.getVrScenePointList();
        this.$bus.$on('handleNavigationPoint', this.handleNavigationPoint)
    },
    methods: {
        submitForm() {
            const floor = this.floorIndex.find(item => item.index == (this.panoIndex || 0))
            const floorIndex = floor?.floor_index
            let params = {
                group_id: this.groupId,
                vr_id: this.sceneId,
                pano_index: this.panoIndex || 0,
                point: JSON.stringify(this.position),
                floor_index: floorIndex || 0,
                ...this.ruleFormText,
                extra: JSON.stringify(this.extra)
            }
            if (!this.extra) {
                this.$message.error('请选择截图')
                return
            }
            console.log(666666, params)
            this.$refs['ruleFormText'].validate((valid) => {
                if (valid) {
                    editVrScenePoint(params).then(res => {
                        this.$message.success('操作成功!')
                        this.getVrScenePointList()
                        this.$bus.$emit('refreshNavigationPoint')
                        this.handleClose()
                    })
                }
            });
        },
        handleAddText() {
            this.showText = true;
            this.isEdit = true;
            this.ruleFormText = {}
            this.initAxis = {}
            this.initData = {}
        },
        handleTextEdit(item) {
            this.showText = true;
            this.isEdit = true;
            this.panoIndex = item.pano_index
            const [x,y,z] = item.point
            this.position = item.point
            this.initAxis = {x,y,z}
            this.$set(this.ruleFormText, 'id', item.id || '')
            this.$set(this.ruleFormText, 'title', item.title || '')
            this.$set(this.ruleFormText, 'desc', item.desc || '')
            this.$set(this.ruleFormText, 'tips', item.tips)
            this.$set(this.ruleFormText, 'nav_show', ''+item.nav_show || '0')
            this.initData = item?.extra?.info?.screenshot
            this.extra = item?.extra
        },
        handleDel(item) {
            this.$confirm('确定删除该标签?, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delVrScenePoint({
                    id: item.id
                }).then(() => {
                    this.$message.success('删除成功!')
                    this.getVrScenePointList()
                    this.$bus.$emit('refreshNavigationPoint')
                })
            }).catch(() => {
            })
        },
        getVrScenePointList() {
            getVrScenePointList({
                group_id: this.groupId,
                vr_id: this.sceneId
            }).then((res) => {
                this.list = res.list;
            });
        },
        handleClose() {
            this.showDetail = false;
            this.showText = false;
            this.isEdit = false
            this.emitRefreshItem()
        },
        emitRefreshItem() {
            this.$bus.$emit('refreshTagItem')
        },
        changePoint(position, panoIndex) {
            const { x,y,z } = position
            this.position = [x,y,z]
            this.panoIndex = panoIndex
        },
        handleNavigationPoint(info) {
            this.handleTextEdit(info)
        },
        handlePanoIndex(item) {
            moveAndCamera(item, this.five, item.pano_index, item.point)
        },
        changeUrl(val) {
           this.extra = {
               info: {screenshot: val}
           }
        }
    },
};
</script>

<style scoped lang="scss">
    @import './index.scss';
</style>
