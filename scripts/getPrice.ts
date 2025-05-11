import {Program, Wallet} from "@project-serum/anchor";
import {ChartGame, IDL} from "./deployments/chart_game";
import { InvalidArgumentError, program } from 'commander';
import * as fs from "fs";
import  Binance from 'node-binance-api'
import {Commitment, Connection, Keypair, PublicKey} from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";


program.version('0.0.2');

function loadWalletKey(keypair): Keypair {
  if (!keypair || keypair == '') {
    throw new Error('Keypair is required!');
  }
  const loaded = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(keypair).toString())),
  );
  console.info(`wallet public key: ${loaded.publicKey}`);
  return loaded;
}

programCommand('get-price', { requireWallet: false})
  .action(async( directory, cmd) => {

    const binance = new Binance().options({
      APIKEY: 'API-KEY',
      APISECRET: 'API-SECRET',
    })
    console.info( await binance.futuresCandles('BTCUSDT', '1m', {
      limit: 2
    }) );
    console.info( await binance.futuresTime())

    const timestamp = Date.now()
    console.info(`timestamp: ${timestamp}`)
    console.info(`StartTimestamp: ${Math.floor(timestamp/60000)*60000}`)
  })

programCommand('contract-initialize')
  .action(async( directory, cmd) => {
    const { keypair, env, cacheName } = cmd.opts()
    const walletKeyPair = loadWalletKey(keypair)

    const commitment: Commitment = 'confirmed'
    const connection = new Connection('http://localhost:8899/', { commitment})
    const options = anchor.AnchorProvider.defaultOptions()
    const wallet = new Wallet(walletKeyPair)
    const provider = new anchor.AnchorProvider(connection, wallet, options)

    const program = new Program<ChartGame>(IDL, new PublicKey('PROGRAM-ID'), provider )
    //program.methods.initialize().accounts({})

  })

programCommand('test')
  .action(async( directory, cmd) => {
    const { keypair, env, cacheName } = cmd.opts()

    const timestamp = Date.now()
    console.info(`timestamp: ${timestamp}`)
    console.info(`StartTimestamp: ${Math.floor(timestamp/60000)*60000}`)

  })

function programCommand(
  name: string,
  options: { requireWallet: boolean } = { requireWallet: true },
) {
  let cmProgram = program
    .command(name)
    .option(
      '-e, --env <string>',
      'Solana cluster env name',
      'localnet', //mainnet-beta, testnet, devnet
    )

  if (options.requireWallet) {
    cmProgram = cmProgram.requiredOption(
      '-k, --keypair <path>',
      `Solana wallet location`,
      './local-key.json'
    );

  }

  return cmProgram;
}
program.parse(process.argv);
