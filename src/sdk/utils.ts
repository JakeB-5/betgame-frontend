import {AnchorProvider, BN, Program, Spl} from "@project-serum/anchor";
import { getTokenAccount, Provider } from "@project-serum/common";
import {ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID} from "@solana/spl-token";
import * as spl from '@solana/spl-token'
import * as anchor from '@project-serum/anchor'
import {Keypair, LAMPORTS_PER_SOL, PublicKey} from "@solana/web3.js";
import {ChartGame} from "scripts/deployments/chart_game";

export async function getTokenBalance(
  provider: AnchorProvider,
  ata: PublicKey,
) {
  //const ataAccount = await getTokenAccount(provider as anchor.Provider, ata)
  //const accounts = provider.connection.getParsedTokenAccountsByOwner()
  const tokenProgram = Spl.token(provider)
  const ataAccount = await tokenProgram.account.token.fetch(ata)
  //console.log(ataAccount)
  return await provider.connection.getTokenAccountBalance(ata)
}


export const getAtaForMint = async (
  mint: PublicKey,
  owner: PublicKey
):Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddress([
    owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()
  ], ASSOCIATED_TOKEN_PROGRAM_ID)
}

export const getTokenInfo = async (
  provider: AnchorProvider,
  mint: PublicKey,
  owner: PublicKey,
): Promise<Partial<Token>> => {
  const [ata] = await getAtaForMint(mint, owner)
  const tokenProgram = Spl.token(provider)
  try {
    const ataAccount = await tokenProgram.account.token.fetch(ata)

    return {
      address: ata,
      amount: ataAccount.amount,
      authority: ataAccount.authority,
      isInitialized: true,
    }
  } catch(e) {
    return {
      address: ata,
      amount: new BN(0),
      isInitialized: false,
    }
  }
}

export const getMint = async (
  provider: AnchorProvider,
  mintAddress: PublicKey
): Promise<Mint> => {
  const tokenProgram = Spl.token(provider)
  const mint = await tokenProgram.account.mint.fetch(mintAddress)

  return {
    address: mintAddress,
    mintAuthority: mint.mintAuthority,
    freezeAuthority: mint.freezeAuthority,
    supply: mint.supply,
    decimals: mint.decimals,
    isInitialized: mint.isInitialized,
  }
}

export const getSolana = async (
  provider: AnchorProvider,
  owner: PublicKey,
) => {
  return new anchor.BN(await provider.connection.getBalance(owner))
}

export interface Mint {
  address: PublicKey,
  mintAuthority: PublicKey | null,
  freezeAuthority: PublicKey | null,
  supply: BN,
  decimals: number,
  isInitialized: boolean,
}

export interface Token {
  address: PublicKey,
  mint: PublicKey,
  authority: PublicKey,
  amount: BN,
  isInitialized: boolean,
}


export const toDate = (value?: anchor.BN) => {
  if (!value) {
    return
  }

  return new Date(value.toNumber() * 1000)
}

const numberFormater = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const formatNumber = {
  format: (val?: number) => {
    if (!val) {
      return '--'
    }

    return numberFormater.format(val)
  },
  asNumber: (val?: anchor.BN) => {
    if (!val) {
      return undefined
    }

    return val.toNumber() / LAMPORTS_PER_SOL
  },
}
export interface AlertState {
  open: boolean
  message: string
  severity: 'success' | 'info' | 'warning' | 'error' | undefined
}
export const toEther = (amountWei: string | BN, decimals: number) => {
  return new BN(amountWei).div(new BN(10 ** decimals));
};

export const toEtherString = (amountWei: string | BN, decimals = 9) => {
  return new BN(amountWei)
    .div(new BN(10 ** decimals))
    .toNumber()
    .toFixed(2);
};



export const getBetDataAccount = (program: Program<ChartGame>, gameDataAccount: PublicKey, better: PublicKey) => {
  return PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode('bet-data'),
      gameDataAccount.toBuffer(),
      better.toBuffer(),
    ],
    program.programId,
  )
}

export const getUserEntrantsAccount = (program: Program<ChartGame>, better: PublicKey) => {
  return PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode('user-entrants'),
      better.toBuffer(),
    ],
    program.programId,
  )
}

export const getUserDataAccount = (program: Program<ChartGame>, better: PublicKey) => {
  return PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode('user-data'),
      better.toBuffer(),
    ],
    program.programId,
  )
}
