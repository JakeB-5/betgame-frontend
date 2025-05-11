<template>
  <div class="">
    <div class="bet-info-container" v-if="false">
      <BettingBar direction="LONG"></BettingBar>
      <BettingBar direction="SHORT"></BettingBar>
    </div>
    <BetInfo/>
    <div class="betting-container">
      <div class="amount">
        <BetAmountInput type="text" v-model="rawBetAmount" :max="maxBetAmount"/>
      </div>
      <div class="amount-tail ">
        <div class="token-balance">

        </div>
        <div class="quick-input-selectors " v-if="false">
          <button class="quick-input" @click.prevent="quickAmountInput(.1)">10%</button>
          <button class="quick-input" @click.prevent="quickAmountInput(.25)">25%</button>
          <button class="quick-input" @click.prevent="quickAmountInput(.5)">50%</button>
          <button class="quick-input" @click.prevent="quickAmountInput()">MAX</button>
        </div>
        <div class="quick-input-slider">
          <Slider v-model="betRate" :min="0" :max="100" :tooltipPosition="`top`" :step="-2" @change="onSliderChange" :showTooltip="`always`"/>
        </div>
      </div>
      <div class="bet-direction" :class="{closed:isBetClose, needClaim:isMaxPending}">
        <button type="button" class="bet-long" @click.prevent="clickBetButton('LONG')" :disabled="longBetDisabled">Bet LONG</button>
        <button type="button" class="bet-short" @click.prevent="clickBetButton('SHORT')" :disabled="shortBetDisabled">Bet SHORT</button>
        <div class="closed-bg">
          <div class="message">
            <img src="../../assets/ic-locked.svg"/>
            <div>New game in {{remainEndTime}}s</div>
          </div>
        </div>
        <div class="need-claim">
          <button type="button" >Prize claim & score record</button>
        </div>
      </div>
    </div>

    <div class="game-status" v-if="false">
      <div class="game-progress">
        <div class="inner-bar" :style="{width:`${remainingFromEndTime.progress}%`}"></div>
        <div class="message">
          {{ (180-(remainingFromEndTime.seconds/1000).toFixed(0))<=60 ? 'Bet finish' : `${180-(remainingFromEndTime.seconds/1000).toFixed(0)} seconds` }}
        </div>
      </div>

    </div>
    <GameProgress/>

    <div class="wallet-balance" v-if="false">
      <div class="header">Balance</div>
      <div class="data-list">
        <div class="data">
          <div class="data-type">SOLANA</div>
          <div class="data-value">{{balance}} SOL</div>
        </div>
        <div class="data">
          <div class="data-type">TOKEN</div>
          <div class="data-value">{{tokenInfo.amount}} ITT</div>
        </div>
      </div>
    </div>
    <div class="bet-info">
      <div class="header">
        <div>Bet Info</div>
        <div class="game-count">{{gameCount}}th</div>
      </div>
      <div class="data-list" v-if="!currentBetData">
        <div class="data">
          <div class="data-type">Position</div>
          <div class="data-value">-</div>
        </div>
        <div class="data">
          <div class="data-type">Amount</div>
          <div class="data-value">-</div>
        </div>
        <div class="data">
          <div class="data-type">Estimate yield</div>
          <div class="data-value">-</div>
        </div>
      </div>
      <div class="data-list" v-else>
        <div class="data">
          <div class="data-type">Position</div>
          <div class="data-value " :class="[currentBetData.direction()]">{{currentBetData.direction()}}</div>
        </div>
        <div class="data">
          <div class="data-type">Amount</div>
          <div class="data-value">{{currentBetData.amount().toFixed(2)}} ITT</div>
        </div>
        <div class="data">
          <div class="data-type">Estimate yield (?)</div>
          <div class="data-value">{{currentBetData.estimateYield(currentGame).toFixed(2)}} ITT <div>+ {{currentBetData.estimateYieldRate(currentGame).toFixed(2)}}%</div></div>
        </div>
      </div>
    </div>
    <div class="" v-if="false && globalConfig" style="font-size:.75em;">
      {{globalConfig.slot.toNumber()}}<br>
      {{globalConfig.timePerSlot.toNumber()}}<br>
      {{globalConfig.timeCorrection.toNumber()}}<br>
      {{globalConfig.timeCorrectionPerSlot.toNumber()}}<br>
      {{globalConfig.blockTime.toNumber()}}<br>
      {{globalConfig.timeCorrection.toNumber()+globalConfig.blockTime.toNumber()}}<br>
      {{globalConfig.currentStartTime.toNumber()}}
    </div>

    <ModalResult v-model:open="modalOpen" :gameCount="gameCount-1" :betData="prevBetData" :gameData="beforeGame" v-if="prevBetData">

    </ModalResult>
  </div>
