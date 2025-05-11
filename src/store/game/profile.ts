import {GlobalConfigData} from "@/sdk/chart_game/accounts/GlobalConfigData";
import {UserData} from "@/sdk/chart_game/accounts/UserData";
import {UserEntrantData} from "@/sdk/chart_game/accounts/UserEntrantData";
import {getTokenVaultAccount} from "@/sdk/utils/accounts";
import {ChartGame} from "@deployments/chart_game";
import {getAtaForMint, getUserDataAccount, getUserEntrantsAccount} from "@/sdk/utils";
import {Amount} from "@/sdk/utils/Amount";
import {RootState} from "@/store";
import * as anchor from "@project-serum/anchor";
import {Program} from "@project-serum/anchor";
import {AccountInfo} from "@solana/spl-token";
import {PublicKey} from "@solana/web3.js";
import {ActionTree, GetterTree, Module, MutationTree} from "vuex";


export class ProfileState {
  public address: PublicKey = PublicKey.default
  public needCreate = true
  public userData: UserData
  public userEntrantData: UserEntrantData
}

const mutations: MutationTree<ProfileState> = {
  SET_ADDRESS(state, address: PublicKey) {
    state.address = address
  },
  setUserData(state, payload: UserData) {
    state.userData = payload
    state.needCreate = false
  },
  setUserEntrantData(state, payload: UserEntrantData) {
    state.userEntrantData = payload
  }

}

const actions: ActionTree<ProfileState, RootState> = {
  async fetchUserData({state,commit,getters, rootGetters, dispatch}) {
    if(state.address.equals(PublicKey.default))
      return

    try {
      commit('setUserData', await UserData.fromSeeds(rootGetters['game/program/GET_PROGRAM'], state.address))
      await dispatch('fetchUserEntrants')
    } catch (err) {
      //console.log(err)
      //
    }
  },
  async fetchUserEntrants({state,commit,getters,rootGetters}) {
    if(state.address.equals(PublicKey.default))
      return

    const program = rootGetters['game/program/GET_PROGRAM']
    const userEntrantData = await UserEntrantData.fromSeeds(program, state.address)
    await userEntrantData.loadEntrants(program)
    commit('setUserEntrantData', userEntrantData)

  },

  async claim({state,commit,getters, rootGetters, dispatch}) {
    const program: Program<ChartGame> = rootGetters['game/program/GET_PROGRAM']
    const globalConfigDataAccount = await GlobalConfigData.addressFromSeeds(program)
    const globalConfigData = rootGetters['game/program/globalConfig']
    const [userDataAccount] = await getUserDataAccount(program, rootGetters['game/profile/address'])
    const [userEntrantsAccount] = await getUserEntrantsAccount(program, rootGetters['game/profile/address'])
    const [userTokenAccount] = await getAtaForMint(globalConfigData.tokenMint, rootGetters['game/profile/address'])
    const [tokenVault] = await getTokenVaultAccount(program, globalConfigData.tokenMint)

    const [topPlayersAccount] = await PublicKey.findProgramAddress([
      anchor.utils.bytes.utf8.encode('top-players'),
    ], program.programId)

    const transaction = await program.methods.claimPrize()
      .accounts({
        payer: rootGetters['game/profile/address'],
        globalConfigData: globalConfigDataAccount,
        userData: userDataAccount,
        entrants: userEntrantsAccount,
        tokenMint: globalConfigData.tokenMint,
        tokenVault,
        payerTokenAccount: userTokenAccount,
        topPlayersAccount,
      })
      .remainingAccounts(state.userEntrantData.getClaimAccounts())
      .signers([]).transaction()

    await dispatch('wallet/sendTransaction', transaction, {root:true})

    await dispatch('fetchUserData')
    await dispatch('game/token/getTokenAccount',{}, {root:true})
    await dispatch('wallet/fetchBalance',{}, {root:true})
  }
}

const getters: GetterTree<ProfileState, RootState> = {
  address(state): PublicKey {
    return state.address
  },
  addressString(state, rootState): string {
    return state.address.toBase58()
  },
  isConnected(state): boolean {
    return !state.address.equals(PublicKey.default)
  },
  getCounts(state) {
    return state.needCreate ? {
      win:0, lose: 0, draw: 0, bet: 0, game: 0
    } : state.userData.counts()
  },
  getAmounts(state) {
    return state.needCreate ? {
      bet: 0,
      longBet: 0,
      shortBet: 0,
      claim: 0,
    } : state.userData.amounts()
  },
  needCreate(state) {
    return state.needCreate
  },
  getClaimableAmounts(state) {
    return state.userEntrantData? Amount.toNumber(state.userEntrantData.claimableAmounts(),6) : 0
  },
  getClaimableLength(state) {
    return state.userEntrantData ? state.userEntrantData.getLength() : 0
  },

}

const moduleProfile: Module<ProfileState, RootState> = {
  namespaced: true,
  state: new ProfileState(),
  actions,
  mutations,
  getters
}

export default moduleProfile
