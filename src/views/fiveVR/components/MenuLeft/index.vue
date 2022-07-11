<template>
    <div class="vr__menu">
        <el-menu
            :default-active="active"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            style="height: 100%"
            @select="onChange"
        >
            <el-menu-item
                v-for="(item, index) in list"
                :key="index"
                :index="item.value"
            >
                <span slot="title">{{ item.label }}</span>
            </el-menu-item>
            <el-submenu index="1">
                <template slot="title">
                    <span>内容设置</span>
                </template>
                <el-menu-item v-for="(item, index) in contentList" :key="index" :index="item.value">{{item.label}}</el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>

export default {
    name: "MenuLeft",
    components: {},
    props: {
        enumCrm: {
            type: [Object, Array]
        },
    },
    data() {
        return {
            active: "1-1",
            list: [
                {
                    label: "基础信息",
                    value: "1-1",
                },
                {
                    label: "自动导航",
                    value: "2-1",
                },
                // {
                //     label: "内容设置",
                //     value: "3",
                // },
                {
                    label: "导航管理",
                    value: "4-1",
                },
                {
                    label: "菜单管理",
                    value: "5-1",
                },
            ],
        };
    },
    computed: {
        contentList() {
            let list = this.enumCrm?.vr_content_category || []
            list = list.map(item => {
                item.value = ''+item.value
                return item
            })
            const arr = [
                {
                    label: '标签',
                    value: '0',
                },
                ...list
            ]
            return arr
        },
    },
    created() {
        const { groupId, id, orgId } = this.$route.query;
    },
    mounted: function () {
        this.$bus.$emit("menuLeftChange", this.active);
    },
    methods: {
        onChange(val) {
            this.$bus.$emit("menuLeftChange", val);
        },
    },
};
</script>

<style scoped lang="scss">
.vr__menu {
    height: 100%;
    &__float{
        position: fixed;
        bottom: 50%;
        left: 139px;
        z-index: 1;
        background: rgba(0, 0, 0, 0.4);
        cursor: pointer;
        border-radius: 0 16px 16px 0;
        padding: 14px 5px;
        color: #fff;
    }
}
</style>
