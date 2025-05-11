import {BetData} from "@/sdk/chart_game/accounts/BetData";
import {GameData, GameDataArgs, getGameDataAccount} from "@/sdk/chart_game/accounts/GameData";
import {
  findTokenVaultAddress,
  getGlobalConfigDataAccount,
  GlobalConfigData,
  GlobalConfigDataArgs
} from "@/sdk/chart_game/accounts/GlobalConfigData";
import {TopPlayers, TopPlayersArgs} from "@/sdk/chart_game/accounts/TopPlayers";
import {Amount} from "@/sdk/utils/Amount";
import * as anchor from "@project-serum/anchor";
import {RecentlyGames, RecentlyGamesArgs} from "@/sdk/chart_game/accounts/RecentlyGames";
import {GameStatProp} from "@/sdk/chart_game/types/statistics";
import {getChartGameProgram, TOKEN_MINT_ID} from "@/sdk/constant";
import {PROGRAM_ADDRESS, PROGRAM_ID} from "@/sdk/constant";
import {ChartGame} from "@deployments/chart_game";
import {getSolana} from "@/sdk/utils";
import {LogParser, ProgramLog} from "@/sdk/utils/LogParser";
import {RootState} from "@/store";
import {AnchorProvider, BN, Program} from "@project-serum/anchor";
import {TOKEN_PROGRAM_ID} from "@solana/spl-token";
import {PublicKey} from "@solana/web3.js";
import EventEmitter from "events";
import {getAtaForMint, getBetDataAccount, getUserDataAccount, getUserEntrantsAccount} from "@/sdk/utils";
import {ActionTree, GetterTree, Module, MutationTree} from "vuex";

type GamesKey = 'current' | 'before' | 'after'

export class ProgramState {
  public program: Program<ChartGame>
  public globalConfig: GlobalConfigData
  public globalConfigEmitter: EventEmitter
  public logs: ProgramLog[] = []
  public recentlyGames: RecentlyGames
  public recentlyGamesEmitter: EventEmitter
  public topPlayers: TopPlayers
  public topPlayersEmitter: EventEmitter

  public needCheckPrevBet = false
  public prevBetData: BetData
  public currentBetData: BetData
  public now = Date.now()

  public games: {
    [K in GamesKey]: GameData | undefined;
  } = {
    current: undefined,
    before: undefined,
    after: undefined
  }

  public lastLongBet = 0
  public lastShortBet = 0
}

const mutations:MutationTree<ProgramState> = {
  SET_PROGRAM(state, payload: Program<ChartGame>) {
    state.program = payload
  },
  SET_GLOBAL_CONFIG(state, payload: GlobalConfigData) {
    state.globalConfig = payload
  },
  SET_GLOBAL_CONFIG_EVENT_EMITTER(state, payload: EventEmitter) {
    state.globalConfigEmitter = payload
  },
  SET_RECENTLY_GAMES(state, payload: RecentlyGames) {
    state.recentlyGames = payload
  },
  SET_RECENTLY_GAMES_EVENT_EMITTER(state, payload: EventEmitter) {
    state.recentlyGamesEmitter = payload
  },
  SET_TOP_PLAYERS(state, payload: TopPlayers) {
    state.topPlayers = payload
  },
  SET_TOP_PLAYER_EVENT_EMITTER(state, payload: EventEmitter) {
    state.topPlayersEmitter = payload
  },
  SET_GAME_DATA(state, payload: {
    key: GamesKey,
    game: GameData
  }) {
    state.games = {
      ...state.games,
      [payload.key]: payload.game
    }
  },
  SET_GAME_DATA_BUNDLE(state, payload: {
    [K in GamesKey]: GameData | undefined;
  }) {
    state.games = payload
  },
  SET_PREV_BET_DATA(state, payload: BetData) {
    state.prevBetData = payload
    if(payload)
      state.needCheckPrevBet = true
  },
  SET_CHECKED_PREV_BET(state) {
    state.needCheckPrevBet = false
  },
  SET_CURRENT_BET_DATA(state, payload: BetData) {
    state.currentBetData = payload
  },
  PUSH_LOG(state, payload: ProgramLog) {
    // state.logs.push(payload)// = [...state.logs, payload]
    // if(state.logs.length - 6 > 0)
    //   state.logs.splice(0, 1)

    // const logs = state.logs.map(log => {
    //   return { ...log }
    // }).slice(-5)
    //console.log(logs.length, logs.map((log:ProgramLog) => (log.time.format('mm:ss'))).join(','))
    state.logs = [...state.logs.slice(-20), payload]

    //state.logs = state.logs.slice(-20)
  },
  SET_NOW(state, payload: number) {
    state.now = payload
  },
  SET_LAST_LONG_BET(state, payload: number) {
    state.lastLongBet = payload
  },
  SET_LAST_SHORT_BET(state, payload: number) {
    state.lastShortBet = payload
  },
}

