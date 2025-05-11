import {PhantomWalletAdapter} from "@solana/wallet-adapter-phantom";
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import SolanaWallets, {WalletStoreProps} from 'solana-wallets-vue';
import VueGtag from "vue-gtag"

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
// You can either import the default styles or create your own.
import 'solana-wallets-vue/styles.css';

const walletOptions:WalletStoreProps = {
  wallets: [
    new PhantomWalletAdapter()
  ],

  autoConnect: true,
}


createApp(App)
  .use(store)
  .use(router)
  .use(SolanaWallets, walletOptions)
  .use(VueGtag, {
    appName: 'SolBet Web',
    pageTrackerScreenviewEnabled: true,
    config: { id: "G-CODE" }
  },router)
  .mount('#app')
