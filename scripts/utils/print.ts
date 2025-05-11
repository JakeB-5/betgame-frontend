import {Keypair, PublicKey} from "@solana/web3.js";
import {IdlAccountDef} from "@project-serum/anchor/dist/esm/idl";
import {AllAccountsMap, TypeDef} from "@project-serum/anchor/dist/esm/program/namespace/types";
import {writeLog} from "./log";
import {ChartGame, IDL} from "../deployments/chart_game";
import * as anchor from "@project-serum/anchor";
import {AccountNamespace, IdlTypes, Program, ProgramErrorStack} from "@project-serum/anchor";


export const debugTx = (txSignature: string, txName = '') => {
  const msg = `\x1b[33m [${(Date.now()/1000).toFixed(3)} INFO TX] ${txName}: ${txSignature}\x1b[0m`
  console.log(msg)
  return msg
  //writeLog(msg)
}
export const debugAccount = (account: Keypair | PublicKey, accountName = '') => {
  const msg = `\x1b[33m [${(Date.now()/1000).toFixed(3)} INFO ACCOUNT] ${accountName}: ${account instanceof Keypair ? account.publicKey.toBase58() : account.toBase58()}\x1b[0m`
  console.log(msg)
  return msg
}

export const debugGlobalConfigData = async (program: Program<ChartGame>,globalConfigDataAccount: PublicKey) => {
  const account = await fetchAccount(program,'globalConfigData', globalConfigDataAccount)

  console.log(`\x1b[33m [${(Date.now()/1000).toFixed(3)} DEBUG] globalConfigData: ${globalConfigDataAccount}\x1b[0m`)
  console.log(`\x1b[90m  authority: ${account.authority.toBase58()}`)
  //console.log(`  managerAccount: ${account.managerAccount.toBase58()}`)
  console.log(`  gameCount: ${account.gameCount.toNumber()},  gameState: ${Object.keys(account.gameState ?? {}).join(',')},  Correction: ${account.timeCorrection.toNumber()}`)
  console.log(`  current: [${account.currentStartTime.toNumber()}, ${account.currentEndTime.toNumber()}]`,
    `| before: [${account.beforeStartTime.toNumber()}, ${account.beforeEndTime.toNumber()}]`,
    `| after: [${account.afterStartTime.toNumber()}, ${account.afterEndTime.toNumber()}]`)

  //console.log(`  currentStartTime: ${account.currentStartTime.toNumber()} currentEndTime: ${account.currentEndTime.toNumber()}`)
  //console.log(`  beforeStartTime: ${account.beforeStartTime.toNumber()} beforeEndTime: ${account.beforeEndTime.toNumber()}`)
  //console.log(`  afterStartTime: ${account.afterStartTime.toNumber()} afterEndTime: ${account.afterEndTime.toNumber()}`)
  //console.log(`  tokenMint: ${account.tokenMint.toBase58()}`)
  //console.log(`  tokenVault: ${account.tokenVault.toBase58()}`)
  console.log(`\x1b[33m [END DEBUG]\x1b[0m `)

  return account
}

export const debugGameData = async (program: Program<ChartGame>,gameDataAccount: PublicKey, accountName = 'gameData') => {
  const account = await fetchAccount(program,'gameData', gameDataAccount)
  console.log(`\x1b[33m [${(Date.now()/1000).toFixed(3)} DEBUG] ${accountName}: ${gameDataAccount}\x1b[0m`)
  console.log(`\x1b[90m  startTime: ${account.startTime}, endTime: ${account.endTime}, finish: ${account.finish}, claimCount: ${account.claimPrizeCount}`)
  console.log(`  openPrice: ${account.openPrice}, closePrice: ${account.closePrice}`,
    `| longBetAmount: ${account.longBetAmount}, longBetCount: ${account.longBetCount}`,
    `| shortBetAmount: ${account.shortBetAmount}, shortBetCount: ${account.shortBetCount}`)

  //console.log(`  openPrice: ${account.openPrice}, closePrice: ${account.closePrice}`)
  //console.log(`  longBetAmount: ${account.longBetAmount}, longBetCount: ${account.longBetCount}`)
  //console.log(`  shortBetAmount: ${account.shortBetAmount}, shortBetCount: ${account.shortBetCount}`)
  console.log(`\x1b[33m [END DEBUG]\x1b[0m `)

  return account
}


export const debugUserData = async (program: Program<ChartGame>,userDataAccount: PublicKey) => {
  const account = await fetchAccount(program,'userData', userDataAccount)
  console.log(`\x1b[33m [DEBUG] userData: ${userDataAccount}\x1b[0m`)

  console.log(`  countWin: ${account.countWin}, countLose: ${account.countLose}, countDraw: ${account.countDraw}`)
  console.log(`  countBet: ${account.countBet}, countGame: ${account.countGame}`)
  console.log(`  totalBet: ${account.totalBet}, totalClaim: ${account.totalClaim}`)
  console.log(`  totalLongBet: ${account.totalLongBet}, totalShortBet: ${account.totalShortBet}`)


  console.log(`\x1b[33m [END DEBUG]\x1b[0m `)

  return account
}

export const fetchAccount = async (
  program: Program<ChartGame>,
  accountName: keyof AllAccountsMap<ChartGame>,
  accountKey: PublicKey
): Promise<TypeDef<ChartGame["accounts"] extends undefined
  ? IdlAccountDef
  : NonNullable<ChartGame["accounts"][number]>,
  IdlTypes<ChartGame>>> => {
  //const program = anchor.workspace.ChartGame as Program<ChartGame>;

  return await program.account[accountName].fetch(accountKey)
}