</template>

<script lang="ts">
import BetInfo from "@/components/Game/BetInfo.vue";
import GameProgress from "@/components/Game/GameProgress.vue";
import ModalBase from "@/components/Modal/ModalBase.vue";
import ModalResult from "@/components/Modal/ModalResult.vue";
import BetAmountInput from "@/components/UI/BetAmountInput.vue";
import UIPanel from "@/components/UI/UIPanel.vue";
import {BetData} from "@/sdk/chart_game/accounts/BetData";
import {Amount} from "@/sdk/utils/Amount";
import {BN} from "@project-serum/anchor";
import {computed, defineComponent, nextTick, onMounted, ref, watch} from "vue";
import BettingBar from "@/components/Game/BettingBar.vue";
import UIInput from "@/components/UI/UIInput.vue";
import {useStore} from "vuex";
import {RootState} from "@/store";
import Slider from "@vueform/slider"

const GameInfo = defineComponent({
  name: "GameInfo",
  components: {GameProgress, BetInfo, ModalResult, BetAmountInput,  BettingBar, Slider },
  setup(props) {
    const store = useStore<RootState>()
    const currentGame = computed(() => store.getters['game/program/currentGame'])
    const beforeGame = computed(() => store.getters['game/program/beforeGame'])
    const globalConfig = computed(() => store.getters['game/program/globalConfig'])
    const remainingFromEndTime = ref({
      seconds: 0,
      progress: 0,
    })
    const tokenInfo = computed(() => store.getters['game/token/TOKEN_INFO_STRING'])
    const balance = computed(() => store.getters['wallet/GET_BALANCE'])
    const betAmount = ref('')
    const rawBetAmount = ref(new BN(0))
    const maxBetAmount = computed(() => store.getters['game/token/getTokenAmount'](1))
    const gameCount = computed(() => store.getters['game/program/gameCount'])

    const currentBetData = computed<BetData | undefined>(() => store.getters['game/program/getCurrentBetData'])
    const prevBetData = computed<BetData | undefined>(() => store.getters['game/program/getPrevBetData'])
    const needCheckPrevBet = computed(() => store.getters['game/program/getNeedCheckPrevBet'])

    const currentBetDirection = computed(() => currentBetData.value ? currentBetData.value.direction() : '')

    const amountIsZero = computed(() => rawBetAmount.value.isZero())

    const betRate = ref(0)

    const isConnected = computed(() => store.getters['game/profile/isConnected'])
    const needCreate = computed(() => store.getters['game/profile/needCreate'])
    const pendingLength = computed(() => store.getters['game/profile/getClaimableLength'])

    const isMaxPending = computed(() => pendingLength.value === 5)

    const now = computed(() => store.getters['game/program/now'])
    const isBetClose = computed(() => {
      if(currentGame.value)
        return currentGame.value.startTime.add(currentGame.value.betPeriod).toNumber() <= now.value
      return false
    })

    const remainEndTime = computed(() => {
      if(!currentGame.value)
        return 0

      return Math.floor((currentGame.value.endTime.toNumber() - now.value)/1000)
    })

    const longBetDisabled = computed(() => {
      if(isBetClose.value || amountIsZero.value)
        return true

      if(currentBetDirection.value === 'SHORT')
        return true

      if(isConnected.value && needCreate.value && isMaxPending.value)
        return true

      return false
    })

    const shortBetDisabled = computed(() => {
      if(isBetClose.value || amountIsZero.value)
        return true

      if(currentBetDirection.value === 'LONG')
        return true

      if(isConnected.value && needCreate.value && isMaxPending.value)
        return true

      return false
    })

    watch(rawBetAmount, nv => {
      betRate.value = (nv.toNumber()/maxBetAmount.value.toNumber()*100)
    })


    watch(needCheckPrevBet, async (nv) => {
      if(nv) {
        if(prevBetData.value) {
          modalOpen.value = true
          await store.dispatch('game/program/prevBetChecked')
        }
        //if(currentBetData)
      }
    })

    // watch([betRate,rawBetAmount], ([nvRate, nvBetAmount]) => {
    //     rawBetAmount.value = maxBetAmount.value.muln(nvRate).divn(100)
    //     betRate.value = (nvBetAmount.toNumber()/maxBetAmount.value*100)
    //
    // })

    const onSliderChange = (value:number) => {
      //
      rawBetAmount.value = maxBetAmount.value.muln(value).divn(100)
    }

    const quickAmountInput = (rate=1) => {
      rawBetAmount.value = store.getters['game/token/getTokenAmount'](rate)
    }

    const clickBetButton = async (direction:'LONG'|'SHORT') => {
      if(amountIsZero.value)
        return

      try {
        await store.dispatch('game/program/betGame', {
          direction,
          amount: rawBetAmount.value,
        })
      } catch (err: any) {
        alert(err)
      }
    }


    const refreshProgress = () => {
      window.requestAnimationFrame(refreshProgress)
      if (currentGame.value)
        remainingFromEndTime.value = currentGame.value.timeProgressInfo(globalConfig.value.getTimeCorrection())
    }
    onMounted(() => {
      window.requestAnimationFrame(refreshProgress)

      setInterval(async () => {
        await store.dispatch('game/program/setNow')
      }, 1000)
    })

    const modalOpen = ref(false)
    return {
      betRate,
      modalOpen,
      remainingFromEndTime,
      globalConfig,
      tokenInfo,
      balance,
      quickAmountInput,
      betAmount,
      maxBetAmount,
      rawBetAmount,
      clickBetButton,
      amountIsZero,
      currentBetData,
      gameCount,
      currentGame,
      currentBetDirection,
      onSliderChange,
      isBetClose,
      longBetDisabled,
      shortBetDisabled,
      prevBetData,
      isMaxPending,
      needCheckPrevBet,
      beforeGame,
      remainEndTime
    }
  }
})
export default GameInfo
</script>


