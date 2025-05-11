<template>
  <div class="bar-container" :class="{'focused': focused}">
    <div class="bar-inner" :style="{height:`${normalizeVolume.bar}%`}">
      <div class="long" :style="{height:`${normalizeVolume.long}%`}"></div>
      <div class="short" :style="{height:`${normalizeVolume.short}%`}"></div>
    </div>
  </div>
</template>

<script>
import {computed, defineComponent, onMounted, ref, watch} from "vue";
import {GameStatProp} from "@/sdk/chart_game/types/statistics";

const SingleBar = defineComponent({
  name: "SingleBar",
  props: {
    stat: {
      type: GameStatProp,
      required: true,
    },
    maxVolume: {
      type: Number,
      required: true,
      default: 1,
    },
    focused: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  setup(props) {
    //const normalizeVolume = computed(() => props.stat.normalizeVolume(props.maxVolume))
    const normalizeVolume = ref({
      //...props.stat.normalizeVolume(props.maxVolume),
      bar: 0,
      long: 0,
      short: 0
    })

    onMounted(() => {
      setTimeout(() => {
        normalizeVolume.value = props.stat.normalizeVolume(props.maxVolume)

      }, 500)
    })

    watch(() => [props.maxVolume,props.stat], ([newMaxVolume, newStat]) => {
      normalizeVolume.value = props.stat.normalizeVolume(props.maxVolume)
    })

    return {
      normalizeVolume
    }
  }
})

export default SingleBar
</script>

<style lang="scss" scoped>
.bar-container {
  width: 100%;
  height: 100%;
  position:relative;
  cursor: pointer;
  .bar-inner {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0%;
    background: #ffffff00;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    transition: height .5s ease;
    .long,.short {
      width: 100%;
      height: 0%;
      transition: background .5s ease, height .5s ease-in .5s;
    }
    .long {
      background: #9F7DE166;
    }
    .short {
      background: #9F7DE1;
    }
  }

  &.focused {
    .bar-inner {
      .long {
        background: #9F7DE1;
      }
      .short {
        background: #6A32D9;

      }
    }
  }

}
</style>
