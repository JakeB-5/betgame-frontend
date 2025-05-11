<template>
  <UIPanel>
    <template #heading>
      <UIHeading>Manager Control Panel</UIHeading>
    </template>
    <template #default>
      <div>Program Address: {{programAddress}}</div>
      <div>My Address: {{myAddress}}</div>
      <div>SOL Balance: {{balance}}</div>
      <div>Token Mint: {{mintAddress}}</div>
      <div>Token Account: {{tokenInfo.address}} (initialized: {{tokenInfo.isInitialized}})</div>
      <div>Token Balance: {{tokenInfo.amount}}</div>
      <div class="">
        <button type="button" @click.prevent="requestTokenFaucet">Request Token</button>
        <button type="button" @click.prevent="requestFaucet">Request Faucet</button>
      </div>
    </template>

  </UIPanel>
</template>

<script lang="ts">
import UIHeading from "@/components/UI/UIHeading.vue";
import UIPanel from "@/components/UI/UIPanel.vue";
import {RootState} from "@/store";
import {computed, defineComponent} from "vue";
import {useStore} from "vuex";

const ManagerControlPanel = defineComponent({
  name: "ManagerControlPanel",
  components: {UIPanel, UIHeading},
  setup(props) {
    const store = useStore<RootState>()
    const programAddress = computed(() => store.getters['game/program/PROGRAM_ADDRESS_STRING'])
    const mintAddress = computed(() => store.getters['game/token/MINT_ADDRESS_STRING'])
    const myAddress = computed(() => store.getters['game/profile/addressString'])
    const tokenInfo = computed(() => store.getters['game/token/TOKEN_INFO_STRING'])
    const balance = computed(() => store.getters['wallet/GET_BALANCE'])

    const requestFaucet = async () => {
      await store.dispatch('wallet/requestFaucet')
    }

    const requestTokenFaucet = async () => {
      await store.dispatch('game/token/requestFaucetToken')
    }

    return {
      programAddress,
      mintAddress,
      myAddress,
      tokenInfo,
      balance,

      requestFaucet,
      requestTokenFaucet,
    }
  }
})

export default ManagerControlPanel
</script>

<style scoped>

</style>
