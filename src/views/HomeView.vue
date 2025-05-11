<template>
  <div class="home">

    <HelloWorld />

  </div>
</template>

<script lang="ts">
import {WalletMultiButton} from "solana-wallets-vue";
import { Options, Vue } from 'vue-class-component';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Options({
  components: {
    WalletMultiButton,
    HelloWorld,
  },
})
export default class HomeView extends Vue {}
</script>
