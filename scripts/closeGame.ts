import {Idl, IdlTypes, Program, Wallet} from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import {IdlAccountDef} from "@project-serum/anchor/dist/esm/idl";
import {TypeDef} from "@project-serum/anchor/dist/esm/program/namespace/types";
import {Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SYSVAR_CLOCK_PUBKEY} from "@solana/web3.js";
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

const log = msg => writeLog(msg, 'closeGame')

const sleep = (ms) => {
  return new Promise(resolve=>{
    setTimeout(resolve,ms)
  })
}

export type NullableIdlAccount<IDL extends Idl> = IDL["accounts"] extends undefined
  ? IdlAccountDef
  : NonNullable<IDL["accounts"]>[number];
export type AccountTypeDef<IDL extends Idl> = TypeDef<NullableIdlAccount<IDL>, IdlTypes<IDL>>


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
const useAnchor = () => {
  const walletKeyPair = loadWalletKey('./manager.json')

  const commitment: Commitment = 'processed'
  const connection = new Connection('https://api.devnet.solana.com', { commitment})
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

const getGameDataAccounts = async () => {
  const {program} = useAnchor()

  const accounts = await program.account.gameData.all()

  console.log(`accounts length: ${accounts.length}`)
  return accounts
}

const isClosableGameDataAccount = (gameData: AccountTypeDef<ChartGame>): boolean => {

  if(!gameData.finish)
    return false
  if(gameData.longBetCount+gameData.shortBetCount != gameData.claimPrizeCount.toNumber())
    return false
  if(gameData.endTime.toNumber() > Date.now() - (24*60*60*1000))
    return false


  return true
}

const getBalance = async () => {
  const {connection, wallet } = useAnchor()

  return await connection.getBalance(wallet.publicKey)
}

const closeGameDataAccount = async (gameData: AccountTypeDef<ChartGame>) => {
  //
  const { program, wallet } = useAnchor()
  const [globalConfigDataAccount] = await getGlobalConfigDataAccount(program)
  const [gameDataAccount] = await getGameDataAccount(program, gameData.startTime, gameData.endTime)

  const tx = await program.methods
    .closeGame(gameData.startTime, gameData.endTime)
    .accounts({
      payer: wallet.publicKey,
      gameData: gameDataAccount,
      globalConfigData: globalConfigDataAccount,
      clock: SYSVAR_CLOCK_PUBKEY
    }).signers([wallet.payer]).rpc()

  log(debugTx(tx, 'closeGame'))
  log(`Manager Balance: ${await getBalance()}`)
}

let in_processing = false
const processor = async () => {
  in_processing = true

  try {
    const accounts = await getGameDataAccounts()
    const filteredAccounts = accounts.filter(account => isClosableGameDataAccount(account.account)).map(account => account.account)
    const closableLength = filteredAccounts.length

    console.log(`filteredAccounts length: ${filteredAccounts.length}`)
    for( const [index, account] of filteredAccounts.entries() ) {
      console.log(`try close game: ${index} / ${closableLength}`)
      await closeGameDataAccount(account)
      await sleep(500)
    }
    // for(let i = accounts.length-1; i > accounts.length-5; i--) {
    //   const account = accounts[i].account
    //   const closable = isClosableGameDataAccount(account)
    //   console.log(`${accounts[i].publicKey.toBase58()} is closable:${closable}`)
    //   await debugGameData(program, accounts[i].publicKey)
    // }
  } catch (e) {
    in_processing = false
    throw e
  }
  in_processing = false
}


(async () => {

  try {
    await processor()
  } catch (e) {
    console.error(e)
    log(e.toString())
  }

})()


