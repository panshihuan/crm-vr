<template>
    <div class="vr__content vr__basic">
        <div class="vr__content__tabs">
            <header>内容设置 —— {{typeTitle}}</header>
            <main>
                <div v-show="activeName == '0'">
                    <TagEdit :five="five" v-if="cacheTabs.includes('0') || activeName == '0'"/>
                </div>
                <div v-show="activeName == '1'">
                    <PlaneEdit :five="five" type='1' :enumCrm="enumCrm" v-if="cacheTabs.includes('1') || activeName == '1'"/>
                </div>
                <div v-show="activeName == '2'">
                    <PlaneEdit :five="five" type='2' :enumCrm="enumCrm" v-if="cacheTabs.includes('2') || activeName == '2'"/>
                </div>
                <div v-show="activeName == '3'">
                    <ArVedio :five="five" type='3' :enumCrm="enumCrm" v-if="cacheTabs.includes('3') || activeName == '3'"/>
                </div>
                <div v-show="activeName == '4'">
                    <PlaneEdit :five="five" type='4' :enumCrm="enumCrm" v-if="cacheTabs.includes('4') || activeName == '4'"/>
                </div>
                <div v-show="activeName == '5'">
                    <ModelEdit :five="five" type='5' :enumCrm="enumCrm" v-if="cacheTabs.includes('5') || activeName == '5'"/>
                </div>
                <div v-show="activeName == '6'">
                    <TreasureEdit :five="five" type='6' :enumCrm="enumCrm" v-if="cacheTabs.includes('6') || activeName == '6'"/>
                </div>
                <div v-show="activeName == '7'">
                    <ResourceEdit :five="five" type='7' :enumCrm="enumCrm" v-if="cacheTabs.includes('7') || activeName == '7'"/>
                </div>
            </main>
        </div>
        
    </div>
</template>

<script>
// 基础设置
import { GET_WORK_BY_CODE } from "@/api/fiveVR";
import TagEdit from '../Tag/index'
import PlaneEdit from '../Plane/index'
import ModelEdit from '../Model/index'
import TreasureEdit from '../Treasure/index'
import ResourceEdit from '../Resource/index'
import ArVedio from '../ArVedio/index'
import { getCrmEnum } from '@/api/common';

export default {
    name: "MenuContentEdit",
    components: {
        TagEdit,
        PlaneEdit,
        ModelEdit,
        TreasureEdit,
        ArVedio,
        ResourceEdit
    },
    props: {
        five: {
            type: [Object, Array],
        },
        activeName: {
            type: String,
            default: '1'
        },
        enumCrm: {
            type: [Object, Array],
            default: []
        },
    },
    data() {
        return {
            tabs: [],
            cacheTabs: [],
        };
    },
    computed: {
        typeTitle() {
            const arr = this.enumCrm?.vr_content_category || []
            return arr.find(item => item.value == this.activeName)?.label || '标签'
        }
    },
    watch: {
        activeName(val) {
            this.handleClick(val)
        }
    },
    created() {
    },
    methods: {
        handleClick(tab) {
            this.$bus.$emit('vrTabEditChange')
            if (!this.cacheTabs.includes(tab)) {
                this.cacheTabs.push(tab)
            }
        },
    },
}
</script>

<style>
    .vr__content__tab{
        width: 100%;
    }
    .vr__content__tab .el-tabs__item{
        color: #fff;
    }

    .vr__content__tabs .el-tabs__content{
        display: none;
    }
</style>

<style scoped lang="scss">
    .vr__content{
        width: 100%;
        padding-bottom: 100px;
        &__tabs{
            padding: 12px;
        }
    }
    .vr__basic{
        header{
            font-weight: bold;
            margin-bottom: 15px;
            color: #ffd04b;
        }
    }
</style>
