<template>
    <div class="vr__basic vr__navigation">
        <header>自动导览</header>
        <main>
            <div class="vr__navigation__btns">
                <div>
                    <div style="display: flex;align-items: center;">
                        <i v-if="state==1" class="el-icon-video-camera-solid" @click="handleStartRecord"></i>
                        <i v-if="state==1 && records.length" class="el-icon-caret-right" @click="handlePlay"></i>
                        <span v-if="state==2" class="vr__navigation__pause" @click="handleStopRecord"></span>
                        <span v-if="state==3" class="vr__navigation__stop" @click="handlePauseRecord"></span>
                    </div>
                    <div v-if="state==2" class="vr__navigation__doing">
                        <span>正在录制中......</span>    
                    </div>
                </div>
                <el-popover
                    placement="right"
                    width="400"
                    trigger="click"
                >
                    <div class="vr__navigation__panos">
                        <div v-for="(p, i) in panoIndexs" class="vr__navigation__pano" :key="i+'p'">
                            <span @click="handlePano(p)">{{p.title}}</span>
                        </div>
                    </div>
                    <el-button type="text" slot="reference">查看点位</el-button>
                </el-popover>
                
            </div>
            <el-button v-if="state==2" class="vr__navigation__add" size="small" @click="addRecord">+ 添加关键帧</el-button>
            <el-button v-if="state==1 && records.length" type="danger" class="vr__navigation__add" size="small" @click="clearRecord">清空全部</el-button>
            <div class="vr__navigation__tags">
                <el-tag
                    v-for="(item, index) in records"
                    :key="index+'tag'"
                    closable
                    :disable-transitions="false"
                    @close="handleCloseTag(index)">
                    帧 {{index + 1}}
                </el-tag>
            </div>

            <div class="vr__line"></div>

            <el-form
                ref="ruleForm"
                size="mini"
                :model="ruleForm"
                :rules="rules"
                label-position="top"
                class="demo-ruleForm"
            >
                <el-form-item
                    label="背景音乐类型"
                    prop="bgm_url_type"
                    class="vr__edit__label"
                >
                    <el-radio-group v-model="ruleForm.bgm_url_type">
                        <el-radio v-for="(item, index) in enumCrm && enumCrm.vr_navigate_bgm" :key="index+'enm'" :label="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                    label="上传讲解音频"
                    prop="files"
                    class="vr__edit__label"
                >
                    <UploadAll
                        v-model="ruleForm.files"
                        :uploadUrl="uploadUrl"
                        uploadText="上传讲解音频文件"
                        maxFile=200
                        listType="text"
                    />
                </el-form-item>
            </el-form>

        </main>
        <div class="vr__tag__submit">
            <el-button type="primary" @click="submitForm('ruleForm')"
                >保存</el-button
            >
            <el-button :disabled="!recordList.length || (recordList.length && recordList[0].status == 1)" type="danger" @click="handlePush"
                >发布</el-button
            >
        </div>
    </div>
</template>

<script>
// 基础设置
import { uploadUrl, editVrSceneNavigate, getVrSceneNavigateList, releaseVrSceneNavigate, getVrScenePointList } from "@/api/fiveVR";
import { Recorder } from "./recorder";
import UploadAll from "@/components/UploadAll/index";
import { moveAndCamera } from '@/utils/moveAndCamera'

