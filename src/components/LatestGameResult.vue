<template>
  <UIPanel heading="Latest Game Result">
    <div class="data-group prev-game-data">
      <div class="header">Result</div>
      <div class="data-list">
        <div class="data-type">No</div>
        <div class="data-value">{{gameCount-1}}th game</div>
      </div>
      <div class="data-list">
        <div class="data-type">Result</div>
        <div class="data-value">{{gameResult}}</div>
      </div>
      <div class="data-list">
        <div class="data-type">Time (UTC+9)</div>
        <div class="data-value">
          <div>{{startTimeString}}</div>
          <div>~ {{endTimeString}}</div>
        </div>
      </div>
      <div class="data-list">
        <div class="data-type">Price</div>
        <div class="data-value" :class="[winDirection]">
          <div class=""><span class="label">Open</span> $ {{latestGameData.openPrice.toFixed(2)}}</div>
          <div class=""><span class="label">Close</span> $ {{latestGameData.closePrice.toFixed(2)}}</div>
          <div class="">{{ changedFixture }} {{latestGameData.changed.toFixed(2)}} ({{ changedFixture }}{{ latestGameData.changeRate.toFixed(2) }}%)</div>
          <div class=""></div>
        </div>
      </div>
      <div class="data-list">
        <div class="data-type">Winning</div>
        <div class="data-value" :class="[winDirection]">{{winDirection}}</div>
      </div>
    </div>
    <div class="data-group prev-game-stats">
      <div class="header">Stats</div>
      <div class="data-list">
        <div class="data-type">Total</div>
        <div class="data-value">{{(latestGameData.longBetAmount + latestGameData.shortBetAmount).toFixed(2)}} ITT</div>
      </div>
      <div class="data-list">
        <div class="data-type">Long</div>
        <div class="data-value">
          <div class="">{{latestGameData.longBetAmount.toFixed(2)}} ITT</div>
          <div class="">{{latestGameData.longBetCount}} Players</div>
        </div>
      </div>
      <div class="data-list">
        <div class="data-type">Short</div>
        <div class="data-value">
          <div class="">{{latestGameData.shortBetAmount.toFixed(2)}} ITT</div>
          <div class="">{{latestGameData.shortBetCount}} Players</div>
        </div>
      </div>
      <div class="data-list">
        <div class="data-type">Yield</div>
        <div class="data-value">
          <div class="rate">{{winnersData.rate.toFixed(2)}}%</div>
          <div class="avg">Avg {{winnersData.avg.toFixed(2)}} ITT</div>
          <div class="max">Max {{winnersData.max.toFixed(2)}} ITT</div>
        </div>
      </div>
    </div>

  </UIPanel>
</template>

<script lang="ts">
import {Amount} from "@/sdk/utils/Amount";
import {computed, defineComponent} from "vue";
import UIHeading from "@/components/UI/UIHeading.vue";
import UIPanel from "@/components/UI/UIPanel.vue";
import {useStore} from "vuex";
import {RootState} from "@/store";

const LatestGameResult = defineComponent({
  name: "LatestGameResult",
  components: { UIPanel, },
  setup(props) {
    const store = useStore<RootState>()
    const latestGame = computed(() => store.getters['game/program/beforeGame'])
    const latestGameData = computed(() => latestGame.value ? latestGame.value.getData() : {
      startTime: 0,
      endTime: 0,
      openPrice: 0,
      closePrice: 0,
      changed: 0,
      changeRate: 0,
      longBetAmount: 0,
      longBetCount: 0,
      shortBetAmount: 0,
      shortBetCount: 0,
      maxLongBetAmount: 0,
      maxShortBetAmount: 0,
      finish: false,
    })
    const winnersData = computed(() => latestGame.value ? latestGame.value.getWinnersData() : {
      rate : 0,
      avg : 0,
      max: 0,
    })

    const changedFixture = computed(() => {
      if (latestGameData.value.changed > 0)
        return '+'

        return ''
    })

    const winDirection = computed(() => latestGame.value ? latestGame.value.winDirection() : '')
    const gameResult = computed(() => latestGame.value ? latestGame.value.gameResult() : '-')
    const gameCount = computed(() => store.getters['game/program/gameCount'])


    const startTimeString = computed(() => latestGame.value ? latestGame.value.getStartTimeString(): '')
    const endTimeString = computed(() => latestGame.value ? latestGame.value.getEndTimeString(): '')
    const yieldRate = computed(() => latestGame.value ? latestGame.value.getYieldRate() : 0)

    return {
      latestGame,
      startTimeString,
      endTimeString,
      latestGameData,
      yieldRate,
      winDirection,
      gameCount,
      changedFixture,
      winnersData,
      gameResult
    }
  }
})

export default LatestGameResult
</script>

<style lang="scss" scoped>

.data-group {
  font-size: .75em;
  border-bottom: 1px dashed #ffffff80;
  padding: .5rem 0;
  &:last-child {
    border-bottom: 0;
  }

  .header {
    font-size: .9rem;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: .25rem;
    //.game-count {
    //  font-size: .75rem;
    //  //color: #aaa;
    //  color: $high-font-color;
    //  font-weight: 700;
    //}
  }
}
.data-list {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

    .data-type {
      color: #aaa;

    }
    .data-value {
      text-align: right;
      .label {
        color: #fff;
      }

      &.LONG {
        color: $long-color;
      }
      &.SHORT {
        color: $short-color;
      }
    }
}

</style>
