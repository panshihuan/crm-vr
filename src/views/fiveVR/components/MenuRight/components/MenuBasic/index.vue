<template>
    <div class="vr__basic">
        <header>基础信息</header>
        <main>
            <div class="vr__basic__info">
                <section>
                    <label>场景名称：</label><span>{{info.rs_name}}</span>
                </section>
                <section>
                    <label>场景描述：</label><span>{{info.desc}}</span>
                </section>
                <section>
                    <label>创建时间：</label><span>{{info.created_at}}</span>
                </section>
                <section style="display: flex;">
                    <label>封面：</label><span>
                        <FileShow :list="info.cover" />
                    </span>
                </section>
            </div>
            <el-form ref="form" :model="form">
                <el-form-item
                    label="校对楼层"
                    prop="name"
                    class="vr__edit__label"
                >
                    <el-input
                        v-model="form.correct_floor_index"
                        placeholder="请填写楼层"
                    ></el-input>
                </el-form-item>

                <el-form-item
                    label="设置初始视角"
                    class="vr__edit__label"
                >
                <br>
                    <HtmlToImg :initData="initData" :five="five" @change="changeUrl"/>
                </el-form-item>

                 <el-divider></el-divider>

                <el-form-item style="margin-bottom: 50px;">
                    <el-button type="primary" @click="onSubmit">保存</el-button>
                    <el-button @click="handleCancel">取消</el-button>
                </el-form-item>

            </el-form>
        </main>
    </div>
</template>

<script>
// 基础设置
import { getVrScene, editVrSceneGroupInfo } from "@/api/fiveVR";
import FileShow from '@/components/FileShow/index';
import HtmlToImg from '@/components/HtmlToImg/index';
import { cameraToVec3 } from "@/views/fiveVR/assets/js/tools";
import { moveAndCamera } from '@/utils/moveAndCamera'

export default {
    name: "MenuBasicEdit",
    components: {
        FileShow,
        HtmlToImg
    },
    props: {
        five: {
            type: [Object, Array],
        },
    },
    data() {
        return {
            groupId: '',
            sceneId: '',
            info: {},
            form: {
                correct_floor_index: '',
            },
            initData: null,
            extra: {},
            currentState: null,
        };
    },
    created() {
        const { groupId, id } = this.$route.query;
        this.groupId = groupId;
        this.sceneId = id;
        this.getData()
        this.five.on("modelLoaded", () => {
            // 与 getData 异步gate，竞争
            if (this.currentState) {
                this.moveCam()
            }
        });
    },
    methods: {
        async getData() {
            getVrScene({
                group_id: this.groupId,
                vr_id: this.sceneId
            }).then(res => {
                this.$bus.$emit('getBasicInfo', res)
                this.info = res
                this.initData = res?.extra
                this.extra = res?.extra
                this.$set(this.form, 'correct_floor_index', res.correct_floor_index)
                if (res?.extra?.state) {
                    const state = res.extra.state
                    this.currentState = state
                    if (this.five?.controller?.model?.loaded) {
                        this.moveCam()
                    }
                }
            })
        },
        moveCam() {
            this.five.moveToPano(this.currentState.panoIndex, {
                moveEndCallback: () => {
                    setTimeout(() => {
                        this.five.setState({
                            longitude: this.currentState.longitude,
                            latitude: this.currentState.latitude
                        })
                    }, 200)
                }
            })
        },
        onSubmit(val) {
            let params = {
                group_id: this.groupId,
                vr_id: this.sceneId,
            }
            params.extra = JSON.stringify(this.extra)
            // if (val === 'extra') {
            //     params.extra = JSON.stringify(this.extra)
            // } else {
            //     params = { ...params, ...this.form }
            // }
            console.log(666, params)
            editVrSceneGroupInfo(params).then(res => {
                this.$message.success('修改成功!')
                this.getData()
            })
        },
        handleCancel() {
            this.getData()
        },
        changeUrl(val) {
           this.extra = val
        //    this.onSubmit('extra')
        }
    },
};
</script>

<style scoped lang="scss">
    .vr__basic{
        padding: 15px;
        header{
            font-weight: bold;
            margin-bottom: 15px;
            color: #ffd04b;
        }
        &__info{
            section{
                margin-top: 7px;
            }
            label{ 
                padding-right: 12px;
                color: #eee;
            }
        }
    }
    
</style>
