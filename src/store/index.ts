import moduleGame, {GameState} from "@/store/game";
import moduleWallet, {WalletState} from "@/store/wallet";
import { createStore } from 'vuex'

export interface IRootState {
  game: GameState
  wallet: WalletState
}

export class RootState implements IRootState {
  game = new GameState()
  wallet = new WalletState()
}

export default createStore<RootState>({
  //state: {},
  getters: { },
  mutations: { },
  actions: { },
  modules: {
    game: moduleGame,
    wallet: moduleWallet,
  }

})