const actions: ActionTree<ProgramState, RootState> = {
  async initializeProgram({state, rootState, commit, rootGetters, dispatch}) {
    const provider: AnchorProvider = rootGetters['wallet/GET_PROVIDER']
    const program = await getChartGameProgram(provider)
    commit('SET_PROGRAM', program)
    const address = await GlobalConfigData.addressFromSeeds(program)
    const emitter = program.account.globalConfigData.subscribe(address)
    commit('SET_GLOBAL_CONFIG_EVENT_EMITTER', emitter)
    const topPlayersAddress = await TopPlayers.addressFromSeeds(program)
    const topPlayersEmitter = program.account.topPlayers.subscribe(topPlayersAddress)
    commit('SET_TOP_PLAYER_EVENT_EMITTER', topPlayersEmitter)
    const recentlyGamesAddress = await RecentlyGames.addressFromSeeds(program)
    const recentlyGamesEmitter = program.account.recentlyGames.subscribe(recentlyGamesAddress)
    commit('SET_RECENTLY_GAMES_EVENT_EMITTER', recentlyGamesEmitter)

    // const sg = await provider.connection.getSignaturesForAddress(program.programId, {limit: 5}, 'processed')
     //const psg =await provider.connection.getParsedTransactions(sg.map(s=>s.signature))
    //
    // psg.map( v => LogParser.parse({
    //   logs: v.meta.logMessages,
    //   signature: v.transaction.signatures[0],
    //   err: v.meta.err,
    // }, v.blockTime*1000)).filter(v => v != null).reverse().forEach(v => {
    //   commit('PUSH_LOG', v)
    // })

    // console.log('action/initializeProgram')
    // state.globalConfigEmitter.addListener('change', async (globalConfig: GlobalConfigDataArgs) => {
    //   const _currentStartTime = state.globalConfig.currentStartTime
    //   commit('SET_GLOBAL_CONFIG', GlobalConfigData.fromArgs(globalConfig))
    //   //console.log('emit:change global config data', _currentStartTime.toNumber(), globalConfig.currentStartTime.toNumber())
    //   if(_currentStartTime.toNumber() !== globalConfig.currentStartTime.toNumber()) {
    //     //console.log('eq')
    //
    //   } else {
    //     //await dispatch('loadOnlyCurrentGameData')
    //   }
    //   //await dispatch('game/profile/fetchUserData',{}, {root:true})
    //
    // })
    state.topPlayersEmitter.addListener('change', async (topPlayers: TopPlayersArgs) => {
      commit('SET_TOP_PLAYERS', TopPlayers.fromArgs(topPlayers))
    })
    state.recentlyGamesEmitter.addListener('change', async (recentlyGames: RecentlyGamesArgs) => {
      commit('SET_RECENTLY_GAMES', RecentlyGames.fromArgs(recentlyGames))
    })

    program.addEventListener('GameChanged', async (e, slot) => {
      LogParser.fromGameChangedEvent(e)
      await dispatch('loadGlobalConfig')
      //e의 시간데이터로 로드데이터
      await dispatch('loadGameData')
      //await dispatch('loadRecentlyGames')
      await dispatch('getBetData')
      //console.log(slot)
      await dispatch('game/profile/fetchUserData', {}, {root:true})
    })
    program.addEventListener('UserBet', (e, slot) => {
      commit('PUSH_LOG', LogParser.fromUserBetEvent(e))

      if(Object.keys(e.betDirection).join()==='long')
        commit('SET_LAST_LONG_BET', Amount.toNumber(e.betAmount,6))
      else
        commit('SET_LAST_SHORT_BET', Amount.toNumber(e.betAmount,6))
      //console.log(slot)
    })
    program.addEventListener('GameUpdated', async (e, slot) => {
      //
      const gameData: GameDataArgs = e
      //console.log(gameData)
      if(state.games['current'].isEqualsTime(gameData.startTime, gameData.endTime))
        commit('SET_GAME_DATA',
          {
            key:'current',
            game: await GameData.fromArgs(gameData)
          })

    })
    await dispatch('loadGlobalConfig')
    await dispatch('loadTopPlayers')

    await dispatch('loadGameData')
    await dispatch('loadRecentlyGames')

    await dispatch('getBetData')
  },
  async loadGlobalConfig({state,dispatch,commit,getters}) {
    commit('SET_GLOBAL_CONFIG', await GlobalConfigData.fromSeeds(getters['GET_PROGRAM']))
  },
  async loadGameData({state,commit,getters}) {

    commit('SET_GAME_DATA_BUNDLE', {
      current:await GameData.fromSeeds(getters['GET_PROGRAM'], state.globalConfig.currentTime()),
      before:await GameData.fromSeeds(getters['GET_PROGRAM'], state.globalConfig.beforeTime()),
      after:await GameData.fromSeeds(getters['GET_PROGRAM'], state.globalConfig.afterTime()),
    })
    // commit('SET_GAME_DATA',
    //   {
    //     key:'current',
    //     game: await GameData.fromSeeds(getters['GET_PROGRAM'], state.globalConfig.currentTime())
    //   })
    // commit('SET_GAME_DATA',
    //   {
    //     key:'before',
    //     game: await GameData.fromSeeds(getters['GET_PROGRAM'], state.globalConfig.beforeTime())
    //   })
    // commit('SET_GAME_DATA',
    //   {
    //     key:'after',
    //     game: await GameData.fromSeeds(getters['GET_PROGRAM'], state.globalConfig.afterTime())
    //   })
  },
  async loadOnlyCurrentGameData({state,commit,getters}) {
    commit('SET_GAME_DATA',
      {
        key:'current',
        game: await GameData.fromSeeds(getters['GET_PROGRAM'], state.globalConfig.currentTime())
      })
  },

  async loadRecentlyGames({state,commit,getters}) {
    const recentlyGames = await RecentlyGames.fromSeeds(getters['GET_PROGRAM'])
    //await recentlyGames.loadGames(getters['GET_PROGRAM'])
    //recentlyGames.games.push(getters['currentGame'])
    commit('SET_RECENTLY_GAMES', recentlyGames)
  },
  async loadTopPlayers({state,commit,getters}) {
    //const address = await GlobalConfigData.addressFromSeeds(program)
    //const emitter = program.account.globalConfigData.subscribe(address)
    //commit('SET_GLOBAL_CONFIG_EVENT_EMITTER', emitter)
    const topPlayers = await TopPlayers.fromSeeds(getters['GET_PROGRAM'])
    commit('SET_TOP_PLAYERS', topPlayers)
  },

  async betGame({state,commit,getters, rootGetters,dispatch}, payload:{
    direction: 'LONG'|'SHORT',
    amount: BN
  }) {
    const program: Program<ChartGame> = getters['GET_PROGRAM']

    const globalConfigDataAccount = await GlobalConfigData.addressFromSeeds(program)
    const gameDataAccount = await GameData.addressFromSeeds(program, state.globalConfig.currentTime())
    const [betDataAccount] = await getBetDataAccount(program, gameDataAccount, rootGetters['game/profile/address'])
    const [userDataAccount] = await getUserDataAccount(program, rootGetters['game/profile/address'])
    const [userEntrantsAccount] = await getUserEntrantsAccount(program, rootGetters['game/profile/address'])
    const [userTokenAccount] = await getAtaForMint(state.globalConfig.tokenMint, rootGetters['game/profile/address'])
    const [tokenVault] = await findTokenVaultAddress(program, rootGetters['game/token/MINT_ADDRESS'])

    //alert(rootGetters['game/profile/address'].toBase58())

    const currentGame = getters['currentGame']

    const transaction = await program.methods.betGame(
      currentGame.startTime,
      currentGame.endTime,
        payload.direction === 'LONG' ? {long: {}} : {short: {}},
        payload.amount
      )
        .accounts({
          payer: rootGetters['game/profile/address'],
          globalConfigData: globalConfigDataAccount,
          gameData: gameDataAccount,
          betData: betDataAccount,
          userData: userDataAccount,
          entrants: userEntrantsAccount,
          tokenMint: state.globalConfig.tokenMint,
          tokenVault: tokenVault,
          payerTokenAccount: userTokenAccount,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        }).signers([]).transaction()

    await dispatch('wallet/sendTransaction', transaction, {root:true})
    await dispatch('getBetData', betDataAccount)

    await dispatch('game/token/getTokenAccount',{}, {root:true})
    await dispatch('wallet/fetchBalance',{}, {root:true})
    await dispatch('game/profile/fetchUserData', {}, {root:true})

  },
  async getBetData({state,commit,getters, rootGetters}, payload?: PublicKey) {
    const program: Program<ChartGame> = getters['GET_PROGRAM']

    const userAddress: PublicKey = rootGetters['game/profile/address']
    if(userAddress.equals(PublicKey.default))
      return

    const gameDataAccount = await GameData.addressFromSeeds(program, state.globalConfig.currentTime())
    const betAccountAddress = await BetData.addressFromSeeds(program, gameDataAccount, userAddress)

    if(state.currentBetData && !state.currentBetData.game.equals(gameDataAccount))
      commit('SET_PREV_BET_DATA', state.currentBetData)
    else
      commit('SET_PREV_BET_DATA', undefined)


    try {
      const betDataAddress = await BetData.fromAccountAddress(program, payload ? payload : betAccountAddress)

      commit('SET_CURRENT_BET_DATA', betDataAddress)
    } catch (err) {
      commit('SET_CURRENT_BET_DATA', undefined)
    }
  },

  async setNow({commit}) {
    commit('SET_NOW', Date.now())
  },

  prevBetChecked({commit}) {
    commit('SET_CHECKED_PREV_BET')
  },

}

