import {getFaucetProgram, TOKEN_MINT_ID} from "@/sdk/constant";
import {getAtaForMint, getTokenInfo, getTokenBalance, Mint, Token, getMint, toEtherString} from "@/sdk/utils";
import {getFaucetAccount, getFaucetHistoryAccount, getFaucetTokenVaultAccount} from "@/sdk/utils/accounts";
import {Amount} from "@/sdk/utils/Amount";
import {RootState} from "@/store";
import {BN} from "@project-serum/anchor";
import {AccountInfo, ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID} from "@solana/spl-token";
import {Keypair, PublicKey, SYSVAR_CLOCK_PUBKEY, SYSVAR_RENT_PUBKEY} from "@solana/web3.js";
import {ActionTree, GetterTree, Module, MutationTree} from "vuex";


export class TokenState {
  public tokenMintId: PublicKey = TOKEN_MINT_ID
  public mint: Partial<Mint> = {}
  public token: Partial<Token> = {}
}
const mutations:MutationTree<TokenState> = {

  SET_TOKEN_ACCOUNT_INFO(state, token: Partial<Token>) {
    state.token = {
      ...token
    }
  },
  SET_MINT(state, mint: Partial<Mint>) {
    state.mint = {
      ...mint
    }
  }

}

const actions: ActionTree<TokenState, RootState> = {
  async initializeMintAccount({state, rootState, commit}) {
    const mint = await getMint(rootState.wallet.provider!, state.tokenMintId)
    commit('SET_MINT', mint)
  },
  async getTokenAccount({state, rootState, commit}) {
    const token = await getTokenInfo(rootState.wallet.provider!, state.tokenMintId, rootState.wallet.wallet!.publicKey)
    //const ataInfo = await getAtaInfo(rootState.wallet.provider!, state.tokenMintId, new PublicKey('B6VkepmGXk19wuJJh4gHGMaLL3Po15BkrxjymZhBVAjX'))
    commit('SET_TOKEN_ACCOUNT_INFO', token)
  },

  async requestFaucetToken({state, getters, rootGetters, rootState, dispatch}) {
    const program = await getFaucetProgram(rootGetters['wallet/GET_PROVIDER'])

    //const dummy = Keypair.generate()

    const [faucetAccount] = await getFaucetAccount(program)
    const [faucetHistory] = await getFaucetHistoryAccount(program, rootGetters['game/profile/address'])
    const [tokenVault] = await getFaucetTokenVaultAccount(program)

    const tx = await program.methods.faucet()
      .accounts({
        payer: rootGetters['game/profile/address'],
        faucetAccount,
        faucetHistory,
        tokenVault,
        tokenMint: TOKEN_MINT_ID,
        payerTokenAccount: state.token.address,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        clock: SYSVAR_CLOCK_PUBKEY
      }).signers([]).rpc()

    //console.log(tx)

    await dispatch('getTokenAccount')
  }
}
const getters: GetterTree<TokenState, RootState> = {
  MINT_ADDRESS_STRING(state): string {
    return state.tokenMintId.toBase58()
  },
  MINT_ADDRESS(state): PublicKey {
    return state.tokenMintId
  },
  TOKEN_INFO(state): Partial<Token> {
    return state.token
  },
  TOKEN_INFO_STRING(state) {
    return {
      address: state.token.address?.toBase58(),
      amount: state.token.amount? Amount.toNumber(state.token.amount, 6) : 0,
      isInitialized: state.token.isInitialized
    }
  },
  getTokenAmount(state) {
    return (rate=1) => {
      return state.token.amount? state.token.amount.divn(100).muln(rate*100) : new BN(0)
    }
  }
}

const moduleToken: Module<TokenState, RootState> = {
  namespaced: true,
  state: new TokenState(),
  actions,
  mutations,
  getters
}

export default moduleToken
