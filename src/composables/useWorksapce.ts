import {AnchorProvider, Wallet} from "@project-serum/anchor";
import {clusterApiUrl, Connection} from "@solana/web3.js";
import {useAnchorWallet} from "solana-wallets-vue";
import {computed} from "vue";

const preflightCommitment = 'processed'
const commitment = 'processed'


export const initWorkspace = () => {
  const wallet = useAnchorWallet()
  const connection = new Connection(clusterApiUrl('devnet'), commitment)
  const provider = computed(() => new AnchorProvider(connection, <Wallet>wallet.value, { preflightCommitment, commitment }))
  //const program = computed(() => new Program(idl, programID, provider.value))

  return {
    wallet,
    connection,
    provider,
    //program,
  }
}
