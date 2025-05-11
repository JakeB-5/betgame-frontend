import {Program, Wallet} from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import {Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
import * as fs from "fs";
import Binance from "node-binance-api";
import {sendTelMessage} from "./useTelegram";
import {writeLog} from "./utils/log";
import {debugAccount, debugGameData, debugGlobalConfigData, debugTx} from "./utils/print";
import {
  getGameDataAccount,
  getGlobalConfigDataAccount,
  getRecentlyGamesAccount,
  getTopPlayersAccount
} from "./utils/account";
import {ChartGame, IDL} from "./deployments/chart_game";


interface ICandleRawData {
  openTime: number
  open: string
  high: string
  low: string
  close: string
  volume: string
  closeTime: number
  quoteAssetVolume: string
  trades: number
  takerBuyVolume: string
  takerBuyQuoteAssetVolume: string
  ignored: string
}

interface ICandleData {
  openTime: number
  closeTime: number
  open: number
  close: number
}

const log = msg => writeLog(msg, 'updateGame')

const convertCandleData = (data): ICandleData => {
  return {
    openTime: data[0],
    closeTime: data[6],
    open: Number(data[1])*100,
    close: Number(data[4])*100,
  }
}

const loadWalletKey = (keypair): Keypair => {
  if (!keypair || keypair == '') {
    throw new Error('Keypair is required!');
  }
  const loaded = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(keypair).toString())),
  );
  //console.info(`wallet public key: ${loaded.publicKey}`);
  return loaded;
}
const getCandle = async (startTime?: number) => {

  const binance = new Binance().options({
    APIKEY: 'API-KEY',
    APISECRET: 'API-SECRET',
  })
  const prices = await binance.futuresCandles('BTCUSDT', '3m', {
    limit: 2,
    startTime: startTime
  })
  //console.info( prices );

  return {
    prev: prices[0],
    current: prices[1],
  }
}

const getPeriod = () => 180000
const getFormalTime = () => {
  return Math.floor(Date.now()/getPeriod())*getPeriod()
}

const getCorrectionTime = async () => {
  const {provider} = useAnchor()
  //console.log(Date.now())
  const slot = await provider.connection.getSlot()
  //const now = Date.now()
  const blockTime = await provider.connection.getBlockTime(slot)

  //console.log(slot, blockTime!*1000, Date.now())

  return Date.now() -(blockTime!*1000)
}

const useAnchor = () => {
  const walletKeyPair = loadWalletKey('./manager.json')

  const commitment: Commitment = 'processed'
  const connection = new Connection('https://api.devnet.solana.com', { commitment})
  //const connection = new Connection('https://api.devnet.solana.com', { commitment})
  //const connection = new Connection('http://localhost:8899/', { commitment})
  const options = anchor.AnchorProvider.defaultOptions()
  const wallet = new Wallet(walletKeyPair)
  const provider = new anchor.AnchorProvider(connection, wallet, options)

  const idl = JSON.parse( fs.readFileSync('./scripts/deployments/chart_game.json', 'utf-8'))
  if(!idl.metadata.address)
    throw new Error('No address for chart_game.json')

  const program_address = new PublicKey(idl.metadata.address)

  const program = new Program(idl, program_address, provider ) as Program<ChartGame>
  return {
    provider,
    wallet,
    program,
    connection
  }
}

const isNeedUpdate = async () => {
  const {provider, wallet, program} = useAnchor()

  const globalConfigData = await fetchGlobalConfigData()

  const currentStartTime = globalConfigData.currentStartTime
  const currentEndTime = globalConfigData.currentEndTime

  if(currentEndTime.toNumber() < Date.now()) {
    const [currentGameDataAccount] = await getGameDataAccount(program, currentStartTime, currentEndTime)

    const currentGameData = await program.account.gameData.fetch(currentGameDataAccount)

    if(!currentGameData.finish)
      return true
    else
      await fetchGlobalConfigData(true)
  }

  //debugAccount(currentGameDataAccount, `isNeedUpdate::currentGameData[${currentStartTime.toNumber()},${currentEndTime.toNumber()}], ${currentEndTime.toNumber() < Date.now() && !currentGameData.finish}`)

  // if(currentEndTime.toNumber() < Date.now() && !currentGameData.finish)
  //   return true

  return false
}

