<template>
  <UIPanel heading="My Information">
    <div class="" >
      <div class="data-group balance">
        <div class="header">Balances</div>
        <div class="data-list">
          <div class="data-type">SOLANA</div>
          <div class="data-value">{{balance}} SOL
            <div><button type="button" class="request" :disabled="!isConnected" @click.prevent="onClickSolanaRequest">Request</button></div>
          </div>
        </div>
        <div class="data-list">
          <div class="data-type">TOKEN</div>
          <div class="data-value">{{tokenInfo.amount}} ITT
            <div><button type="button" class="request" :disabled="!isConnected" @click.prevent="onClickTokenRequest">Request</button></div>
          </div>
        </div>
      </div>
      <div class="data-group counts">
        <div class="header">Counts</div>
        <div class="data-list">
          <div class="data-type">Total</div>
          <div class="data-value">{{counts.game}}</div>
        </div>
        <div class="data-list">
          <div class="data-type">Win / Lose</div>
          <div class="data-value">{{counts.win}} / {{counts.lose}} <div class="percent">{{(counts.win/(counts.win+counts.lose)*100).toFixed(1)}}% / {{(counts.lose/(counts.win+counts.lose)*100).toFixed(1)}}%</div></div>
        </div>
      </div>
      <div class="data-group amounts">
        <div class="header">Amounts</div>
        <div class="data-list">
          <div class="data-type">Acc.Long</div>
          <div class="data-value">{{amounts.longBet.toFixed(2)}} ITT <div>{{(amounts.longBet/(amounts.longBet+amounts.shortBet)*100).toFixed(1)}}%</div></div>
        </div>
        <div class="data-list">
          <div class="data-type">Acc.Short</div>
          <div class="data-value">{{amounts.shortBet.toFixed(2)}} ITT<div>{{(amounts.shortBet/(amounts.longBet+amounts.shortBet)*100).toFixed(1)}}%</div></div>
        </div>
        <div class="data-list">
          <div class="data-type">Acc.Prize</div>
          <div class="data-value">{{amounts.claim.toFixed(2)}} ITT</div>
        </div>
      </div>

      <div class="data-group pending-counts">
        <div class="header">Prize</div>
        <div class="data-list">
          <div class="data-type">Pending</div>
          <div class="data-value" :class="{maxPending:pendingLength===5}">{{pendingLength}}</div>
        </div>
        <div class="data-list">
          <div class="data-type">Claimable Amounts</div>
          <div class="data-value">{{claimable.toFixed(2)}} ITT
            <div class="claim-button" :class="{maxPending:pendingLength===5}">
              <button type="button" :disabled="!pendingLength" @click.prevent="onClickClaim">Claim & Reflect</button>
            </div>
          </div>
        </div>
      </div>

    </div>

  </UIPanel>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, watch} from "vue";
import UIHeading from "@/components/UI/UIHeading.vue";
import UIPanel from "@/components/UI/UIPanel.vue";
import {useStore} from "vuex";
import {RootState} from "@/store";

const MyInformation = defineComponent({
  name: "MyInformation",
  components: {UIPanel, },
  setup(props) {
    const store = useStore<RootState>()
    const isConnected = computed(() => store.getters['game/profile/isConnected'])
    const needCreate = computed(() => store.getters['game/profile/needCreate'])
    const counts = computed(() => store.getters['game/profile/getCounts'])
    const amounts = computed(() => store.getters['game/profile/getAmounts'])
    const claimable = computed(() => store.getters['game/profile/getClaimableAmounts'])
    const pendingLength = computed(() => store.getters['game/profile/getClaimableLength'])

    const tokenInfo = computed(() => store.getters['game/token/TOKEN_INFO_STRING'])
    const balance = computed(() => store.getters['wallet/GET_BALANCE'])
    const onClickClaim = async () => {
      try {
        await store.dispatch('game/profile/claim')
      } catch (err) {
        alert(err)
      }
    }

    const onClickSolanaRequest = async () => {
      try {
        await store.dispatch('wallet/requestFaucet')
      } catch (err) {
        alert(err)
        //
      }

    }

    const onClickTokenRequest = async () => {
      try {
        await store.dispatch('game/token/requestFaucetToken')
      } catch (err) {
        alert(err)
        //
      }

    }


    watch(isConnected, async () => {
      //await store.dispatch('game/profile/fetchUserData')
    })

    onMounted(async () => {
      //if(isConnected.value)
      //  await store.dispatch('game/profile/fetchUserData')
    })

    return {
      isConnected,
      needCreate,
      counts,
      amounts,
      claimable,
      pendingLength,
      tokenInfo,
      balance,
      onClickClaim,
      onClickSolanaRequest,
      onClickTokenRequest
    }
  }
})

export default MyInformation
</script>

<style lang="scss" scoped>
.counts {
  //display: flex;
  //align-items:center;
  //gap: 16px;

}
.request {
  border: 1px solid #ffffffb0;
  background: transparent;
  color: #ffffffb0;
  padding: 0 .5rem;
  line-height: 1.6em;
  border-radius: calc(.8em + 2px);
  transition: all .1s ease;

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
.data-group {

  border-bottom: 1px dashed #ffffff80;
  padding: .5rem 0;

  &:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }

  .header {
    font-size: .9rem;
    //padding: 0 .5rem;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: .25rem;
  }
}
.data-list {
  display:flex;
  aling-items: center;
  justify-content: space-between;
  font-size: .75em;
  //gap: 6px;
  margin-bottom: .25rem;
  &:last-child {
    margin-bottom: 0;
  }
  .data-type {
    color: #aaa;
  }
  .data-value {
    color: #fff;
    text-align: right;
    .percent {

    }
    .maxPending {
      color: #e82222;
    }
  }
}
.claim-button {
  padding-top: .5rem;
  button {
    border: 1px solid #ffffffb0;
    background: transparent;
    color: #ffffffb0;
    padding: 0 1rem;
    line-height: 2em;
    border-radius: calc(1em + 2px);
    transition: all .1s ease;

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

  &.maxPending {
    button {
      -webkit-animation: pulseHealth 1s ease-out infinite;
      animation: pulseHealth 1s ease-out infinite;
    }

  }
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
