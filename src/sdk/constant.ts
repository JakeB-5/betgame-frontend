import {GlobalConfigData} from "@/sdk/chart_game/accounts/GlobalConfigData";
import {ChartGame, IDL} from "@deployments/chart_game";
import {Faucet, IDL as FAUCET_IDL} from "@deployments/faucet";
import {AnchorProvider, Program} from "@project-serum/anchor";
import {PublicKey} from "@solana/web3.js";


export const TOKEN_MINT_ADDRESS = 'Aprd94iaNbLY6s856feWQq3panwrtEmNkzDLFmZ1dd4q'
//export const TOKEN_MINT_ADDRESS = 'HwjA4uPv2xExPiPTVtanJRrVdGo1gkW5kQWNk5RZUpch'
export const TOKEN_MINT_ID = new PublicKey(TOKEN_MINT_ADDRESS)

export const PROGRAM_ADDRESS = 'FdJTfw6ZkVNHKAvB2Fxvce3sGEbK8UpVtzaoMCBeYmKY'
export const PROGRAM_ID = new PublicKey(PROGRAM_ADDRESS)
//export const PROGRAM = new Program(IDL, PROGRAM_ID)

export const FAUCET_PROGRAM_ADDRESS = '9xfdz2dctjv5May6pdXnYEprU4YcPweLnPCVub2aMxKE'
export const FAUCET_PROGRAM_ID = new PublicKey(FAUCET_PROGRAM_ADDRESS)

export const getChartGameProgram = async (provider: AnchorProvider): Promise<Program<ChartGame>> => {
  const program = new Program<ChartGame>(IDL, PROGRAM_ID, provider)
  return program
}

export const getFaucetProgram = async (provider: AnchorProvider): Promise<Program<Faucet>> => {
  return new Program<Faucet>(FAUCET_IDL, FAUCET_PROGRAM_ID, provider)
}