const updateGame = async () => {
  //console.log(`Trigger UpdateGame`)
  const {provider, wallet, program} = useAnchor()

  const [globalConfigDataAccount, globalConfigDataAccountBump] = await getGlobalConfigDataAccount(program)

  const globalConfigData = await fetchGlobalConfigData()

  const beforeStartTime = globalConfigData.currentStartTime
  const beforeEndTime = globalConfigData.currentEndTime
  const currentStartTime = globalConfigData.afterStartTime
  const currentEndTime = globalConfigData.afterEndTime
  const afterStartTime = new anchor.BN(getFormalTime()+getPeriod())
  const afterEndTime = afterStartTime.addn(getPeriod()-1)

  if(currentStartTime.toNumber() === afterStartTime.toNumber()) {
    log(`need not update, ${currentStartTime.toNumber()}, ${afterStartTime.toNumber()}`)
    return
  }

  const [beforeGameDataAccount] = await getGameDataAccount(program, beforeStartTime, beforeEndTime)
  const [currentGameDataAccount] = await getGameDataAccount(program, currentStartTime, currentEndTime)
  const [afterGameDataAccount] = await getGameDataAccount(program, afterStartTime, afterEndTime)
  const [recentlyGamesAccount] = await getRecentlyGamesAccount(program)


  // debugAccount(globalConfigDataAccount, 'updateGame::globalConfigData')
  // debugAccount(beforeGameDataAccount, `updateGame::beforeGameData[${beforeStartTime.toNumber()},${beforeEndTime.toNumber()}]`)
  // debugAccount(currentGameDataAccount, `updateGame::currentGameData[${currentStartTime.toNumber()},${currentEndTime.toNumber()}]`)
  // debugAccount(afterGameDataAccount, `updateGame::afterGameData[${afterStartTime.toNumber()},${afterEndTime.toNumber()}]`)

  const { prev: rawCandle } = await getCandle(beforeStartTime.toNumber())

  const candle = convertCandleData(rawCandle)

  if(candle.openTime !== beforeStartTime.toNumber())
    throw new Error(`invalid candle time, ${candle.openTime}, ${beforeStartTime.toNumber()}`)

    const correctionTime = await getCorrectionTime()
    const tx = await program.methods
      .updateGame(
        beforeStartTime, beforeEndTime,
        new anchor.BN(candle.open), new anchor.BN(candle.close),
        currentStartTime, currentEndTime,
        afterStartTime, afterEndTime,
        new anchor.BN(correctionTime))
      .accounts({
        payer: wallet.publicKey,
        globalConfigData: globalConfigDataAccount,
        beforeGameData: beforeGameDataAccount,
        currentGameData: currentGameDataAccount,
        afterGameData: afterGameDataAccount,
        recentlyGamesAccount,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      })
      .signers([wallet.payer]).rpc()
    await fetchGlobalConfigData(true)
    //await debugGameData(program,beforeGameDataAccount,`updateGame::beforeGameData`)
    //await debugGameData(program,currentGameDataAccount,`updateGame::currentGameData`)
    //await debugGameData(program,afterGameDataAccount,`updateGame::afterGameData`)

    log(debugTx(tx, 'updateGame'))
    log(`before: ${beforeStartTime.toNumber()}, ${beforeEndTime.toNumber()}, current: ${currentStartTime.toNumber()}, ${currentEndTime.toNumber()}, after: ${afterStartTime.toNumber()}, ${afterEndTime.toNumber()}`)
    log(`candle: ${candle.open}, ${candle.close}, correction: ${correctionTime}`)

}

