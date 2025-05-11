<template>
  <WalletMultiButton/>
</template>

<script lang="ts">
import {GlobalConfigData} from "@/sdk/chart_game/accounts/GlobalConfigData";
import {ChartGame} from "@deployments/chart_game";
import {Program} from "@project-serum/anchor";
import EventEmitter from "events";
import {computed, defineComponent, nextTick, onMounted, ref, watch} from "vue";
import {useAnchorWallet, WalletMultiButton} from "solana-wallets-vue";
import {useStore} from "vuex";
import {RootState} from "@/store";

const WalletComponent = defineComponent({
  name: "WalletComponent",
  components: {WalletMultiButton},
  setup(props) {
    const store = useStore<RootState>()
    const wallet = useAnchorWallet()
    const program = computed<Program<ChartGame>>(() => store.getters['game/program/GET_PROGRAM'])
    //const gcEventEmitter = ref()
    const emitter = computed<EventEmitter>(() => store.getters['game/program/getEventEmitter'])

    watch(wallet, async () => {
      //console.log(wallet.value)
      if(wallet.value) {
        await store.dispatch('wallet/initWallet', wallet.value)
        await store.dispatch('game/token/initializeMintAccount')
        await store.dispatch('game/token/getTokenAccount')
        await store.dispatch('game/profile/fetchUserData')
        await store.dispatch('game/program/getBetData')
      }
      else
        await store.dispatch('wallet/releaseWallet')
    })

    onMounted(async () => {
      await store.dispatch('wallet/initWallet', wallet.value)
      await store.dispatch('game/token/initializeMintAccount')
      await store.dispatch('game/program/initializeProgram')

      // emitter.value.addListener('change', (globalConfig:any) => {
      //   console.log(globalConfig.currentStartTime)
      // })
      //console.log(localStorage)
      /*console.log('add event')

      listener.value = program.value.addEventListener('change', (ev:any, slot:number) => {
        console.log('event emitted')
        console.log(ev)
        console.log(slot)
      })*/

      //gcEventEmitter.value = await GlobalConfigData.subscribeChanges(program.value)
    })


    return {
    }
  }
})

export default WalletComponent
</script>

<style scoped>

</style>