export default {
    name: "MenuNavigationEdit",
    components: {
        UploadAll
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
            groupId: '',
            sceneId: '',
            uploadUrl: uploadUrl,
            state: 1, // 1暂停，2正在录制，3正在播放
            recorder: null,
            ruleForm: {
                bgm_url_type: '',
            },
            extra: [],
            rules: {},
            records: [],
            recordList: [],
            panoIndexs: [], // 拍摄点位
        };
    },
    created() {
        const { groupId, id } = this.$route.query;
        this.groupId = groupId;
        this.sceneId = id;
        this.recorder = new Recorder();
        this.getVrSceneNavigateList()
        this.getVrScenePointList()
        // this.five.on("stateChange", state => {
            // this.recorder.record(state);
        // });
    },
    mounted() {
    },
    methods: {
        handleStartRecord() {
            this.state = 2
            this.recorder.startRecording()
        },
        handleStopRecord() {
            this.state = 1
            this.recorder.endRecording();
        },
        handlePauseRecord() {
            this.recorder.stopPlay();
            this.state = 1
        },
        handlePlay() {
            this.state = 3
            const hasReocrd = this.recorder.play((state, isFinal) => {
                this.five.setState(state);
                if (isFinal) {
                    this.state = 1
                }
            });
        },
        addRecord() {
            this.recorder.record(this.five.state)
            this.getRecords()
        },
        clearRecord() {
            this.recorder.clearRecords()
            this.getRecords()
        },
        getRecords() {
            const records = this.recorder.getRecords()
            this.records = records
        },
        handleCloseTag(index) {
            this.recorder.delRecord(index)
            this.getRecords()
        },
        submitForm(formName) {
            // this.$refs[formName].validate((valid) => {
            //     if (valid) {
                    
            //     } else {
            //     }
            // });
            const {
                id, // 有id则是修改，否则是新增
                bgm_url_type,
                files,
            } = this.ruleForm
            const extra = [
                ...this.records
            ]
            const params = {
                id: id || '',
                group_id: this.groupId,
                vr_id: this.sceneId,
                narration_url: files ? files[0]?.url : '',
                bgm_url_type,
                extra: JSON.stringify(extra)
            }
            editVrSceneNavigate(params).then(res => {
                this.$message.success('操作成功!')
                this.state = 1
                this.getVrSceneNavigateList()
            })
        },
        getVrSceneNavigateList() {
            getVrSceneNavigateList({
                group_id: this.groupId,
                vr_id: this.sceneId,
            }).then(res => {
                if (res.list.length) {
                    this.$set(this.ruleForm, 'id', res.list[0]?.id || '')
                    this.$set(this.ruleForm, 'bgm_url_type', res?.list[0]?.bgm_url_type)
                    const files = [{
                        url: res?.list[0]?.narration_url,
                        name: '文件'
                    }]
                    this.$set(this.ruleForm, 'files', files)
                    this.records = res?.list[0].extra
                    this.recorder.initData(this.records)
                    this.recordList = res.list
                }
            })
        },
        handlePush() {
            releaseVrSceneNavigate({
                id: this.recordList[0]?.id
            }).then(res => {
                this.getVrSceneNavigateList()
            })
        },
        getVrScenePointList() {
            getVrScenePointList({
                group_id: this.groupId,
                vr_id: this.sceneId
            }).then((res) => {
                console.log(1233333, res)
                this.panoIndexs = res.list;
            });
        },
        handlePano(item) {
            moveAndCamera(item, this.five, item.pano_index, item.point)
        }
    },
};
</script>

<style>
    .el-tag{
        margin-left: 10px;
        margin-top: 10px;
    }
    .el-radio{
        margin-bottom: 7px;
    }
</style>

<style scoped lang="scss">
    @import '../Tag/index.scss';

    .vr__basic{
        padding: 15px;
        header{
            font-weight: bold;
            margin-bottom: 15px;
            color: #ffd04b;
        }
    }

    .vr__line{
        width: 100%;
        height: 2px;
        background: #fff;
        margin: 24px 0;
    }

    .vr__navigation{
        &__pause {
            display: inline-block;
            width: 11px;
            height: 11px;
            background: #fff;
            cursor: pointer;
        }
        &__btns{
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 22px;
            i{
                padding-right: 15px;
                font-size: 22px;
                cursor: pointer;
            }
        }
        &__doing{
            color: red;
            padding-left: 20px;
        }
        &__tags{
            padding: 15px 0;
        }
        &__add{
            margin-top: 20px;
            height: 32px;
            line-height: 30px;
            padding-top: 0;
            padding-bottom: 0;
        }
        &__stop{
            display: inline-block;
            width: 14px;
            height: 14px;
            background: url('../../../../assets/img/pause.svg') no-repeat center;
            background-size: cover;
            margin-left: 15px;
            cursor: pointer;
        }
        &__panos{
            overflow-y: auto;
            max-height: 60vh;
        }
        &__pano{
            cursor: pointer;
            color: green;
            margin-bottom: 3px;
        }
    }
    
</style>
