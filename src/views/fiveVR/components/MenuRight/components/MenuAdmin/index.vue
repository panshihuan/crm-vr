<template>
    <div class="vr__admin" style="position:relative;" :class="pinchModal ? 'drawer': ''">
        <header>菜单管理</header>
        <!-- <div class="vr__admin__shade"></div> -->
        <main>
            <el-button
                type="primary"
                size="mini"
                style="margin: 10px 0 20px 0"
                @click="handleAdd"
                >新增</el-button
            >
            <div class="vr__admin__menus" v-loading="loadingMenu">
                <Container
                    @drop="onDrop"
                    :get-ghost-parent="getGhostParent"
                    :remove-on-drop-out="true"
                    @drop-ready="onDropReady"
                >
                    <Draggable v-for="(item, index) in menuList" :key="index">
                        <div>
                            <section class="vr__admin__item">
                                <p
                                    class="vr__admin__item__p"
                                    @click="handleEdit(item)"
                                >
                                    {{ item.name }}
                                </p>
                                <div class="vr__admin__item__icons">
                                    <el-switch
                                        v-model="item.status"
                                        active-color="#13ce66"
                                        :active-value="activeValue"
                                        :inactive-value="inactiveValue"
                                        @change="changeSwitch"
                                    >
                                    </el-switch>
                                    <div class="vr__admin__item__sort">
                                        <i class="el-icon-sort"></i>
                                    </div>
                                </div>
                            </section>
                            <Container
                                @drop="(val) => onDrop3(val, item.children)"
                                :get-ghost-parent="getGhostParent"
                                :remove-on-drop-out="true"
                            >
                                <Draggable v-for="(child, index) in item.children" :key="index+'child'">
                                    <section style="padding-left: 20px;" class="vr__admin__item">
                                        <p
                                            class="vr__admin__item__p"
                                            style="color: #eb8ad5;"
                                            @click="handleEdit(child)"
                                        >
                                            {{ child.name }}
                                        </p>
                                        <div class="vr__admin__item__icons">
                                            <el-switch
                                                v-model="child.status"
                                                active-color="#c520a0"
                                                inactive-color="#f3ecd5"
                                                :active-value="activeValue"
                                                :inactive-value="inactiveValue"
                                                @change="changeSwitch"
                                            >
                                            </el-switch>
                                            <div class="vr__admin__item__sort">
                                                <i class="el-icon-sort"></i>
                                            </div>
                                        </div>
                                    </section>
                                </Draggable>
                            </Container>
                            
                        </div>
                    </Draggable>
                </Container>
            </div>
        </main>
        <el-drawer
            title="菜单编辑"
            :visible.sync="drawer"
            direction="ltr"
            :size="pinchModal ? '100%': '65%'"
            :modal="false"
            :wrapperClosable="false"
            @closed="onClosed"
        >
            <div class="vr__admin__edit">
                <div v-show="!pinchModal" v-if="!(currentItem && currentItem.p_id)" style="height: 50px; padding-bottom:15px;">
                    <div v-if="isSecondLevel"  class="vr__admin__second">
                        <el-breadcrumb separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item>{{currentItem.name}}</el-breadcrumb-item>
                            <el-breadcrumb-item>二级菜单</el-breadcrumb-item>
                        </el-breadcrumb>
                        <el-button size="mini" style="margin-left: 55px;" @click="handleAddSecondCancel">取消二级菜单</el-button>
                    </div>
                    <el-button v-if="ruleForm.id && !isSecondLevel" size="mini" type="primary" @click="handleAddSecond">新增二级菜单</el-button>
                </div>
                <div v-show="!pinchModal" class="vr__admin__data">
                    <el-form
                        ref="ruleForm"
                        size="mini"
                        :model="ruleForm"
                        label-width="80px"
                        :inline="true"
                        :rules="rules"
                    >
                        <el-form-item label="菜单名称" prop="name">
                            <el-input
                                v-model="ruleForm.name"
                                placeholder="请填写菜单名称"
                                maxlength="6"
                                :disabled="isSecondLevel ? false : (currentItem && currentItem.type!=0) ? true : false"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="上传icon" prop="files">
                            <UploadAll
                                v-model="ruleForm.files"
                                :uploadUrl="uploadUrl"
                                uploadText="上传图片"
                                maxFile="200"
                                @change="changeFile"
                            />
                        </el-form-item>
                        <el-form-item label="" prop="files">
                            <el-image
                                v-if="sureRadioIcon"
                                style="width: 45px; height: 45px;cursor: pointer;"
                                :src="sureRadioIcon"
                                fit="contain"
                                @click="handleIcon"
                            >
                            </el-image>
                            <el-button v-else type="primary" @click="handleIcon">图标库<i class="el-icon-goods el-icon--right"></i></el-button>
                        </el-form-item>
                    </el-form>
                    <el-divider>关联平面内容</el-divider>
                    <div v-if="!isSecondLevel && currentItem && currentItem.content && currentItem.content.id" class="vr__admin__content">
                        <section>
                            <label>关联内容：</label>
                            <span>{{currentItem.content.target_desc}}</span>
                            <span>（{{currentItem.content.type_view}}）</span>
                        </section>
                    </div>

                    <div v-if="ruleForm.id && tabs && tabs.length" class="vr__admin__table">
                        <el-tabs tab-position="left" v-model="tabsValue" @tab-click="changeTab">
                            <el-tab-pane
                                v-for="(item, index) in tabs"
                                :key="index"
                                :name="item.value"
                                :label="item.label"
                            >
                                <el-table
                                    :data="tableData"
                                    size="mini"
                                    style="width: 100%"
                                    v-loading="loadingTable"
                                    highlight-current-row
                                    max-height="450"
                                >
                                    <el-table-column
                                        prop="desc"
                                        label="名称"
                                        align="center"
                                    >
                                        <template slot-scope="scope">
                                            <el-button
                                                type="text"
                                                size="small"
                                                @click="handlePano(scope.row)"
                                            >{{scope.row.desc || scope.row.name}}</el-button>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        fixed="right"
                                        label="操作"
                                        width="100"
                                        align="center"
                                    >
                                        <template slot-scope="scope">
                                            <span v-if="scope.row.isAdd">已添加</span>
                                            <el-button
                                                v-else
                                                type="text"
                                                size="small"
                                                @click="handleClick(scope.row)"
                                            >添加</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <div v-if="currentItem && currentItem.type == 6" style="padding-top: 30px;">
                        <el-divider>排序</el-divider>
                        <div class="vr__admin__video__container">
                            <Container
                                @drop="onDrop2"
                                :get-ghost-parent="getGhostParent"
                                :remove-on-drop-out="true"
                            >
                                <Draggable v-for="(item, index) in videoList" :key="index+'video'">
                                    <section class="vr__admin__video">
                                        <p
                                            class="vr__admin__video__p"
                                        >
                                            {{ item.desc }}
                                        </p>
                                        <i class="el-icon-sort"></i>
                                    </section>
                                </Draggable>
                            </Container>
                        </div>
                    </div>
                </div>
                
                <div class="vr__admin__footer">
                    <i v-if="pinchModal" class="el-icon-right" style="color:green;font-size: 40px;cursor: pointer;position: fixed;bottom: 15px;left: 100px;" @click="handlePinchModal"></i>
                    <div class="vr__admin__footer__btns" v-else>
                        <i class="el-icon-back" style="color:green;font-size: 40px;cursor: pointer;" @click="handlePinchModalelse"></i>
                        <div>
                            <el-button type="danger" @click="handleDel">删 除</el-button>
                            <el-button @click="handleCancel">取 消</el-button>
                            <el-button
                                type="primary"
                                @click="handleSubmit"
                                :loading="loading"
                                >保存</el-button
                            >
                        </div>
                    </div>
                </div>
            </div>
        </el-drawer>
        <el-dialog
            title="图标库"
            :visible.sync="dialogVisibleIcon"
            width="50%"
        >
        <div>
            <el-radio-group v-model="radioIcon" size="mini">
                <el-radio-button style="margin: 0 0px 10px 0" v-for="(item, index) in enumCrm.vr_group_menu_icon" :key="index+'icon'" :label="item.value">
                    <el-image
                        style="width: 35px; height: 35px;"
                        :src="item.value"
                        fit="contain"
                    >
                    </el-image>
                </el-radio-button>
            </el-radio-group>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleIcon = false">取 消</el-button>
            <el-button type="primary" @click="handleSubmitIcon">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
