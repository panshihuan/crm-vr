<template>
  <div class="floor_menu" v-if="show && floorLength > 1">
    <span
      v-for="it in floorLength"
      :key="it"
      @click="showFloor(it - 1)"
      :class="showFloorIndex !== null && showFloorIndex == it - 1 && 'current'"
    >
      楼层{{ it + ctSenceFloorCorrect }}
      <i class="el-icon-right" style="padding-left: 10px;" title="直达" @click.stop="jumpFloor(it - 1)"></i>
    </span>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'


export default {
  name: 'SceneTab',
  components: {
  },
  props: {
        five: {
            type: [Object, Array],
        },
        workJson: {
            type: [Object, Array],
        },
        currentSceneGroup: {
            type: [Object, Array],
        },
        ctSenceCode: {
            type: String,
        },
    },
  data () {
    return {
        show: false,
        floorLength: 1,
        showFloorIndex: null,
    }
  },
  computed: {
      ...mapState('user', [
          'userId',
      ]),
      ctSenceFloorCorrect() {
        return ''
      }
  },
  created() {
    this.five.on("modeChange", (mode) => {
        if (mode == "Panorama") {
            this.show = false;
        } else {
            this.show = true;
        }
        this.showFloorIndex = null;
    })

    this.five.on("modelLoaded", () => {
        this.floorLength = this.five.model.floorLength;
    });
  },
  beforeDestroy() {
  },
  methods: {
    showFloor(floorIndex) {
        if (this.five.model.shownFloor == floorIndex) {
            this.five.model.show();
        } else {
            this.five.model.show(floorIndex, 0.1);
        }
        this.showFloorIndex = this.five.model.shownFloor;
        console.log(this.five.model.shownFloor);
    },
    jumpFloor(floorIndex) {
        let panoIndex = this.workJson.observers.findIndex(
            (it) => it.floor_index == floorIndex
        );
        if (panoIndex >= 0) {
            this.five.setState({
                mode: "Panorama",
                panoIndex,
            });
        }
    },
  }
}
</script>

<style lang="scss">
  @import "index.scss";
</style>
