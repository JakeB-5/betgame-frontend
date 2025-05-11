<template>
  <div class="bet-bar">
    <div class="direction">{{direction}}</div>
    <div class="bar">
      <div class="box" :class="styleClasses" :style="barHeightStyle">
      </div>
      <div class="bar-content">
        <div class="multiply">x {{bettedMultiple}}</div>
        <div class="rate">{{bettedRate}}%</div>
      </div>
    </div>
    <div class="betted-amount">
      {{bettedAmount}} ITT
      <div class="lastBet" :key="`last-bet-${direction}-${lastBet}`" v-if="lastBet">+ {{lastBet}}</div>
    </div>
  </div>
</template>

<script lang="ts">
import {RootState} from "@/store";
import {computed, defineComponent, onMounted, ref, watch} from "vue";
import {useStore} from "vuex";

const BettingBar = defineComponent({
  name: "BettingBar",
  props: {
    direction: {
      type: String,
      required: true,
      default: 'LONG'
    }
  },
  setup(props) {
    const store = useStore<RootState>()
    const currentGame = computed(() => store.getters['game/program/currentGame'])
    const bettedInfo = computed(() => currentGame.value ? currentGame.value.betted(props.direction):{amount:0, multiple:0, rate:0})
    const bettedAmount = computed(() => bettedInfo.value.amount.toFixed(5))
    const bettedMultiple = computed(() => bettedInfo.value.multiple.toFixed(2))
    const bettedRate = computed(() => bettedInfo.value.rate.toFixed(2))
    const normalizeRate = computed(() => currentGame.value ? currentGame.value.normalizeRate(props.direction) : 0)
    const barHeightStyle = computed(() => {
      return {
        height: `${normalizeRate.value}%`
      }
    })
    const amountLastChanged = ref(Date.now())
    const diffFromLastChanged = ref(300)

    const lastBet = computed(() => {
      const lastBet = store.getters['game/program/getLastBet']
      return props.direction === 'LONG' ? lastBet[0] : lastBet[1]
    })

    onMounted(() => {
      setInterval(() => {
        diffFromLastChanged.value = Date.now() - amountLastChanged.value
      }, 200)
      console.log(props.direction)
    })
    const styleClasses = computed(() => {
      return {
        'LONG': props.direction === 'LONG',
        'SHORT': props.direction === 'SHORT',
        'changed': diffFromLastChanged.value <= 250,
      }
    })

    watch(bettedAmount, (nv,ov) => {
      if(nv != ov)
        amountLastChanged.value = Date.now()
    })

    return {
      bettedAmount,
      bettedMultiple,
      bettedRate,
      barHeightStyle,
      styleClasses,
      lastBet,
    }
  }
})

export default BettingBar
</script>

<style lang="scss" scoped>

.bet-bar {
  width: 100%;
  //max-width: 10rem;
  text-align: center;
  padding: 0 1rem;
  max-width: 8rem;
  .direction {
    margin-bottom: 1rem;
    font-weight: 700;
    color: #ddd;
  }
  .bar {
    //margin: 0 1rem;
    width: calc(100% - 1rem);
    margin: 0 auto;
    display: flex;
    align-items: flex-end;
    height: 7rem;
    position:relative;
    .box {
      position:absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 0;
      min-height: 3rem;
      z-index: 0;
      transition: height .5s ease;
      &.LONG {
        background-color: $long-color;
      }
      &.SHORT {
        background-color: $short-color;
      }
      &.changed {
        //animation-duration: .2s;
        //animation-name: changed;
      }
      &.changed.LONG {
        animation-duration:.2s;
        animation-name: changed-long;
      }
      &.changed.SHORT {
        animation-duration:.2s;
        animation-name: changed-short;
      }
    }
    .bar-content {
      width: 100%;
      position: relative;
      z-index: 10;
      height: 3rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: .8125rem;
      line-height: 1.2;
      .multiply {
        font-size: 1.2em;
        letter-spacing: -.01em;
        font-weight: 500;
      }
    }
  }
  .betted-amount {
    padding-top: .25rem;
    font-size: .8125rem;
    text-align: right;
    position: relative;
    .lastBet {
      position: absolute;
      bottom: .2em;
      opacity: 0;
      right: 0;
      width: 100%;
      animation: amountUpdated .5s linear;
      animation-fill: forwards;

    }
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

@keyframes changed {
  0% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1.0);

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

</style>
