<template>
  <UIPanel heading="Leader Board">

    <div class="players">
      <div class="player" v-for="(player, i) in players" :key="`top-players-${player.address}`">
        <div class="rank">{{i+1}}</div>
        <div class="address">{{player.address}}</div>
        <div class="prize">{{player.prize.toFixed(2)}} ITT</div>
        <div class="winRate">{{player.winRate.toFixed(2)}}%</div>
      </div>
      <div class="player blank" v-for="i in spacing" :key="`top-players-spacing-${i}`">
        <div class="rank">{{i+players.length}}</div>
        <div class="address">-</div>
        <div class="prize">0.00 ITT</div>
        <div class="winRate">0.00%</div>
      </div>
    </div>

  </UIPanel>
</template>

<script lang="ts">
import {RootState} from "@/store";
import {computed, defineComponent} from "vue";
import UIHeading from "@/components/UI/UIHeading.vue";
import UIPanel from "@/components/UI/UIPanel.vue";
import {useStore} from "vuex";

const LeaderBoard = defineComponent({
  name: "LeaderBoard",
  components: {UIPanel, },
  setup(props) {
    const store = useStore<RootState>()
    const players = computed(() => (store.getters['game/program/getTopPlayers']).slice().sort((a:any,b:any)=> b.prize- a.prize))
    const spacing = computed(() => 20 - players.value.length)
    return {
      players,
      spacing,
    }
  }
})

export default LeaderBoard
</script>

<style lang="scss" scoped>

.players {
  .player {
    display: flex;
    align-items:center;
    justify-content: space-between;
    font-size: .75em;

    .rank {
      width: 1.3rem;
      text-align: center;
    }
    &:nth-child(1) {
      .rank {
        font-size: 1rem;
        font-weight: 500;
      }
    }
    &:nth-child(2) {
      .rank {
        font-size: 1rem;
        font-weight: 500;
      }
    }
    &:nth-child(3) {
      .rank {
        font-size: 1rem;
        font-weight: 500;
      }
    }
    .address {
      width: 6rem;
      text-align: center;
    }
    .prize {
      flex-grow: 1;
      text-align: right;
      padding-right: .5rem;
    }
    .winRate {
      text-align: right;
      width: 3.4rem;
    }
    &.blank {
      .address {
        text-align: center;
      }
    }
  }
}
</style>