<style src="@vueform/slider/themes/default.css"></style>
<style lang="scss">

.slider-tooltip {
  background: transparent;
  border: 0;

}
.slider-horizontal {
  .slider-tooltip-top {
    &::before {
      //display: none;

    }


  }
}
:root {
  --slider-connect-bg: #6a58fa;
  --slider-tooltip-arrow-size: 1px;
  --slider-tooltip-distance: 0px;
  --slider-tooltip-py: 0px;
  --slider-tooltip-font-size: .75rem;
  --slider-tooltip-font-weight: 300;
}
</style>
<style lang="scss" scoped>
.bet-info-container {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  gap: 1rem;
  margin-bottom: 1rem;
}
.game-status {
  margin-bottom: 1rem;
}
.game-progress2 {
  width: 100%;
  height: 3rem;
  border-radius: 8px;
  //border: 1px solid #eee;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-color: #ffffff20;
  .inner-bar {
    position: absolute;
    top:0;
    left: 0;
    max-width: 100%;
    min-width: 0%;
    width: 0%;
    height: 100%;
    background-color: #ffffff30;
    transition: width .5s ease;
  }
  .message {
    width: 100%;
    text-align:center;
  }
}
.quick-input-selectors {
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .5rem 0;
  .quick-input {
    border: 1px solid #ffffffd0;
    background: transparent;
    font-size: .75rem;
    line-height: 2em;
    padding: 0 .75rem;
    border-radius: 1.2em;
    color: #fff;
    font-weight: 500;
    transition: all .1s ease;

    &:hover {
      background: #ffffffd0;
      color: $body-bg;
    }

  }
}
.quick-input-slider {
  padding: 2rem .25rem 1rem .25rem;

}

