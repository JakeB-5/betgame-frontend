import {Program, Wallet} from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import {TOKEN_PROGRAM_ID} from "@solana/spl-token";
import * as spl from "@solana/spl-token";

import {Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
import fs from "fs";
import {ChartGame} from "./deployments/chart_game";
import {
  getAtaForMint,
  getBetDataAccount,
  getGameDataAccount,
  getGlobalConfigDataAccount, getTokenVaultAccount,
  getUserDataAccount,
  getUserEntrantsAccount
} from "./utils/account";
import {debugAccount, debugGlobalConfigData} from "./utils/print";


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

  const commitment: Commitment = 'confirmed'
  const connection = new Connection('http://localhost:8899/', { commitment})
  const options = anchor.AnchorProvider.defaultOptions()
  const wallet = _wallet ? _wallet : new Wallet(walletKeyPair)
  const provider = new anchor.AnchorProvider(connection, wallet, options)

  const idl = JSON.parse( fs.readFileSync('./deployments/chart_game.json', 'utf-8'))
  const program_address = new PublicKey(idl.metadata.address)

  const program = new Program(idl, program_address, provider ) as Program<ChartGame>
  return {
    provider,
    wallet,
    program
  }
}

let _globalConfigData
let _lastFetchedGlobalConfigData = 0

const fetchGlobalConfigData = async (forceFetch = false) => {
  const {program} = useAnchor()
  const [globalConfigDataAccount] = await getGlobalConfigDataAccount(program)

  if(forceFetch || (Date.now() - _lastFetchedGlobalConfigData) > 10_000) {
    debugAccount(globalConfigDataAccount, 'fetchGlobalConfigData::globalConfigData')
    _globalConfigData = await program.account.globalConfigData.fetch(globalConfigDataAccount)
    _lastFetchedGlobalConfigData = Date.now()
    await debugGlobalConfigData(program,globalConfigDataAccount)
  }

  return _globalConfigData
}

const tokenMint = new PublicKey('HwjA4uPv2xExPiPTVtanJRrVdGo1gkW5kQWNk5RZUpch')

const requestToken = async (receiver:PublicKey, amount: number) => {
  const {provider, wallet} = useAnchor()

  const mint = new spl.Token(
    provider.connection,
    tokenMint,
    TOKEN_PROGRAM_ID,
    wallet.payer
  )

  const tokenAccount = await mint.getOrCreateAssociatedAccountInfo(receiver)

  await mint.mintTo(
    tokenAccount.address,
    wallet.publicKey,
    [],
    amount,
  )
}

const betGame = async (_direction: 'long'|'short') => {
  const user = Keypair.generate()
  const { program, wallet, provider } = useAnchor(new Wallet(user))

  let tx = await provider.connection.requestAirdrop(user.publicKey, LAMPORTS_PER_SOL)
  await provider.connection.confirmTransaction(tx)

  const betAmount = Math.floor(Math.random()*50_000_000)
  if(!betAmount)
    return
  await requestToken(user.publicKey, betAmount)

  const direction = _direction === 'long' ? {long:{}} : {short:{}}

  const [globalConfigDataAccount, globalConfigDataAccountBump] = await getGlobalConfigDataAccount(program)
  const globalConfigData = await fetchGlobalConfigData()

  let startTime = globalConfigData.currentStartTime
  let endTime = globalConfigData.currentEndTime

  //if(startTime.add())

  if(endTime.toNumber() <= Date.now()) {
    startTime = globalConfigData.afterStartTime
    endTime = globalConfigData.afterEndTime
    //globalConfigData = await fetchGlobalConfigData(true)
  }

  const [gameDataAccount] = await getGameDataAccount(program, startTime, endTime)

  const gameData = await program.account.gameData.fetch(gameDataAccount)
  if(gameData.startTime.add(gameData.betPeriod).toNumber() <= Date.now()) {
    return
  }

  const [betDataAccount] = await getBetDataAccount(program, gameDataAccount, user)
  const [userDataAccount] = await getUserDataAccount(program, user)
  const [userEntrantsAccount] = await getUserEntrantsAccount(program, user)
  const [vaultAccount] = await getTokenVaultAccount(program, tokenMint)
  const [userTokenAccount] = await getAtaForMint(tokenMint, user.publicKey)

  try {
    tx = await program.methods.betGame(
      startTime, endTime,
      direction, new anchor.BN(betAmount)
    )
      .accounts({
        payer: user.publicKey,
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
      }).signers([user]).rpc()
  } catch (error:any) {
    throw new Error(error.message)
  }
  console.log(`TX betGame: ${_direction}: ${tx}`)

}

let in_processing = false
const processor = async () => {
  in_processing = true
  try {
    //const globalConfigData = await fetchGlobalConfigData()


    //return

    for(let i = 0; i < 4; i++) {
      if(Math.random() > 0.5)
        await betGame('long')
      else
        await betGame('short')
    }


  } catch (e) {
    console.error(e)
    await fetchGlobalConfigData(true)
  }
  in_processing = false
}

(async () => {
  await processor()
  setInterval(async () => {
    //console.log(`Start Running Processor`)
    if(!in_processing)
      await processor()
  }, 5000)
})()