const initGame = async () => {
  const {provider, wallet, program} = useAnchor()

  const startTime = new anchor.BN(getFormalTime())
  const endTime = startTime.addn(getPeriod()-1)
  const afterStartTime = startTime.addn(getPeriod())
  const afterEndTime = afterStartTime.addn(getPeriod()-1)

  const [globalConfigDataAccount, globalConfigDataAccountBump] = await getGlobalConfigDataAccount(program)
  const [gameDataAccount, gameDataAccountBump] = await getGameDataAccount(program, startTime, endTime)
  const [afterGameDataAccount, afterGameDataAccountBump] = await getGameDataAccount(program, afterStartTime, afterEndTime)
  const [topPlayersAccount] = await getTopPlayersAccount(program)
  const [recentlyGamesAccount] = await getRecentlyGamesAccount(program)
  // debugAccount(globalConfigDataAccount, 'initGame::globalConfigData')
  // debugAccount(gameDataAccount, `initGame::gameData[${startTime.toNumber()},${endTime.toNumber()}]`)
  // debugAccount(afterGameDataAccount, `initGame::afterGameData[${afterStartTime.toNumber()},${afterEndTime.toNumber()}]`)

    const correctionTime = await getCorrectionTime()
    const tx = await program.methods
      .initGame(startTime, endTime, afterStartTime, afterEndTime, new anchor.BN(correctionTime))
      .accounts({
        globalConfigData: globalConfigDataAccount,
        gameData: gameDataAccount,
        afterGameData: afterGameDataAccount,
        topPlayersAccount,
        recentlyGamesAccount,
        payer: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      })
      .signers([wallet.payer]).rpc()

    log(debugTx(tx, 'initGame'))
    await fetchGlobalConfigData(true)
    //await debugGameData(program,gameDataAccount, 'initGame::gameData')
    //await debugGameData(program,afterGameDataAccount, 'initGame::afterGameData')


  //
}

let _globalConfigData
let _lastFetchedGlobalConfigData = 0
const fetchGlobalConfigData = async (forceFetch = false) => {
  const {program} = useAnchor()
  const [globalConfigDataAccount] = await getGlobalConfigDataAccount(program)

  if ( forceFetch
    || !_globalConfigData
    || (Date.now() - _lastFetchedGlobalConfigData) > 60_000
    || _globalConfigData.currentEndTime.toNumber() < Date.now()
  ) {
    _globalConfigData = await debugGlobalConfigData(program,globalConfigDataAccount)
    _lastFetchedGlobalConfigData = Date.now()

  }
  // if(forceFetch || (Date.now() - _lastFetchedGlobalConfigData) > 5_000) {
  //   debugAccount(globalConfigDataAccount, 'fetchGlobalConfigData::globalConfigData')
  //   _globalConfigData = await debugGlobalConfigData(program,globalConfigDataAccount)
  //   _lastFetchedGlobalConfigData = Date.now()
  // }

  return _globalConfigData
}

let in_processing = false
const processor = async () => {
  in_processing = true
  try {
    const globalConfigData = await fetchGlobalConfigData()

    await checkBalance()

    if (Object.keys(globalConfigData.gameState??{}).includes('pending')) {
      await initGame()
    }

    if (await isNeedUpdate()) {
      await updateGame()
    }
  } catch (e) {
    //console.error(e)
    in_processing = false
    throw e
  }
  in_processing = false
}

let lastLowBalanceAlert = 0
let lastBalanceCheck = 0
let balance = 0
const checkBalance = async () => {
  const { wallet } = useAnchor()

  const commitment: Commitment = 'processed'
  const connection = new Connection('https://api.devnet.solana.com', { commitment})

  if(lastBalanceCheck + 60*60*1000 <= Date.now()) {
    balance = await connection.getBalance(wallet.publicKey)
    lastBalanceCheck = Date.now()
  }

  if( balance < LAMPORTS_PER_SOL) {
    log('[WARNING] manager account balance is low')

    //Alert on 8 hours
    if(lastLowBalanceAlert + 28_800_000 <= Date.now()) {
      sendTelMessage(`[WARNING] manager account balance is low`)
      lastLowBalanceAlert = Date.now()

      const tx = await connection.requestAirdrop(wallet.publicKey, 1 * LAMPORTS_PER_SOL)
      await connection.confirmTransaction(tx)

      log(debugTx(tx, 'requestAirdrop For manager account'))
    }
  }
}

(async () => {
  //sendTelMessage(`Start Game Processor`)

  try {
    await processor()
  } catch (e) {
    console.error(e)
    log(e.toString())
  }
    //return
    setInterval(async () => {
      //console.log(`Start Running Processor`)
      try {
        if (!in_processing)
          await processor()
      } catch (err) {
        console.error(err)
        log(err.toString())
      }
    }, 1000)

})()