.bet-direction {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .5rem;
  padding: 0 0;
  margin-bottom: 1rem;
  position: relative;

  .closed-bg {
    display: none;
    .message {
      position: relative;
      color: #fff;
      z-index: 5;
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: center;
      gap: .5rem;
      line-height: 1;
      img {
        width: 1rem;
      }

    }
  }
  &.closed {
    &.needClaim {
      .bet-long, .bet-short {
        display: block;
      }
      .need-claim {
        display: none;
      }

    }
    .closed-bg {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: -.25rem;
      right: -.5rem;
      width: calc(100% + 1rem);
      height: calc(100% + .5rem);
      overflow: hidden;
      border-radius: .125rem;
      &:after {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: calc(100% + 50px);
        height: 100%;
        //margin: -.5rem;
        //border: 1px solid #eee;
        opacity: .55;
        z-index: 4;
        animation: bet-locked 1s infinite linear;

        background: repeating-linear-gradient(
            -45deg,
            //#465108,
            //#465108 10px,
            #222,
            #222 10px,
            #333 10px,
            #333 20px
        );
      }
    }

  }

  .need-claim {
    display: none;
  }
  &.needClaim {
    .bet-long, .bet-short {
      display: none;
    }
    .need-claim {
      display: block;
      //position: absolute;
      //top: 0;
      //left: 0;
      //width: 100%;
      //height: 100%;
      width: 100%;

      button {
        width: 100%;
        height: 100%;
        display: flex;
        aling-items: center;
        justify-content: center;
        border-radius: 2rem;
        border: 1px solid #ffffffb0;
        color: #ffffffb0;
        background: transparent;
        transition: all .1s ease;
        animation: pulseHealth 1s ease-out infinite;

        &:hover:not(:disabled) {
          border-color: #fff;
          color: #fff;
          background-color: #ffffff10;
        }
        &:disabled {
          border-color: #ffffff80;
          color: #ffffff80;
        }
      }

    }
  }

  button {
    width: 100%;
    background: transparent;
    color: #fff;
    border: 1px solid #fffffffe;
    padding: 0;
    font-size: .875em;
    line-height: 2;
    border-radius: 4px;
    transition: all .1s ease;
    //&:disabled {
    //  border-color: #ccc !important;
    //  background-color: #ccc !important;
    //  color: #888 !important;
    //}

    &.bet-long {
      color: $long-color;
      border-color: $long-color;
      &:hover:not(:disabled) {
        background-color: $long-color;
        color: $body-bg;
      }
      &:disabled {
        border-color: #79C8C0;
        color: #79C8C0;
        background-color: #79c8c020;
        cursor: not-allowed;
      }
    }
    &.bet-short {
      color: $short-color;
      border-color: $short-color;
      &:hover:not(:disabled) {
        background-color: $short-color;
        color: $body-bg;
      }
      &:disabled {
        border-color: #f59493;
        color: #f59493;
        background-color: #f5949320;
        cursor: not-allowed;
      }
    }
  }
}
.wallet-balance, .bet-info {
  padding-top: .5rem;
  margin-bottom: .5rem;
  border-top: 1px solid #ffffff40;
  font-size: .75em;

  .header {
    font-size: .9rem;
    padding: 0 .5rem;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: .25rem;
    .game-count {
      font-size: .75rem;
      //color: #aaa;
      color: $high-font-color;
      font-weight: 700;
    }
  }

  .data-list {
    padding: 0 .5rem;
    .data {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .data-type {
        color: #aaa;

      }
      .data-value {
        &.LONG {
          color: $long-color;
        }

      }
    }
  }
}

@keyframes bet-locked {
  0% { transform: translateX(0) }
  100% { transform: translateX(-29px) }
  //100% { transform: translateX(0) }

}

@keyframes pulseHealth {
  0% {
    -webkit-box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.1);
  }

  70% {
    -webkit-box-shadow: 0 0 0 .5em rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 0 .5em rgba(255, 255, 255, 0.2);
  }

  100% {
    -webkit-box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.3);
  }
}
</style>
