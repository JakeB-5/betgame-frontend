import * as anchor from "@project-serum/anchor";
import {Program, Wallet} from "@project-serum/anchor";
import {ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID} from "@solana/spl-token";
import {
  Commitment,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY, TokenAmount
} from "@solana/web3.js";
import {
  getAtaForMint, getBetDataAccount,
  getFaucetAccount,
  getFaucetHistoryAccount,
  getFaucetTokenVaultAccount, getGameDataAccount,
  getGlobalConfigDataAccount, getTokenVaultAccount, getTopPlayersAccount, getUserDataAccount, getUserEntrantsAccount
} from "./utils/account";
import {debugAccount, debugGameData, debugGlobalConfigData, debugTx} from "./utils/print";
import {sendTelMessage} from "./useTelegram";
import {writeLog} from "./utils/log";
import {ChartGame} from "./deployments/chart_game";
import {Faucet} from "./deployments/faucet";
import fs from "fs";

import {Idl, IdlTypes} from "@project-serum/anchor";
import {IdlAccountDef} from "@project-serum/anchor/dist/esm/idl";
import {TypeDef} from "@project-serum/anchor/dist/esm/program/namespace/types";

export type NullableIdlAccount<IDL extends Idl> = IDL["accounts"] extends undefined
  ? IdlAccountDef
  : NonNullable<IDL["accounts"]>[number];

export type AccountTypeDef<IDL extends Idl> = TypeDef<NullableIdlAccount<IDL>, IdlTypes<IDL>>
const tokenMint = new PublicKey('Aprd94iaNbLY6s856feWQq3panwrtEmNkzDLFmZ1dd4q')

const BOT_USER_COUNT = 4
//const MAX_BET_AMOUNT = 249_500_000
const MAX_BET_AMOUNT = 30_475_000

const log = msg => writeLog(msg, 'betBot')


const sleep = (ms) => {
  return new Promise(resolve=>{
    setTimeout(resolve,ms)
  })
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
const useAnchor = (_wallet?:Wallet) => {
  const walletKeyPair = loadWalletKey('./local-key.json')

  const commitment: Commitment = 'processed'
  const connection = new Connection('https://api.devnet.solana.com', { commitment})
  const options = anchor.AnchorProvider.defaultOptions()
  const wallet = _wallet ? _wallet : new Wallet(walletKeyPair)
  const provider = new anchor.AnchorProvider(connection, wallet, options)

  const idl = JSON.parse( fs.readFileSync('./deployments/chart_game.json', 'utf-8'))
  const program_address = new PublicKey(idl.metadata.address)

  const faucet_idl = JSON.parse( fs.readFileSync('./deployments/faucet.json', 'utf-8'))
  const faucet_program_address = new PublicKey(faucet_idl.metadata.address)


  const program = new Program(idl, program_address, provider ) as Program<ChartGame>
  const faucetProgram = new Program(faucet_idl, faucet_program_address, provider ) as Program<Faucet>
  return {
    provider,
    wallet,
    program,
    faucetProgram,
    connection
  }
}

let _globalConfigData
let _lastFetchedGlobalConfigData = 0

const fetchGlobalConfigData = async (forceFetch = false) => {
  const {program} = useAnchor()
  const [globalConfigDataAccount] = await getGlobalConfigDataAccount(program)

  if( forceFetch
    || !_globalConfigData
    || (Date.now() - _lastFetchedGlobalConfigData) > 60_000
    || _globalConfigData.currentEndTime.toNumber() < Date.now()
  ) {
    _globalConfigData = await debugGlobalConfigData(program,globalConfigDataAccount)
    _lastFetchedGlobalConfigData = Date.now()

  }

  return _globalConfigData
}

const _gameDataKeys: Array<number> = []
const _gameData = {

}
const hasGameData = (startTime:number) => {
  return _gameDataKeys.findIndex(v=> v===startTime) !== -1
}
const fetchGameData = async (startTime:anchor.BN, endTime:anchor.BN, forceFetch = false) => {
  const {program} = useAnchor()
  //
  const [gameDataAccount] = await getGameDataAccount(program, startTime, endTime)
  if(forceFetch || !hasGameData(startTime.toNumber())) {
    const gameData = await debugGameData(program, gameDataAccount)
    _gameDataKeys.push(startTime.toNumber())
    _gameData[startTime.toNumber()] = gameData

    if(_gameDataKeys.length > 15) {
      const removedKey = _gameDataKeys.shift()
      if(removedKey)
        delete _gameData[removedKey]
    }
  }
  return _gameData[startTime.toNumber()]
}

const _betDataKeys: Array<string> = []
const _betData = {

}
const hasBetData = (betAccount:PublicKey) => {
  return _betDataKeys.findIndex(v=> v===betAccount.toBase58()) !== -1
}

const fetchBetData = async ( betAccount: PublicKey, forceFetch = false) => {
  const {program} = useAnchor()
  //
  //const [gameDataAccount] = await getBetDataAccount(program, startTime, endTime)
  if(forceFetch || !hasBetData(betAccount)) {
    const betData = await program.account.betData.fetch(betAccount)
    _betDataKeys.push(betAccount.toBase58())
    _betData[betAccount.toBase58()] = betData

    if(_betDataKeys.length > 30) {
      const removedKey = _betDataKeys.shift()
      if(removedKey)
        delete _betData[removedKey]
    }
  }
  return _betData[betAccount.toBase58()]
}

const requestAirdrop = async (publicKey: PublicKey) => {
  //const { connection } = useAnchor()

  const commitment: Commitment = 'processed'
  const connection = new Connection('https://api.devnet.solana.com', { commitment})

  const tx = await connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL)
  await connection.confirmTransaction(tx)

  log(debugTx(tx, `requestAirdrop For ${publicKey.toBase58()}`))
}

