<template>
  <ModalBase v-model:open="modalOpen">
    <template #modal-heading>
      <div class="game-info">
      <div class="game-count">{{gameCount}}th game</div>
      <div class="game-during">( {{gameTimeRange}} )</div>
      </div>
    </template>
    <template #modal-contents>
      <div class="game-result" v-if="!drawOrCancel">
      <div class="result" :class="{win: win, lose: !win}">YOU {{win?'WIN':'LOSE'}}!</div>
      <div class="multiple" v-if="win">{{win?'+':''}} {{ rate.toFixed(2) }}%</div>
        <div class="amount" v-if="win">Earn {{changeAmount.toFixed(2)}} ITT</div>
        <div class="amount" v-else>- {{betAmount.toFixed(2)}} ITT</div>
      </div>
      <div class="game-result" v-else>
        <div class="result" :class="[drawOrCancel]">{{drawOrCancel.toUpperCase()}}</div>
        <div class="result-explain" v-if="drawOrCancel === 'canceled'">You're playing lonely</div>
        <div class="amount" v-if="drawOrCancel === 'draw'">Refund {{(betAmount*.95).toFixed(2) }} ITT</div>
        <div class="amount" v-else>Refund {{betAmount.toFixed(2)}} ITT</div>
      </div>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import ModalBase from "@/components/Modal/ModalBase.vue";
import {BetData} from "@/sdk/chart_game/accounts/BetData";
import {GameData} from "@/sdk/chart_game/accounts/GameData";
import moment from "moment";
import {computed, defineComponent, PropType, ref, watch} from "vue";

const ModalResult = defineComponent({
  name: "ModalResult",
  components: {ModalBase},
  props: {

    gameCount: {
      type: Number,
      required: true,
      default: 0,
    },

    open: {
      type: Boolean,
      required: false,
      default: false,
    },
    betData: {
      type: Object as PropType<BetData>,
      required: true,
    },
    gameData: {
      type: Object as PropType<GameData>,
      required: true,
    },
  },
  setup(props, {emit}) {
    const modalOpen = ref(props.open)

    const win = computed(() => props.betData.direction() === props.gameData.winDirection())
    const changeAmount = computed(() => props.betData.estimateYield(props.gameData))
    const rate = computed(() => props.betData.estimateYieldRate(props.gameData))
    const betAmount = computed(() => props.betData.amount())

    const gameTimeRange = computed(() => {
      return moment(props.gameData.getStartTime()).format('MM-DD hh:mm')
        + ' ~ '
        + moment(props.gameData.getEndTime()+1).format('hh:mm')
    })

    const drawOrCancel = computed(() => props.gameData.drawOrCancel())

    watch(() => props.open, nv => {
      modalOpen.value = nv
    })

    watch(modalOpen, nv => {
      emit("update:open", nv)
    })

    return {
      modalOpen,
      win,
      changeAmount,
      rate,
      gameTimeRange,
      betAmount,
      drawOrCancel,
    }
  }
})

export default ModalResult
</script>

<style lang="scss" scoped>
.game-info {
  text-align: center;
  margin-bottom: 2rem;
  padding: 0 3rem;
  //display: flex;
  //align-items: flex-end;
  gap: .5rem;
  .game-count {
    font-weight: 400;
    font-size: 1.5rem;

  }

  .game-during {
    font-weight: 300;
    font-size: .875em;
    //text-align: right;
    letter-spacing: -.01em;
    padding-bottom: .25rem;

  }
}
.game-result {
  text-align: center;
  .result {
    font-size: 3em;
    line-height: 1;
    font-weight: 700;
    &.win {
      color: $long-color;
      //animation-duration: 1s;
      animation: game-win 1s infinite;
      animation-timing-function: linear;
    }
    &.lose {
      color: $short-color;
      animation: game-lose 1s;
      animation-iteration-count: infinite;
      //animation-delay: 1s;
      animation-timing-function: linear;
    }
    &.draw, &.canceled {
      font-size: 2em;
      font-weight: 500;
    }

  }
  .result-explain {
    font-size: .875em;
    font-weight: 300;
    letter-spacing: -.02em;
    margin-bottom: .5rem;
  }
  .multiple {
    font-size: 2em;
    letter-spacing: -.03em;

  }
  .amount {
    font-size: 1.2em;
    padding: .5rem 2rem;
    background: #ffffff20;
    box-shadow: 0 0 12px -4px inset rgba(0,0,0,.3);
    border-radius: 8px;
    margin-bottom: 1rem;

  }
}

@keyframes game-win {
  0% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-6%) rotate(7deg); }
  50% { transform: translateY(-2%); }
  75% { transform: translateY(-10%) rotate(-5deg); }
  100% { transform: translateY(0)rotate(0deg); }
}
@keyframes game-lose {
  0% { transform: translateY(0) rotate(3deg); }
  25% { transform: translateY(6%) rotate(6deg); }
  50% { transform: translateY(2%) rotate(2deg); }
  75% { transform: translateY(10%) rotate(8deg); }
  100% { transform: translateY(0%) rotate(3deg) skewX(2deg); }
}
@keyframes game-lose-mul {
  0% { transform: translateY(0); color: red;}
  25% { transform: translateY(8%); }
  50% { transform: translateY(2%); }
  75% { transform: translateY(5%); }
  100% { transform: translateY(0); color: red;}

}
</style>
