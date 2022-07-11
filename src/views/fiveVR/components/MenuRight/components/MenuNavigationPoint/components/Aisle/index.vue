<template>
    <div class="vr__tag vr__aisle">
        <div v-show="!(showDetail || showText)" class="vr__tag__list">
            <div class="vr__tag__adds vr__aisle__adds">
                <div class="vr__tag__adds__btn" @click="handleAddText">添加通道 +</div>
            </div>
            <el-collapse v-model="activeNames">
                <el-collapse-item v-for="(it, index) in list" :key="index" :title="it.name" :name="index">
                    <div v-for="(item, index2) in it.children || []" :key="index2+ 'child'">
                        <span style="cursor: pointer;">{{ item.title }}</span>
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
                    </div>
                </el-collapse-item>
            </el-collapse>
            <!-- <ul>
                <li v-for="(item, index) in list" :key="index">
                    <span style="cursor: pointer;">{{ item.name }}</span>
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
            </ul> -->
            
        </div>
        <div v-show="showText" class="vr__tag__relative">
            <div class="vr__tag__edit__title">
                <div class="vr__tag__edit__title__txt">编辑通道</div>
                <i class="el-icon-close" style="font-size: 22px;cursor: pointer;" @click="handleClose"></i>
            </div>
            <el-form
                ref="ruleFormText"
                size="mini"
                :model="ruleFormText"
                :rules="rulesText"
                label-position="top"
                class="demo-ruleForm"
            >
                <el-form-item
                    label="通道类型"
                    prop="type"
                    class="vr__edit__label"
                >
                    <el-radio-group v-model="ruleFormText.type">
                        <el-radio
                            v-for="(item, index) in enumCrm && enumCrm.vr_channel_type" 
                            :key="index+'cha'" 
                            :label="item.value"
                        >{{item.label}}</el-radio>
                    </el-radio-group>
                </el-form-item>
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
                    label="关联点位"
                    prop="location"
                    class="vr__edit__label"
                >
                    <el-select v-model="ruleFormText.location" multiple filterable placeholder="请选择">
                        <el-option
                            v-for="(item, index) in pointList"
                            :key="index+'loca'"
                            :label="item.title"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                    label=""
                    prop="location"
                    class="vr__edit__label"
                >
                    <div class="vr__aisle__tips">
                        <div style="font-weight: bold;color: red;">提示:</div>
                        <div>1，请在实际场景中添加通道附近两个相邻的点位再进行关联；</div>
                        <div>2，如两个通道存在跨场景，需切换到另一个场景设置对应关联点位。</div>
                    </div>
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
    </div>
</template>

<script>
import {
    uploadUrl,
    getVrScenePointList,
    getVrSceneChannelList,
    editVrSceneChannel,
    delVrSceneChannel,
} from "@/api/fiveVR";

export default {
    name: "NavigationAisle",
    components: {
    },
    props: {
        five: {
            type: [Object, Array],
        },
        enumCrm: {
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
                type: '',
                title: "",
                id: '',
                location: '',
            },
            rulesText: {
                title: [
                    {
                        required: true,
                        message: "请输入标题",
                        trigger: "blur",
                    },
                ],
                type: [
                    {
                        required: true,
                        message: "请选择通道类型",
                        trigger: "blur",
                    },
                ],
                location: [
                    {
                        required: true,
                        message: "请选择点位",
                        trigger: ['blur', 'change'],
                    },
                ],
            },
            isEdit: false,
            pointList: [],
            activeNames: [0,1,2,3],
        };
    },
    created() {
        const { groupId, id } = this.$route.query;
        this.groupId = groupId;
        this.sceneId = id;
        this.getVrSceneChannelList();
        this.getVrScenePointList()
        this.$bus.$on('refreshNavigationPoint', () => {
            this.getVrScenePointList()
        })
    },
    methods: {
        submitForm(formName) {
            let params = {
                group_id: this.groupId,
                ...this.ruleFormText
            }
            console.log(666661, params)
            if (this.ruleFormText.type == 4 || this.ruleFormText.type == 5) {
                if (this.ruleFormText.location.length > 2) {
                    this.$message.error('“闭门/垮场景”关联点位不能超过2个!')
                    return
                }
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (params.location?.length) {
                        params.location = params.location.join(',')
                    }
                    editVrSceneChannel(params).then(res => {
                        this.$message.success('操作成功!')
                        this.getVrSceneChannelList()
                        this.handleClose()
                    })
                }
            });
        },
        handleAddText() {
            this.showText = true;
            this.isEdit = true;
            this.ruleFormText = {}
        },
        handleTextEdit(item) {
            this.showText = true;
            this.isEdit = true;
            this.$set(this.ruleFormText, 'id', item.id || '')
            this.$set(this.ruleFormText, 'title', item.title)
            this.$set(this.ruleFormText, 'type', item.type)
            let location = item.location.split(',')
            location = location.map(it => +it)
            this.$set(this.ruleFormText, 'location', location)
        },
        handleDel(item) {
            this.$confirm('确定删除该标签?, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delVrSceneChannel({
                    id: item.id
                }).then(() => {
                    this.$message.success('删除成功!')
                    this.getVrSceneChannelList()
                })
            }).catch(() => {
            })
        },
        getVrSceneChannelList() {
            getVrSceneChannelList({
                group_id: this.groupId,
            }).then((res) => {
                this.list = res.list;
            });
        },
        handleClose() {
            this.showDetail = false;
            this.showText = false;
            this.isEdit = false
        },
        getVrScenePointList() {
            getVrScenePointList({ group_id: this.groupId }).then(res => {
                this.pointList = res.list
            })
        }
    },
};
</script>

<style>
    .el-collapse{
        padding: 0 12px;
        background: #fff;
    }
</style>

<style scoped lang="scss">
    @import './index.scss';
    .vr__aisle{
        padding: 0 0;
        &__tips{
            padding: 20px 0;
            color: #d9d94d;
            
        }
    }
    .vr__aisle__adds{
        background: #545c64;
    }
</style>
