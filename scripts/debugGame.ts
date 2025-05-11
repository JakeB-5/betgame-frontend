import {Program, Wallet} from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import {Commitment, Connection, Keypair, PublicKey} from "@solana/web3.js";
import {getGameDataAccount, getRecentlyGamesAccount, getUserDataAccount} from "./utils/account";
import {debugGameData, debugUserData} from "./utils/print";
import {ChartGame} from "./deployments/chart_game";
import fs from "fs";

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

const fetchGameData = async (startTime: number, endTime: number) => {
  const { provider, wallet, program, connection } = useAnchor()

  const [gameDataAddress] = await getGameDataAccount(program, new anchor.BN(startTime), new anchor.BN(endTime))
  const gameData = await debugGameData(program, gameDataAddress)


}

const fetchUserData = async (user: PublicKey) => {
  const { provider, wallet, program, connection } = useAnchor()

  const [userDataAddress] = await getUserDataAccount(program, user)
  const userData = await debugUserData(program, userDataAddress)
}

const fetchRecentlyGamesData = async () => {
  const { provider, wallet, program, connection } = useAnchor()

  const [recentGamesDataAddress] = await getRecentlyGamesAccount(program)
  const recentlyGames = await program.account.recentlyGames.fetch(recentGamesDataAddress)

  console.log(recentlyGames)
}

(async () => {
  const { provider, wallet, program, connection } = useAnchor()
  //const startTime = 1665398880000

  // for (let i = 0; i < 15; i++) {
  //   await fetchGameData(startTime + (180000 * i), startTime + (180000 * i) + 179999)
  // }

  // for( let j = 1; j <= 4; j++) {
  //   const walletKeyPairName = `./user${j}.json`
  //   const wallet = new Wallet(loadWalletKey(walletKeyPairName))
  //   await fetchUserData(wallet.publicKey)
  //
  // }
  const [gameDataAddress] = await getGameDataAccount(program, new anchor.BN(1665405000000), new anchor.BN(1665405000000+179999))
  const gameData = await debugGameData(program, gameDataAddress)

  //await fetchRecentlyGamesData()

})()
