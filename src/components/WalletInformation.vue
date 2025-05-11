<template>
  <UIPanel heading="Wallet">
    <div class="wallet-balance">
      <div class="header" v-if="false">Balance</div>
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

  </UIPanel>
</template>

<script lang="ts">
import UIPanel from "@/components/UI/UIPanel.vue";
import {RootState} from "@/store";
import {computed, defineComponent} from "vue";
import {useStore} from "vuex";

const WalletInformation = defineComponent({
  name: "WalletInformation",
  components: {UIPanel},
  setup(props) {
    const store = useStore<RootState>()
    const tokenInfo = computed(() => store.getters['game/token/TOKEN_INFO_STRING'])
    const balance = computed(() => store.getters['wallet/GET_BALANCE'])
    return {
      tokenInfo,
      balance
    }
  }
})

export default WalletInformation
</script>

<style lang="scss" scoped>

.wallet-balance {
  padding-top: .5rem;
  margin-bottom: .5rem;
  //border-top: 1px solid #ffffff80;
  font-size: .75em;

  .header {
    font-size: .9rem;
    padding: 0 .5rem;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: .25rem;
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
    }
  }
}
</style>
