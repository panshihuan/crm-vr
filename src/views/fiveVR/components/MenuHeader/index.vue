<template>
    <div class="vr__title">
        <div class="vr__title__flex">
            <section></section>
            
            <el-popover
                placement="bottom"
                trigger="click"
            >
                <el-tabs tab-position="left" v-model="vrId" @tab-click="changeTab">
                    <el-tab-pane v-for="(item, index) in tabs" :key="index+'tabs'" :name="''+item.id" :label="item.title"></el-tab-pane>
                </el-tabs>
                <div slot="reference" class="vr__title__middle">
                    <section class="vr__title__title">{{title}}</section>
                    <i class="el-icon-caret-bottom" style="padding-left: 8px;"></i>
                </div>
            </el-popover>
            <section>
                <el-button type="success" round size="small" @click="handlePreview">预览</el-button>
            </section>
        </div>
        
    </div>
</template>

<script>

import { getVrSceneGroupList } from '@/api/fiveVR'

export default {
    name: 'MenuHeader',
    components: {
    },
    data() {
        return {
            title: '',
            vrId: "",
            tabs: [],
            groupId: "",
            orgId: "",
            sid: "",
        }
    },
    created() {
        this.$bus.$on('getBasicInfo', res => {
            this.title = res.title
        })
        const { groupId, id, orgId, sid } = this.$route.query;
        this.vrId = "" + id;
        this.groupId = groupId;
        this.orgId = orgId;
        this.sid = sid;
        this.getGroupList()
    },
    mounted: function () {
    },
    methods:{
        handlePreview() {
            const { orgId, sid } = this.$route.query;
            window.open(`https://vrar.bookan.com.cn/?id=${sid}&gid=${this.groupId}`,'_blank');
        },
        getGroupList() {
            getVrSceneGroupList({
                orgid: this.orgId,
                group_id: this.groupId,
                page: 1,
                limit: 100,
            })
                .then((res = {}) => {
                    this.tabs = res?.list || [];
                })
                .catch(() => {
                    this.loading = false;
                });
        },
        changeTab(val) {
            const item = this.tabs[val.index];
            this.$router.push({
                name: "FiveVR",
                query: {
                    groupId: this.groupId,
                    id: item.id,
                    title: val.title,
                    orgId: this.orgId,
                    sid: this.sid
                },
            });
            location.reload();
        },
    }
}
</script>

<style scoped lang="scss">
    .vr__title{
        height: 100%;
        border-bottom: 1px solid #fff;
        color: #fff;
        padding: 0 20px;
        &__title{
            font-size: 18px;
        }
        &__flex{
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        &__float{
            position: fixed;
            top: 29px;
            left: 50%;
            z-index: 1;
            background: rgba(0, 0, 0, 0.4);
            cursor: pointer;
            border-radius: 0 16px 16px 0;
            padding: 22px 5px;
            color: #fff;
            transform: rotate(90deg);
        }
        &__middle{
            display: flex;
            align-items: center;
            cursor: pointer;
        }
    }
</style>
