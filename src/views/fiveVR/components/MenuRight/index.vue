<template>
    <div class="vr__edit">
        <div v-show="active == '1-1'">
            <MenuBasicEdit v-if="cacheTabs.includes('1-1') || active == '1-1'" :five="five" />
        </div>
        <div v-show="active == '2-1'">
            <MenuNavigationEdit v-if="cacheTabs.includes('2-1') || active == '2-1'" :enumCrm="enumCrm" :five="five"/>
        </div>
        <div v-show="activeContent">
            <MenuContentEdit v-if="showContent" :activeName="active" :enumCrm="enumCrm" :five="five"/>
        </div>
        <div v-show="active == '4-1'">
            <MenuNavigationPointEdit v-if="cacheTabs.includes('4-1') || active == '4-1'" :enumCrm="enumCrm" :five="five" :floorIndex="floorIndex"/>
        </div>
        <div v-show="active == '5-1'">
            <MenuAdmin v-if="cacheTabs.includes('5-1') || active == '5-1'" :enumCrm="enumCrm" :five="five" :floorIndex="floorIndex"/>
        </div>
    </div>
</template>

<script>

import MenuBasicEdit from './components/MenuBasic/index'
import MenuContentEdit from './components/MenuContent/index'
import MenuNavigationEdit from './components/MenuNavigation/index'
import MenuNavigationPointEdit from './components/MenuNavigationPoint/index'
import MenuAdmin from './components/MenuAdmin/index'

const contentType = ['0','1','2','3','4','5','6','7','8','9','10','11']

export default {
    name: 'MenuRight',
    components: {
        MenuBasicEdit,
        MenuContentEdit,
        MenuNavigationEdit,
        MenuNavigationPointEdit,
        MenuAdmin
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
            active: '',
            cacheTabs: [],
        }
    },
    computed: {
        activeContent() {
            return contentType.includes(this.active)
        },
        showContent() {
           return this.cacheTabs.includes(this.active) || contentType.includes(this.active)
        }
    },
    created() {
        this.$bus.$on('menuLeftChange', (val) => {
            this.active = val
            if (!this.cacheTabs.includes(val)) {
                this.cacheTabs.push(val)
            }
        })
    },
    mounted: function () {
    },
    methods:{
        
    }
}
</script>

<style>
    .vr__edit__label .el-form-item__label{
        color: #fff!important;
    }
</style>

<style scoped lang="scss">
    @import './index.scss';
</style>
