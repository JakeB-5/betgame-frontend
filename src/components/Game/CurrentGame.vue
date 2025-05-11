<template>
  <UIPanel primaryBorder>
    <template #heading>
      <UIHeading>{{gameCount}}th Game</UIHeading>
      <div class="recently-game-results">
        <div class="game-result-container">
          <div class="game-result" :class="[game.result]" v-for="(game) in recentlyGames" :key="`recent-results-${game.gameCount}`">
            <div class="count">{{game.gameCount}}th</div>
            <div class="result">{{game.result==='UNKNOWN'?'?':game.result}}</div>
          </div>
          <div class="game-result" :class="[game.result]" v-for="(game) in recentlyGames" :key="`recent-results-dummy-${game.gameCount}`">
            <div class="count">{{game.gameCount}}th</div>
            <div class="result">{{game.result==='UNKNOWN'?'?':game.result}}</div>
          </div>
        </div>
      </div>
      <div v-if="false">
      <UIHeading>{{gameCount}}th Game</UIHeading>
      <div class="latest-game-result" :class="[latestGame.winDirection()]" v-if="latestGame" >
        <div class="section-heading">{{gameCount-1}}th Result</div>
        <div class="close-price">$ {{latestGame.numberClosePrice().toFixed(2)}}</div>
        <div class="change-rate">{{latestGame.priceChangeString()}} ({{latestGame.priceChangeRate()}})</div>
        <div class="winning-direction">{{latestGame.winDirection()}}</div>
      </div>
      </div>
    </template>

    <GameInfo/>
  </UIPanel>
</template>

<script lang="ts">
import GameInfo from "@/components/Game/GameInfo.vue";
import LoadingSpinner from "@/components/UI/LoadingSpinner.vue";
import UIHeading from "@/components/UI/UIHeading.vue";
import UIPanel from "@/components/UI/UIPanel.vue";
import {GameStatProp} from "@/sdk/chart_game/types/statistics";
import {RootState} from "@/store";
import {computed, defineComponent} from "vue";
import {useStore} from "vuex";

const CurrentGame = defineComponent({
  name: "CurrentGame",
  components: { UIPanel, UIHeading, GameInfo},
  setup(props) {
    const store = useStore<RootState>()
    const gameCount = computed(() => store.getters['game/program/gameCount'])
    const latestGame = computed(() => store.getters['game/program/beforeGame'])
    const recentlyGames = computed(() => {
      const games: GameStatProp[] = store.getters['game/program/getRecentlyGames']

      /*if(games.length < 5)
        return games.slice(-games.length).map((x, i) => {
          return {
            gameCount: gameCount.value - (games.length-i),
            result: x.long.win ? 'LONG' : 'SHORT'
          }
        })*/

      const rc = games.slice(-8).map((x, i) => {
        return {
          gameCount: gameCount.value - ((games.length<8?games.length:8)-i),
          result: x.changed>0 ? 'LONG' : x.changed<0?'SHORT':'DRAW'
        }
      })

        rc.push({
          gameCount: gameCount.value,
          result: 'UNKNOWN'
        })
      return rc
    })
    //const winning = computed(() => latestGame.winDirection()?'LONG')

    return {
      gameCount,
      latestGame,
      recentlyGames
    }
  }
})
export default CurrentGame
</script>

<style lang="scss" scoped>

.latest-game-result {
  font-size: .8125em;
  display: flex;
  gap: 6px;
  margin-bottom: 1rem;


  &.LONG {
    color: $long-color;
  }
  &.SHORT {
    color: $short-color;
  }
  &.DRAW {
    color: $draw-color;
  }

  .section-heading {
    color: $body-color;
  }
  .close-price,.change-rate,.winning-direction {
    letter-spacing: -.1em;
  }
  .change-rate {

  }
  .winning-direction {
    font-weight: 500;
  }
}
.recently-game-results {
  width: 100%;
  height: 2rem;
  border-radius: 4px;
  overflow: hidden;
  position:relative;
  .game-result-container {
    position: absolute;
    left:0;
    top:0;
    display: flex;
    align-items:center;
    justify-content: flex-end;
    overflow-y: hidden;
    animation: slideshow 12s linear infinite;
  }
  //border: 1px solid #ffffff20;
  margin-bottom: .5rem;
  .game-result {
    width: 90px;
    text-align: center;
    font-size: .75rem;
    line-height: 1.1;
    padding: .25rem 0;
    &.LONG {
      background-color: #26A69A80;
    }
    &.SHORT {
      background-color: #ef535080;
    }
    &.DRAW, &.UNKNOWN {
      background-color: #ffffff40;
    }
  }
}
@keyframes slideshow {
  0%    { left: 0; }
  100%  { left: -810px; }
}

</style>