// 基础设置
import {
    initGroupMenu,
    getVrGroupMenuList,
    editVrGroupMenu,
    uploadUrl,
    editVrGroupMenuInfo,
    getVrSceneContentList,
    getVrSceneTagList,
    attachVrGroupMenuContent,
    delVrGroupMenu,
    sortVrSceneContent,
} from "@/api/fiveVR";
import FileShow from "@/components/FileShow/index";
import HtmlToImg from "@/components/HtmlToImg/index";
import { Container, Draggable } from "vue-smooth-dnd";
import { arrMove } from "@/utils/sortList";
import UploadAll from "@/components/UploadAll/index";
import { cameraToVec3 } from '@/views/fiveVR/assets/js/tools'
import { mapState, mapActions } from 'vuex'

export default {
    name: "MenuAdmin",
    components: {
        FileShow,
        HtmlToImg,
        Container,
        Draggable,
        UploadAll,
    },
    props: {
        five: {
            type: [Object, Array],
        },
        enumCrm: {
            type: [Object, Array],
        },
    },
    data() {
        return {
            groupId: "",
            sceneId: "",
            extra: {},
            menuList: [],
            value: "",
            activeValue: 1,
            inactiveValue: 0,
            drawer: false,
            ruleForm: {
                id: "",
            },
            uploadUrl: uploadUrl,
            rules: {
                name: [
                    {
                        required: true,
                        message: "请输入名称",
                        trigger: "blur",
                    },
                ],
            },
            loading: false,
            loadingTable: false,
            loadingMenu: false,
            tabs: [],
            tableData: [],
            tabsValue: '0',
            pinchModal: false,
            currentItem: null,
            videoList: [],
            isSecondLevel: false,
            dialogVisibleIcon: false,
            radioIcon: '',
            sureRadioIcon: '',
        };
    },
    created() {
        const { groupId, id } = this.$route.query;
        this.groupId = groupId;
        this.sceneId = id;
        this.getMenuList();
        this.getVRvideoList()
        setTimeout(() => {
            this.getTabs();
            this.getVrSceneContentList()
        }, 1000)
    },
    methods: {
        ...mapActions('vr', [
            'getVrGroupMenuList'
        ]),
        // 获取菜单列表
        getMenuList() {
            this.loadingMenu = true
            this.getVrGroupMenuList({ group_id: this.groupId })
            return getVrGroupMenuList({
                group_id: this.groupId,
            }).then((res) => {
                this.menuList = res || [];
                this.loadingMenu = false
                return res
            }).catch(() => {
                this.loadingMenu = false
            });
        },
        sortList(arr, oldIndex, newIndex) {
            const list = arrMove(arr, oldIndex, newIndex);
            const newList = list.map((item, index) => {
                item.sort = list.length - index;
                return item;
            });
            return newList;
        },
        onDrop(val) {
            this.loadingMenu = true
            const arr = _.cloneDeep(this.menuList);
            const newList = this.sortList(
                arr,
                val.removedIndex,
                val.addedIndex
            );
            this.menuList = newList;
            editVrGroupMenu({
                group_id: this.groupId,
                menu_list: JSON.stringify(newList),
            }).then((res) => {
                this.$message.success("设置成功!");
                this.getMenuList();
            }).catch(() => {
                this.loadingMenu = false
            })
        },
        onDrop3(val, children) {
            this.loadingMenu = true
            const arr = _.cloneDeep(children);
            const newList = this.sortList(
                arr,
                val.removedIndex,
                val.addedIndex
            );
            const p_id = children[0].p_id
            const newData = this.menuList.map(item => {
                if (item.id == p_id) {
                    item.children = newList
                }
                return item
            })
            this.menuList = newData
            editVrGroupMenu({
                group_id: this.groupId,
                menu_list: JSON.stringify(newList),
            }).then((res) => {
                this.$message.success("设置成功!");
                this.getMenuList();
            }).catch(() => {
                this.loadingMenu = false
            })
        },
        onDrop2(val) {
            const arr = _.cloneDeep(this.videoList);
            const newList = this.sortList(
                arr,
                val.removedIndex,
                val.addedIndex
            );
            this.videoList = newList;
            const sortList = this.videoList.map(item => {
                const r = {
                    content_id: item.id,
                    sort: item.sort
                }
                return r
            })
            const params = {
                sorts: JSON.stringify(sortList)
            }
            sortVrSceneContent(params).then(() => {
                this.$message.success('设置成功!')
            })
        },
        getGhostParent() {
            return document.body;
        },
        onDropReady(dropResult) {},
        handleAdd() {
            this.ruleForm = {};
            this.radioIcon = ""
            this.sureRadioIcon = ""
            this.drawer = true;
            this.currentItem = null
        },
        handleEdit(val) {
            this.currentItem = val
            this.$set(this.ruleForm, "id", val.id);
            if (this.isIcons(val.icon)) {
                this.radioIcon = val.icon
                this.sureRadioIcon = val.icon
                this.$set(this.ruleForm,"files", []);
            } else {
                this.$set(this.ruleForm,"files",val.icon ? [{ url: val.icon }] : []);
                this.radioIcon = ""
                this.sureRadioIcon = ""
            }
            this.$set(this.ruleForm, "name", val.name);
            this.drawer = true;
            this.getVrSceneContentList()
        },
        isIcons(url) { // 判断是否为图标库里面的url
            return this.enumCrm.vr_group_menu_icon.some(item => item.value == url)
        },
        handleSubmit() {
            this.$refs["ruleForm"].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    const params = {
                        id: this.ruleForm.id || '',
                        group_id: this.groupId,
                        name: this.ruleForm.name,
                        icon: this.sureRadioIcon ? this.sureRadioIcon : this.ruleForm?.files?.length ? this.ruleForm?.files[0]?.url : ''
                    };
                    if (this.isSecondLevel) { // 二级菜单
                        params.p_id = this.currentItem.id
                        params.type = 0
                    }
                    editVrGroupMenuInfo(params).then((res) => {
                        this.loading = false;
                        this.$message.success("操作成功!");
                        this.handleCancel()
                        this.getMenuList()
                    }).catch(() => {
                        this.loading = false;
                    });
                }
            });
        },
        handleCancel() {
            this.drawer = false
            this.pinchModal = false
            this.isSecondLevel = false
        },
        onClosed() {
            this.pinchModal = false
        },
        handleDel() {
            if (!this.ruleForm.id) {
                this.$message.error('没有生成的菜单！')
                return
            }
            this.$confirm('此操作将删除该菜单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delVrGroupMenu({ id: this.currentItem.id }).then(() => {
                    this.getMenuList()
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.drawer = false
                })
            }).catch(() => {
            });
        },
        getTabs() {
            let list = this.enumCrm?.vr_content_category || [];
            list = list.map((item) => {
                item.value = "" + item.value;
                return item;
            });
            const arr = [
                {
                    label: "标签",
                    value: "0",
                },
                ...list,
            ];
            this.tabs = arr;
        },
        changeTab(val) {
            this.getVrSceneContentList()
        },
        getVrSceneContentList() {
            this.loadingTable = true
            if (this.tabsValue == 0) {
                return getVrSceneTagList({
                    group_id: this.groupId,
                    vr_id: this.sceneId,
                }).then((res) => {
                    this.tableData = res.list;
                    this.loadingTable = false
                    this.findStatusContent()
                }).catch(() => {
                    this.loadingTable = false
                });
            } else {
                return getVrSceneContentList({
                    group_id: this.groupId,
                    vr_id: this.sceneId,
                    type: this.tabsValue
                }).then((res) => {
                    this.tableData = res.list;
                    this.loadingTable = false
                    this.findStatusContent()
                }).catch(() => {
                    this.loadingTable = false
                });
            }
        },
        getVRvideoList() {
            getVrSceneContentList({
                group_id: this.groupId,
                vr_id: this.sceneId,
                type: 3
            }).then((res) => {
                this.videoList = res.list || [];
            })
        },
        findStatusContent() {
            if (this.currentItem?.content?.target_id) {
                const index = this.tableData.findIndex(item => item.id == this.currentItem.content.target_id)
                if (index || index == 0) {
                    const current = this.tableData[index]
                    current.isAdd = true
                    this.$set(this.tableData, index, current)
                }
            }
        },
        handleClick(val) {
            const type = this.tabsValue == 0 ? 1 : 2
            const params = {
                group_id: this.groupId,
                target_id: val.id,
                menu_id: this.currentItem.id,
                type
            }
            console.log(666666, params)
            attachVrGroupMenuContent(params).then(() => {
                this.$message.success('操作成功!')
                this.getMenuList().then((menuList) => {
                    const newMenu = menuList.find(item => item.id == this.currentItem.id)
                    this.currentItem = newMenu
                }).then(() => {
                    this.getVrSceneContentList()
                })
            })
        },
        handlePinchModal() {
            this.pinchModal = false
        },
        handlePinchModalelse() {
            this.pinchModal = true
        },
        handlePano(item) {
            this.pinchModal = true
            const panoIndex = item.pano_index || item.pano_index ==0 ? item.pano_index : item?.extra?.info?.panoIndex
            this.five.moveToPano(panoIndex)
            setTimeout(() => {
                cameraToVec3(item.position, this.five)
            }, 3000)
        },
        changeSwitch() {
            this.loadingMenu = true
            editVrGroupMenu({
                group_id: this.groupId,
                menu_list: JSON.stringify(this.menuList),
            }).then((res) => {
                this.$message.success("设置成功!");
                this.getMenuList();
            }).catch(() => {
                this.loadingMenu = false
            })
        },
        handleAddSecond() {
            this.isSecondLevel = true
            // this.currentItem = val
            this.$set(this.ruleForm, "id", '');
            this.$set(this.ruleForm,"files",[]);
            this.$set(this.ruleForm, "name", '');
            this.sureRadioIcon = ''
        },
        handleAddSecondCancel() {
            this.isSecondLevel = false
            this.handleEdit(this.currentItem)
        },
        handleIcon() {
            this.dialogVisibleIcon = true
        },
        handleSubmitIcon() {
            this.$set(this.ruleForm, 'files', [])
            if (this.radioIcon) {
                this.sureRadioIcon = this.radioIcon
            }
            this.dialogVisibleIcon = false
        },
        changeFile() {
            if (this.ruleForm?.files?.length) {
                this.radioIcon = ''
                this.sureRadioIcon = ''
            }
        },
    },
};
</script>

<style>
    .drawer .el-drawer__wrapper{
        right: calc(100% - 170px);
        transition : ease-in-out 0.18s;
    }
    .smooth-dnd-container{
        min-height: 0;
    }
    .vr__admin .el-upload-list--picture .el-upload-list__item-thumbnail {
        height: 35px;
        width: 35px;
    }
    .vr__admin .el-upload-list--picture .el-upload-list__item{
        height: 55px;
    }
    .vr__admin .el-upload-list--picture .el-upload-list__item.is-success .el-upload-list__item-name{
        line-height: 35px;
    }
</style>

<style scoped lang="scss">
    @import './index.scss';
</style>
