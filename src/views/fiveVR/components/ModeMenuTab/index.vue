<template>
    <ul class="modeMenu bgBlur5">
        <li
            v-for="it in modeType"
            :key="it.type"
            :class="currentMode == it.type && 'current'"
            @click="modeTypeChange(it.type)"
        >
            <i class="iconfont" v-html="it.icon"></i>
            <span v-html="it.name"></span>
        </li>
    </ul>
</template>


<script>
export default {
    name: 'ModeMenuTab',
    components: {
    },
    props: {
        five:{
            type: [Object, Array]
        },
    },
    data() {
        const { id='10' } = this.$route.query;
        return {
            navModel: '',
            currentMode: 'Panorama',
            modeType: [
                // {
                //     name: "分馆",
                //     type: "Rooms",
                //     icon: "&#xeb73;"
                // },
                {
                    name: "漫游",
                    type: "Panorama",
                    icon: "&#xe68f;"
                },

                {
                    name: "三维模型",
                    type: "Floorplan",
                    icon: "&#xe65b;"
                },
                // {
                //     name: "参考户型",
                //     type: "Topview",
                //     icon: "&#xe767;"
                // },
                // {
                //     name: "指引导航",
                //     type: "Navigation",
                //     icon: "&#xe60d;"
                // },
            ],
        }
    },
    created() {
        // 模式更改
        this.five.on("modeChange", (mode, prevMode, panoIndex, toPose) => {
            this.currentMode = mode;
        });
        // 初始化模式
        this.$nextTick(() => {
            this.five.on("modelLoaded", () => {
                this.five.setState({
                    mode: this.currentMode,
                });
            });
        }, 200)
    },
    methods:{
        // 模式切换
        modeTypeChange(type){
            if (type == "Navigation") {
                this.$emit('updateRoomsListShow', true)
                return false;
            }
            if (type == "Rooms") {
                this.$emit('updateRoomsShow', true)
                return false;
            }
            this.five.changeMode(type);
        },
        
    }
}
</script>


<style lang="scss" scoped>
.modeMenu {
    position: fixed;
    z-index: 3;
    left: 0;
    bottom: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.12) 50%,
            rgba(0, 0, 0, 0) 100%
        ),
        linear-gradient(0deg, rgba(34, 34, 34, 0.5), rgba(34, 34, 34, 0) 90%);
    color: #fff;
    overflow: hidden;
    width: 300px;
    li {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1 0 0;
        height: 50px;
        font-size: 14px;
        opacity: 0.5;
        position: relative;
        cursor: pointer;
        &::before {
            content: "";
            width: 1px;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            background: rgba(255, 255, 255, 0.3);
            transform: scaleX(50%);
        }
        &:first-child::before {
            width: 0;
        }
        i.iconfont {
            font-size: 24px;
        }
        &:first-child {
            border: none;
        }
        &.current {
            opacity: 1;
        }
    }
}
@media screen and (min-width: 768px) {
    .modeMenu {
        width: 300px;
        left: 50%;
        margin-left: -250px;
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
        background-image: none;
        background: rgba(0, 0, 0, 0.2);
    }
}
</style>