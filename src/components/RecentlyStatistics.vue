<template>
  <UIPanel>
    <template #heading>
      <div class="header">
      <UIHeading>Statistics</UIHeading>
        <div class="sub-header">Recently 15 games</div>
      </div>
    </template>
    <BarChart :game-stats="recentlyHistories" @focus:change="onFocused" v-if="recentlyHistories.length"/>
    <div class="game-info" v-if="currentFocused">
    <div class="stat-summary">
      <div class="start-time">{{currentFocused.getSimpleStartTimeString()}}</div>
      <div class="volume">Volume {{currentFocused.volume.toFixed(4)}}</div>
    </div>
    <div class="stat-detail">
      <div class="long" :class="{win:currentFocused.long.win}">
        <div class="indicator"></div>
        <div class="players">
          <div class="direction">Long</div>
          <div class="counts">{{currentFocused.long.player}}</div>
        </div>
        <div class="multiple">
          <div class="rate">x{{currentFocused.long.multiple.toFixed(2)}}</div>
          <div class="win" v-if="currentFocused.long.win">WIN</div>
        </div>

      </div>
      <div class="short" :class="{win:currentFocused.short.win}">
        <div class="indicator"></div>
        <div class="players">
          <div class="direction">Short</div>
          <div class="counts">{{currentFocused.short.player}}</div>
        </div>
        <div class="multiple">
          <div class="rate">x{{currentFocused.short.multiple.toFixed(2)}}</div>
          <div class="win" v-if="currentFocused.short.win">WIN</div>
        </div>

      </div>
    </div>
    </div>
  </UIPanel>
</template>

<script lang="ts">
import UIHeading from "@/components/UI/UIHeading.vue";
import {GameData} from "@/sdk/chart_game/accounts/GameData";
import {GameStat, GameStatProp} from "@/sdk/chart_game/types/statistics";
import {RootState} from "@/store";
import {computed, defineComponent, onMounted, ref, watch} from "vue";
import UIPanel from "@/components/UI/UIPanel.vue";
import BarChart from "@/components/BarChart/BarChart.vue";
import {useStore} from "vuex";

const RecentlyStatistics = defineComponent({
  name: "RecentlyStatistics",
  components: {UIHeading, BarChart, UIPanel, },
  setup(props) {
    const store = useStore<RootState>()
    //const recentlyHistories = ref<GameStatProp[]>(makeDummies())
    const rawGames = computed(() => store.getters['game/program/rawGames'])
    const now = computed(() => store.getters['game/program/now'])

    const recentlyHistories = computed(() => {
      const games = store.getters['game/program/getRecentlyGames']

      ///const currentGame = store.getters['game/program/currentGame'] as GameData
      if(rawGames.value.current)
        games.push(rawGames.value.current.toGameStat())

      return games
    })
    const currentFocused = ref<GameStatProp>()


    const onFocused = (stat: GameStatProp) => {
      currentFocused.value = stat
    }

    onMounted(() => {
      //
    })
    watch(recentlyHistories, (nv, ov) => {
      if(!ov.length)
        currentFocused.value = recentlyHistories.value[recentlyHistories.value.length-1]
    })

    return {
      recentlyHistories,
      onFocused,
      currentFocused,
    }
  }
})

export default RecentlyStatistics
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sub-header {
  font-size: .75rem;
}
.stat-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: .75rem;
  padding-top: .25rem;
  margin-bottom: .5rem;
  .start-time {

  }
  .volume {

  }
}
.stat-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: .875em;
  .long, .short {
    display: flex;
    flex-direction: column;
    .indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #9F7DE166;
      margin-bottom: .5rem;
    }
    .players {
      display: flex;
      gap: 1rem;
      .direction {

      }
      .counts {

      }
    }
    .multiple {
      display: flex;
      gap: 1rem;
    }
  }
  .long {
    &.win {
      .players {
        .direction {
          color: $long-color;
        }
      }
    }
  }

  .short {
    &.win {
      .players {
        .direction {
          color: $short-color;
        }
      }
    }
    align-items: flex-end;
    .indicator {
      background-color: #9F7DE1;
    }
    .players {

      flex-direction: row-reverse;
    }
    .multiple {
      flex-direction: row-reverse;

    }
  }
}
</style>
