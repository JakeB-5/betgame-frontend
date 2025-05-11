<template>
  <div class="bar-chart-container">
    <SingleBar v-for="stat in data" :stat="stat" :maxVolume="maxVolume" :key="`single-bar-${stat.startTime}`" @mouseenter="onBarFocus(stat)" :focused="focused.startTime === stat.startTime"/>
  </div>

</template>

<script lang="ts">
import SingleBar from "@/components/BarChart/SingleBar.vue";
import {GameStat, GameStatProp} from "@/sdk/chart_game/types/statistics";
import {computed, defineComponent, PropType, ref} from "vue";

const BarChart = defineComponent({
  name: "BarChart",
  components: {SingleBar},
  props: {
    gameStats: {
      type: Object as PropType<GameStatProp[]>,
      required: true,
      //validator: prop => Array.isArray(prop) && prop.every(i => i instanceof GameStatProp),
      default: () => { return {} }
    },
    length: {
      type: Number,
      required: false,
      default: 15
    }
  },
  setup(props, {emit}) {
    const data = computed<Array<GameStatProp>>(() =>
      props.gameStats.length > props.length ? props.gameStats.slice(-props.length) : props.gameStats
    )
    const focused = ref(data.value[data.value.length-1])

    const maxVolume = computed(() => data.value.map(v => v.volume).reduce((prev,curr) => prev > curr ? prev : curr))

    const onBarFocus = (stat:GameStatProp) => {
      focused.value = stat
      emit('focus:change', stat)
    }


    return {
      data,
      maxVolume,
      focused,
      onBarFocus
    }
  }
})

export default BarChart
</script>

<style lang="scss" scoped>
.bar-chart-container {
  width: 100%;
  aspect-ratio: 28/9;
  //border: 1px solid #fff;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 3px;

}
</style>
