<template>
<div class="bet-info-container2">
<div class="directions">
  <div class="direction LONG">LONG</div>
  <div class="direction SHORT">SHORT</div>
</div>
  <div class="bet-bars">
    <div class="bar LONG" :class="longChangedClass" :style="stylePercentWidth.long">{{longBetInfo.rate.toFixed(2)}}%</div>
    <div class="bar SHORT" :class="shortChangedClass" :style="stylePercentWidth.short">{{shortBetInfo.rate.toFixed(2)}}%</div>
  </div>
  <div class="bet-details">
    <div class="bet-detail-types">
      <div class="multiple">Multiple</div>
      <div class="amount">Amount</div>
    </div>
    <div class="bet-detail LONG">
      <div class="multiple" :class="{bigger: longBetInfo.amount < shortBetInfo.amount}">x {{longBetInfo.multiple.toFixed(2)}}</div>
      <div class="amount">{{longBetInfo.amount}}
        <div class="lastBet" :key="`last-bet-long-${lastBet[0]}`" v-if="lastBet[0]">+ {{lastBet[0]}}</div>
      </div>
    </div>
    <div class="bet-detail SHORT">
      <div class="multiple" :class="{bigger: longBetInfo.amount > shortBetInfo.amount}">x {{shortBetInfo.multiple.toFixed(2)}}</div>
      <div class="amount">{{shortBetInfo.amount}}
        <div class="lastBet" :key="`last-bet-short-${lastBet[1]}`" v-if="lastBet[1]">+ {{lastBet[1]}}</div>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {RootState} from "@/store";
import {computed, defineComponent, onMounted, ref, watch} from "vue";
import {useStore} from "vuex";

const BetInfo = defineComponent({
  name: "BetInfo",
  setup(props) {
    const store = useStore<RootState>()
    const currentGame = computed(() => store.getters['game/program/currentGame'])

    const longBetInfo = computed(() => currentGame.value ? currentGame.value.betted('LONG'):{amount:0, multiple:0, rate:0})
    const shortBetInfo = computed(() => currentGame.value ? currentGame.value.betted('SHORT'):{amount:0, multiple:0, rate:0})

    const longWidthNormalize = computed(() => Math.min(Math.max(30, longBetInfo.value.rate), 70))

    const stylePercentWidth = computed(() => {
      return {
        long: {
          width: `${longWidthNormalize.value}%`
        },
        short: {
          width: `${100 - longWidthNormalize.value}%`
        }
      }
    })

    const lastBet = computed(() => store.getters['game/program/getLastBet'])

    const longBetAmount = computed(() => longBetInfo.value.amount)
    const longAmountLastChanged = ref(Date.now())
    const longDiffFromLastChanged = ref(300)


    const shortBetAmount = computed(() => shortBetInfo.value.amount)
    const shortAmountLastChanged = ref(Date.now())
    const shortDiffFromLastChanged = ref(300)

    onMounted(() => {
      setInterval(() => {
        const now = Date.now()
        longDiffFromLastChanged.value = now - longAmountLastChanged.value
        shortDiffFromLastChanged.value = now - shortAmountLastChanged.value
      }, 200)

    })

    watch(longBetAmount, (nv,ov) => {
      if(nv != ov)
        longAmountLastChanged.value = Date.now()
    })
    watch(shortBetAmount, (nv,ov) => {
      if(nv != ov)
        shortAmountLastChanged.value = Date.now()
    })

    const longChangedClass = computed(() => {
      return {
        changed: longDiffFromLastChanged.value <= 250
      }
    })
    const shortChangedClass = computed(() => {
      return {
        changed: shortDiffFromLastChanged.value <= 250
      }
    })

    return {
      longBetInfo,
      shortBetInfo,

      stylePercentWidth,

      lastBet,

      longChangedClass,
      shortChangedClass
    }
  }
})
export default BetInfo
</script>

<style lang="scss" scoped>
.bet-info-container2 {
  margin-bottom: 1rem;
  .directions, .bet-details {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .LONG {
    text-align: left;
  }
  .SHORT {
    text-align: right;
  }

  .directions {
    font-weight: 700;
    color: #ddd;

  }

  .bet-bars {
    position: relative;
    width: 100%;
    height: 2.5rem;
    margin-bottom: .5rem;

    &:before {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      right: 0;
      width: 3px;
      height: 4px;
      border:4px solid transparent;
      border-bottom-color: #ffffffd0;
      margin: 0 auto;
      //border-left: 1px solid #fff;
      //border-right: 1px solid #fff;
    }
    .bar {
      position: absolute;
      top: 0;
      width: 50%;
      height: 2.5rem;
      display: flex;
      aling-items: center;
      justify-content: center;
      line-height: 2.5rem;
      font-size: .8125rem;
      max-width: 100%;
      min-width: 30%;
      transition: width .5s ease;

      &.LONG {
        left: 0;
        background-color: $long-color;
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
        &.changed {
          animation-duration:.2s;
          animation-name: changed-long;
        }
      }
      &.SHORT {
        right: 0;
        background-color: $short-color;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        &.changed {
          animation-duration:.2s;
          animation-name: changed-short;
        }
      }
    }
  }
  .bet-details {
    position:relative;
    .bet-detail-types {
      position: absolute;
      top:0;
      left: 50%;
      font-size: .8125rem;
      color: #aaa;
      transform: translateX(-50%);
      .amount {
        //padding-top: .25rem;
      }

    }
    .bet-detail {
      width: 100%;
      .multiple {
        font-size: .8125rem;
        &.bigger {
          color: #5a68fa;
          font-weight: 700;
        }

      }
      .amount {
        //padding-top: .25rem;
        font-size: .8125rem;
        position: relative;
        width: 100%;
        .lastBet {
          position: absolute;
          bottom: .2em;
          opacity: 0;
          width: 100%;
          animation: amountUpdated .5s linear;
          animation-fill: forwards;
        }
      }
      &.LONG {
        .amount {
          .lastBet {
            left: 0;
          }
        }
      }
      &.SHORT {
        .amount {
          .lastBet {
            right: 0;
          }
        }
      }
    }
  }
}

@keyframes changed-long {
  0% {
    transform: scale(1.05);
    background-color: #52d2c6;
  }
  100% {
    background-color: $long-color;
    transform: scale(1.0);
  }
}
@keyframes changed-short {
  0% {
    transform: scale(1.05);
    background-color: #ff8987;
  }
  100% {
    background-color: $short-color;
    transform: scale(1.0);
  }
}
@keyframes amountUpdated {
  0% {
    opacity: 1;
    bottom: -1em;
  }
  100% {
    opacity: 0;
    bottom: -.2em;
  }
}

</style>