interface IUserBalances {
  balance: number,
  tokenBalance: number,
  lastFetch: number,
}
const _userBalances:{[key:string]:IUserBalances} = {}
const getUserBalances = async (user: Wallet) => {
  if(!_userBalances[user.publicKey.toBase58()]) {
    _userBalances[user.publicKey.toBase58()] = {
      balance: 0,
      tokenBalance: 0,
      lastFetch: 0,
    }
  }

  const balances = _userBalances[user.publicKey.toBase58()]

  if(balances.lastFetch+180000 < Date.now()) {
    _userBalances[user.publicKey.toBase58()] = {
      balance: await getBalance(user.publicKey),
      tokenBalance: await getTokenBalance(user),
      lastFetch: Date.now()
    }
  }

  return _userBalances[user.publicKey.toBase58()]
}

const getBalance = async (publicKey: PublicKey) => {
  const { connection } = useAnchor()

  return await connection.getBalance(publicKey)
}
const requestToken = async (user: Wallet) => {
  const { faucetProgram: program, wallet} = useAnchor(user)

  const [faucetAccount] = await getFaucetAccount(program)
  const [faucetHistory] = await getFaucetHistoryAccount(program, user.publicKey)
  const [tokenVault] = await getFaucetTokenVaultAccount(program)
  const [payerTokenAccount] = await getAtaForMint(tokenMint, user.publicKey)

  const tx = await program.methods.faucet()
    .accounts({
      payer: user.publicKey,
      faucetAccount,
      faucetHistory,
      tokenVault,
      tokenMint,
      payerTokenAccount,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: SYSVAR_RENT_PUBKEY,
      clock: SYSVAR_CLOCK_PUBKEY,
    }).signers([]).rpc()

  log(debugTx(tx, `requestToken For ${user.publicKey.toBase58()}`))
}

const getTokenBalance = async (user: Wallet): Promise<number> => {
  const { connection } = useAnchor()

  const [payerTokenAccount] = await getAtaForMint(tokenMint, user.publicKey)

  try {
    const tokenAccount = await connection.getTokenAccountBalance(payerTokenAccount)
    return parseInt(tokenAccount.value.amount)
  } catch ( err ) {
    return 0
  }
}

const ENTRANTS_MAX_LENGTH = 6
const _entrants = {}
const claim = async (user: Wallet, currentBetAccount: PublicKey) => {
  //
  const { provider, wallet, program } = useAnchor(user)

  const [globalConfigDataAccount] = await getGlobalConfigDataAccount(program)
  const [userDataAccount] = await getUserDataAccount(program, wallet.publicKey)
  const [userEntrantsAccount] = await getUserEntrantsAccount(program, wallet.publicKey)
  const [vaultAccount] = await getTokenVaultAccount(program, tokenMint)
  const [userTokenAccount] = await getAtaForMint(tokenMint, wallet.publicKey)
  const [topPlayersAccount] = await getTopPlayersAccount(program)

  let entrants
  try {
    // if( !_entrants[user.publicKey.toBase58()]) {
    //   _entrants[user.publicKey.toBase58()] = await program.account.userEntrantData.fetch(userEntrantsAccount)
    //   console.log('fetch1')
    // }
    // if(_entrants[user.publicKey.toBase58()].entrantsQueue.findIndex(v => currentBetAccount.equals(v)) == -1) {
    //   console.log('fetch2')
    //   _entrants[user.publicKey.toBase58()] = await program.account.userEntrantData.fetch(userEntrantsAccount)
    // }
    // entrants = _entrants[user.publicKey.toBase58()]
    entrants = await program.account.userEntrantData.fetch(userEntrantsAccount)
  } catch (err) {
    return
  }

  const length = entrants.rear >= entrants.front ? entrants.rear - entrants.front : ENTRANTS_MAX_LENGTH - (entrants.front - entrants.rear)

  if(length < ENTRANTS_MAX_LENGTH - 4)
    return

  const startIndex = entrants.front + 1
  const betAddresses = new Array<PublicKey>(length)
  for( let i = 0; i < length; i++)
    betAddresses[i] = entrants.entrantsQueue[(startIndex+i)%ENTRANTS_MAX_LENGTH]

  const arrBetData = await program.account.betData.fetchMultiple(betAddresses) as AccountTypeDef<ChartGame>[]
  //const gameAddresses = arrBetData.map(bet => bet ? bet.game : PublicKey.default)

  const remainAccounts: anchor.web3.AccountMeta[] = new Array<anchor.web3.AccountMeta>()
  arrBetData.forEach((bet, i) => {
    remainAccounts.push({
      pubkey: betAddresses[i],
      isWritable: true,
      isSigner: false,
    })
    remainAccounts.push({
      pubkey: bet.game,
      isWritable: true,
      isSigner: false,
    })
  })
  log(`CLAIM:${user.publicKey.toBase58()}, length:${length}, rear: ${entrants.rear}, front: ${entrants.front}, acl: ${remainAccounts.length}`)

  const tx = await program.methods.claimPrize()
    .accounts({
      payer: wallet.publicKey,
      globalConfigData : globalConfigDataAccount,
      userData: userDataAccount,
      entrants: userEntrantsAccount,
      tokenMint,
      tokenVault: vaultAccount,
      payerTokenAccount: userTokenAccount,
      topPlayersAccount,
    })
    .remainingAccounts(remainAccounts)
    .signers([]).rpc()

  log(debugTx(tx, `claimPrize`))

}

