import {getSolana, toEtherString} from "@/sdk/utils";
import {Amount} from "@/sdk/utils/Amount";
import {RootState} from "@/store";
import {AnchorProvider, Wallet} from "@project-serum/anchor";
import {Connection, LAMPORTS_PER_SOL, PublicKey, Transaction} from "@solana/web3.js";
import {ActionTree, GetterTree, Module, MutationTree} from "vuex";
import * as anchor from '@project-serum/anchor'

declare let window: any

export class WalletState {
  public wallet: Wallet | undefined
  public connection: Connection
  public provider: AnchorProvider | undefined
  public rpcEndpoint: string = process.env.VUE_APP_RPC_ENDPOINT!
  public wssEndpoint: string = process.env.VUE_APP_WSS_ENDPOINT!
  public balance = new anchor.BN(0)
}

const mutations: MutationTree<WalletState> = {
  SET_WALLET(state, wallet: Wallet | undefined) {
    state.wallet = wallet

  },
  SET_PROVIDER(state, provider: AnchorProvider) {
    state.provider = provider
  },
  SET_CONNECTION(state, connection: Connection) {
    state.connection = connection
  },
  SET_BALANCE(state, balance) {
    state.balance = balance
  }
}

const actions: ActionTree<WalletState, RootState> = {
  async initWallet({state, commit,dispatch}, wallet?: Wallet) {

    if(!state.connection) {
      const connection = new Connection(state.rpcEndpoint, {
        commitment: 'processed',
        wsEndpoint: state.wssEndpoint,
      })
      commit('SET_CONNECTION', connection)
    }
    if(wallet) {
      if(wallet.publicKey.equals(PublicKey.default))
        return

      commit('SET_WALLET', wallet)

      const provider = new AnchorProvider(state.connection, wallet, {
        preflightCommitment: 'processed',
        commitment: 'processed',
      })
      commit('SET_PROVIDER', provider)

      commit('game/profile/SET_ADDRESS', wallet.publicKey, { root: true})

      await dispatch('fetchBalance')
    } else {
      const provider = new AnchorProvider(state.connection, window.solana, {
        preflightCommitment: 'processed',
        commitment: 'processed',
      })
      commit('SET_PROVIDER', provider)
      commit('SET_WALLET', undefined)
    }
  },
  releaseWallet(context) {
    context.commit('SET_WALLET', undefined)
    context.commit('game/profile/SET_ADDRESS', PublicKey.default, { root: true})
  },
  async fetchBalance({state, rootState, commit}) {
    if(state.wallet)
      commit('SET_BALANCE', await getSolana(state.provider!, state.wallet!.publicKey))
  },

  async requestFaucet({state, getters, rootGetters, rootState, dispatch}) {
    const tx = await state.provider.connection.requestAirdrop(rootGetters['game/profile/address'], LAMPORTS_PER_SOL*2)
    await state.provider.connection.confirmTransaction(tx)

    await dispatch('fetchBalance')
  },

  async sendTransaction({state, getters, rootGetters, rootState,}, transaction:Transaction) {
    transaction.feePayer = state.wallet.publicKey
    transaction.recentBlockhash = (await state.connection.getLatestBlockhash()).blockhash

    const signedTx = await state.wallet.signTransaction(transaction)
    const txId = await state.connection.sendRawTransaction(signedTx.serialize())
    await state.connection.confirmTransaction(txId)
    console.log(txId)
  },

}

const getters: GetterTree<WalletState, RootState> = {
  ADDRESS_STRING(state): string {
    return state.wallet? state.wallet.publicKey.toBase58() : 'DISCONNECTED'
    //return state.address.toBase58()
  },
  IS_CONNECTED(state): boolean {
    return state.wallet === undefined
  },
  GET_BALANCE(state): string {
    //console.log(state.balance.toNumber())
    return Amount.toNumber(state.balance, 9)+''
  },
  GET_PROVIDER(state): AnchorProvider {
    if(!state.provider)
      throw new Error("PROVIDER_NOT_CONNECTED")

    return state.provider
  }

}

const moduleWallet: Module<WalletState, RootState> = {
  namespaced: true,
  state: new WalletState(),
  mutations,
  actions,
  getters
}

export default moduleWallet
