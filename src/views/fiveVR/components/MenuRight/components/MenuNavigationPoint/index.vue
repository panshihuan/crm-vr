<template>
    <div class="vr__basic vr__navigation">
        <header>导览管理</header>
        <div style="display: flex;justify-content: center;">
            <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;" @change="changeTabb">
                <el-radio-button label="1">点位管理</el-radio-button>
                <el-radio-button label="2">通道管理</el-radio-button>
            </el-radio-group>
        </div>
        <div v-show="tabPosition == '1'">
            <NavigationPoint v-if="cacheTabs.includes('1') || tabPosition == 1" :enumCrm="enumCrm" :five="five" :floorIndex="floorIndex" />
        </div>
        <div v-show="tabPosition == '2'">
            <NavigationAisle v-if="cacheTabs.includes('2') || tabPosition == 2" :enumCrm="enumCrm" :five="five" />
        </div>
    </div>
</template>

<script>
// 基础设置
import { GET_WORK_BY_CODE } from "@/api/fiveVR";
import NavigationAisle from './components/Aisle/index'
import NavigationPoint from './components/Point/index'

export default {
    name: "MenuNavigationPointEdit",
    components: {
        NavigationAisle,
        NavigationPoint
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
            tabPosition: '1',
            cacheTabs: []
        };
    },
    created() {
        
    },
    methods: {
        changeTabb(val) {
            if (!this.cacheTabs.includes(val)) {
                this.cacheTabs.push(val)
            }
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
    }
    .vr__navigation{
        padding-bottom: 100px;
    }
    
</style>