const getters: GetterTree<ProgramState, RootState> = {
  PROGRAM_ADDRESS_STRING(state): string {
    return PROGRAM_ID.toBase58()
  },
  GET_PROGRAM(state): Program<ChartGame> {
    if(!state.program)
      throw new Error("NOT_INITIALIZED_PROGRAM")

    return state.program
  },
  getEventEmitter(state): EventEmitter {
    return state.globalConfigEmitter
  },
  globalConfig(state): GlobalConfigDataArgs {
    return state.globalConfig
  },
  gameCount(state,getters): number {
    if(state.globalConfig && state.games['current']) {
      const gameCount = state.globalConfig.gameCount.toNumber()
      return state.games['current'].endTime.toNumber() <= state.now ? gameCount + 1 : gameCount
    }

    return 0
  },
  beforeGame(state): GameData | undefined {
    if(!state.games['current'])
      return undefined
    const currentGame = state.games['current']
    if(currentGame.endTime.toNumber() <= state.now)
      return state.games['current']
    return state.games['before']
  },
  currentGame(state): GameData | undefined {
    if(!state.games['current'])
      return undefined
    const currentGame = state.games['current']
    if(currentGame.endTime.toNumber() <= state.now)
      return state.games['after']
    return state.games['current']
  },
  rawGames(state):{
    [K in GamesKey]: GameData | undefined;
  } {
    return state.games
  },
  now(state): number {
    return state.now
  },
  getLogs(state): ProgramLog[] {
    return state.logs
  },
  getRecentlyGames(state, getters): GameStatProp[] {
    const recentlyGames = state.recentlyGames ? state.recentlyGames.toGameStat() : []

    //if(getters['currentGame']) {
    //    recentlyGames.push(getters['currentGame'].toGameStat())
    //}

    return recentlyGames
  },
  getTopPlayers(state) {
    return state.topPlayers ? state.topPlayers.formatData() : []
  },
  getCurrentBetData(state): BetData | undefined {
    return state.currentBetData
  },
  getPrevBetData(state): BetData | undefined {
    return state.prevBetData
  },
  getNeedCheckPrevBet(state): boolean {
    return state.needCheckPrevBet
  },
  getLastBet(state) {
    return [state.lastLongBet, state.lastShortBet]
  }
}

const moduleProgram: Module<ProgramState, RootState> = {
  namespaced: true,
  state: new ProgramState(),
  actions,
  mutations,
  getters
}

export default moduleProgram
