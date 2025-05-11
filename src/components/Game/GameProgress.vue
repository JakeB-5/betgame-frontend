<template>
<div class="game-progress">
  <div class="base-line">
    <div class="filled"></div>
  </div>
  <div class="flags">
    <div class="flags-container">
    <div class="flag" :class="{isNeg:percent.start<0}" :style="{left:`${percent.start}%`}">
      <div class="detail" ><img src="../../assets/ic-checker-neg.svg" v-if="percent.start<0"/><img src="../../assets/ic-checker.svg" v-else/>{{gameCount}}th Start</div>
    </div>
    <div class="flag" :class="{isNeg:percent.bet<0}" :style="{left:`${percent.bet}%`}">
      <div class="detail" ><img src="../../assets/ic-point-checker-neg.svg" v-if="percent.bet<0"/><img src="../../assets/ic-point-checker.svg" v-else/>Bet close</div>
    </div>
    <div class="flag" :class="{isNeg:percent.end<0}" :style="{left:`${percent.end}%`}">
      <div class="detail" ><img src="../../assets/ic-checker-neg.svg" v-if="percent.end<0"/><img src="../../assets/ic-checker.svg" v-else/>{{gameCount+1}}th Start</div>
    </div>
    <div class="flag" :class="{isNeg:percent.afterBet<0}" :style="{left:`${percent.afterBet}%`}">
      <div class="detail" ><img src="../../assets/ic-point-checker-neg.svg" v-if="percent.afterBet<0"/><img src="../../assets/ic-point-checker.svg" v-else/>Bet close</div>
    </div>
      </div>
  </div>
  <div class="time" :class="{warning:isHighlightTimerText}">
    - {{timerText}}
  </div>
</div>

</template>

<script lang="ts">
import {RootState} from "@/store";
import moment from "moment";
import {computed, defineComponent, onMounted, ref} from "vue";
import {useStore} from "vuex";

const GameProgress = defineComponent({
  name: "GameProgress",
  setup(props) {
    const store = useStore<RootState>()
    const games = computed(() => store.getters['game/program/rawGames'])
    const now = ref(Date.now())
    const gameCount = computed(() => store.getters['game/program/gameCount'])

    const refreshNow = () => {
      window.requestAnimationFrame(refreshNow)
      now.value = Date.now()
    }

    const isInGame = computed(() => {
      if(!games.value.current)
        return false
      const currentGame = games.value.current
      return currentGame.startTime.toNumber() <= now.value && currentGame.startTime.add(currentGame.betPeriod).toNumber() >= now.value
    })

    const remainStartTime = computed(() => {
      if(!games.value.current)
        return 0
      const currentGame = games.value.current
      return currentGame.startTime.toNumber() - now.value
    })

    const remainBetTime = computed(() => {
      if(!games.value.current)
        return 0
      const currentGame = games.value.current
      return currentGame.startTime.add(currentGame.betPeriod).toNumber() - now.value
    })
    const remainEndTime = computed(() => {
      if(!games.value.current)
        return 0
      const currentGame = games.value.current

      return currentGame.endTime.toNumber() - now.value
    })
    const remainAfterBetTime = computed(() => {
      if(!games.value.after)
        return 0
      const afterGame = games.value.after
      return afterGame.startTime.add(afterGame.betPeriod).toNumber() - now.value
    })

    const gamePeriod = computed(() => {
      if(!games.value.current)
        return 179999
      const currentGame = games.value.current
      return currentGame.endTime.sub(currentGame.startTime).toNumber()
    })

    const timer = computed(() => {
      if(percent.value.start > 0)
        return remainStartTime.value
      if(percent.value.bet > 0)
        return remainBetTime.value
      if(percent.value.end > 0)
        return remainEndTime.value
      if(percent.value.afterBet > 0)
        return remainAfterBetTime.value
      return 0
    })
    const timerText = computed(() => moment(timer.value).format('mm:ss'))
    const isHighlightTimerText = computed(() => {
      if(remainBetTime.value > 0 && remainBetTime.value <= 60000)
        return true
      return false
    })

    const percent = computed(() => {
      return {
        start: (remainStartTime.value / gamePeriod.value * 80),//.toFixed(2),
        bet: (remainBetTime.value / gamePeriod.value * 80),//.toFixed(2),
        end: (remainEndTime.value / gamePeriod.value * 80),//.toFixed(2),
        afterBet: (remainAfterBetTime.value / gamePeriod.value * 80),//.toFixed(2)
      }
    })

    onMounted(() => {
      window.requestAnimationFrame(refreshNow)
    })

    return {
      games,
      isInGame,
      remainBetTime,
      remainEndTime,
      remainStartTime,
      gamePeriod,
      percent,
      gameCount,
      timerText,
      isHighlightTimerText
    }
  }
})

export default GameProgress
</script>

<style lang="scss" scoped>

.game-progress {
  position: relative;
  width: 100%;
  height: 78px;
  //border: 1px solid #ffffff12;

  margin-bottom: .5rem;
  overflow: hidden;
  border-top: 1px solid #ffffff40;
  //padding-top: .5rem;

  .time {
    position: absolute;
    top: calc(28px + 18px);
    left: calc(30% - 14px);
    padding: .25rem .5rem;
    background: #ffffff20;
    border-radius: 4px;
    font-size: .875rem;
    letter-spacing: .1rem;
    font-family: $number-font-family;
    font-weight: 500;

    &.warning {
      color: #fe7151;
    }

    &:before {
      content: '';
      width: 7px;
      height: 5px;
      border: 7px solid transparent;
      border-bottom-color: #ffffff20;
      position: absolute;
      top: -14px;
      left: 8px;
    }
  }

  .base-line {
    width: 100%;
    height: 3px;
    background: #fff;
    position: absolute;
    top: 30.5px;
    left: 0;
    border-radius: 4px;

    .filled {
      background: #BA824E;
      width: 30%;
      height: 3px;
      border-radius: 2px;
    }
  }
  .flags {
    position: absolute;
    top: 26px;
    left: 0;
    width: 100%;
    height: 12px;
    //overflow-x:hidden;
    //overflow-y: visible;
    .flags-container {
      transform: translateX(30%);
      position: absolute;
      left: 0;
      width: 100%;
      height: 12px;
      top: 0;

      .flag {
        position: absolute;
        top: 0;
        left: 0;
        //transition: all 1s linear;
        //padding-left: 14px;
        &:before {
          content: '';
          width: 12px;
          height: 12px;
          position: absolute;
          top: 0;
          left: -6px;
          background: #fff;
          border-radius: 6px;
          box-shadow: 0 2px #00000030;
        }

        .detail {
          position: absolute;
          top: -16px;
          left: 0;
          font-size: .75em;
          line-height: 12px;
          height: 12px;
          width: 96px;
          display: flex;
          align-items:center;
          gap: .25rem;
        }

        &.isNeg {
          &:before {
            background: #BA824E;
          }
          .detail {
            color: #BA824E;
            img {
              transform-origin: bottom left;
              transform: rotate(15deg);
            }
          }
        }
      }
    }


  }
}
</style>