const getBetAmount = () => Math.floor((Math.random()*(MAX_BET_AMOUNT/2)) + (MAX_BET_AMOUNT/2))

const betGame = async(userIndex: number) => {

  const walletKeyPairName = `./user${userIndex}.json`
  const wallet = new Wallet(loadWalletKey(walletKeyPairName))
  const { provider, program } = useAnchor(wallet)

  log(`[START] betGame::userIndex:${userIndex}:${wallet.publicKey.toBase58()}`)

  const userBalance = await getUserBalances(wallet)
//  console.log(`index: ${userIndex} balance: ${userBalance}`)
//  console.log(userBalance)
  if(userBalance.balance < LAMPORTS_PER_SOL)
    await requestAirdrop(wallet.publicKey)

  const betAmount = getBetAmount()

  const globalConfigData = await fetchGlobalConfigData()
  const [globalConfigDataAccount] = await getGlobalConfigDataAccount(program)

  let startTime = globalConfigData.currentStartTime
  let endTime = globalConfigData.currentEndTime

  if(endTime.toNumber() <= Date.now()) {
    startTime = globalConfigData.afterStartTime
    endTime = globalConfigData.afterEndTime
  }
  const [gameDataAccount] = await getGameDataAccount(program, startTime, endTime)

  //const gameData = await program.account.gameData.fetch(gameDataAccount)
  const gameData = await fetchGameData(startTime, endTime)
  if(gameData.startTime.add(gameData.betPeriod).toNumber() <= Date.now()) {
    return
  }


  const [betDataAccount] = await getBetDataAccount(program, gameDataAccount, wallet.publicKey)
  const [userDataAccount] = await getUserDataAccount(program, wallet.publicKey)
  const [userEntrantsAccount] = await getUserEntrantsAccount(program, wallet.publicKey)
  const [vaultAccount] = await getTokenVaultAccount(program, tokenMint)
  const [userTokenAccount] = await getAtaForMint(tokenMint, wallet.publicKey)

  await claim(wallet, betDataAccount)

  if(userBalance.tokenBalance < betAmount)
    await requestToken(wallet)

  let direction
  try {
    //const betData = await program.account.betData.fetch(betDataAccount)
    const betData = await fetchBetData(betDataAccount)
    direction = betData.betDirection
  } catch (error) {
    direction = Math.random() > 0.5 ? {long:{}} : {short:{}}
  }

  //const direction = _direction === 'long' ? {long:{}} : {short:{}}

    const tx = await program.methods.betGame(
      startTime, endTime,
      direction, new anchor.BN(betAmount)
    )
      .accounts({
        payer: wallet.publicKey,
        globalConfigData: globalConfigDataAccount,
        gameData: gameDataAccount,
        betData: betDataAccount,
        userData: userDataAccount,
        entrants: userEntrantsAccount,
        tokenMint: tokenMint,
        tokenVault: vaultAccount,
        payerTokenAccount: userTokenAccount,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      }).signers([]).rpc()
    log(debugTx(tx, `betGame::${Object.keys(direction).join()}::${betAmount}`))

  log(`[END] betGame::userIndex:${userIndex}`)
}


let in_processing = false
const processor = async () => {
  in_processing = true
    //
    for(let i = 1; i <= BOT_USER_COUNT; i++) {
      try {
        await betGame(i)
      } catch (err) {
        console.error(err)
        log(err.toString())
        log(`[ERROR] betGame::userIndex:${i}`)
        //in_processing = false
        //throw err
      }
      await sleep(3500)
    }

  in_processing = false
}

(async () => {
  //sendTelMessage(`Start Bot Betting`)

  try {
    await processor()
  } catch (e) {
    console.error(e)
    log(e.toString())
  }
    setInterval(async () => {
      try {
      if (!in_processing)
        await processor()
      } catch (e) {
        console.error(e)
        log(e.toString())
      }
    }, 1000)
})()
