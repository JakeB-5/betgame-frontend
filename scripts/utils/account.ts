import {ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID} from "@solana/spl-token";
import {Keypair, PublicKey} from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { Program } from '@project-serum/anchor'
import {ChartGame, IDL} from "../deployments/chart_game";
import {Faucet} from "../deployments/faucet";


export const getGlobalConfigDataAccount = (
  program: Program<ChartGame>,
  ): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddress(
    [Buffer.from(anchor.utils.bytes.utf8.encode('global-config'))],
    program.programId,
  )
}

export const getGameDataAccount = (
  program: Program<ChartGame>,
  startTime: anchor.BN,
  endTime: anchor.BN,
): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('game-data')),
      startTime.toBuffer('be', 8),
      endTime.toBuffer('be', 8),
    ],
    program.programId,
  )
}

export const getTokenVaultAccount = (
  program: Program<ChartGame>,
  mint: PublicKey,
): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('token-vault')),
      mint.toBuffer(),
    ],
    program.programId,
  )
}

export const getAtaForMint = async (
  mint: PublicKey,
  owner: PublicKey
):Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddress([
    owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()
  ], ASSOCIATED_TOKEN_PROGRAM_ID)
}


export const getBetDataAccount = (program: Program<ChartGame>, gameDataAccount: PublicKey, better: PublicKey) => {
  return PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('bet-data')),
      gameDataAccount.toBuffer(),
      better.toBuffer(),
    ],
    program.programId,
  )
}

export const getUserEntrantsAccount = (program: Program<ChartGame>, better: PublicKey) => {
  return PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('user-entrants')),
      better.toBuffer(),
    ],
    program.programId,
  )
}

export const getUserDataAccount = (program: Program<ChartGame>, better: PublicKey) => {
  return PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('user-data')),
      better.toBuffer(),
    ],
    program.programId,
  )
}

export const getTopPlayersAccount = (program: Program<any>) => {
  return PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('top-players')),
    ],
    program.programId,
  )
}
export const getRecentlyGamesAccount = (program: Program<any>) => {
  return PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('recently-games')),
    ],
    program.programId,
  )
}


export const getFaucetTokenVaultAccount = (program: Program<Faucet>) => {
  return PublicKey.findProgramAddress(
    [Buffer.from(anchor.utils.bytes.utf8.encode('token-vault'))],
    program.programId,
  )
}
export const getFaucetAccount = (program: Program<Faucet>) => {
  return PublicKey.findProgramAddress(
    [Buffer.from(anchor.utils.bytes.utf8.encode('faucet-account'))],
    program.programId,
  )
}
export const getFaucetHistoryAccount = (program: Program<Faucet>, user: PublicKey) => {
  return PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode('faucet-history')),
      user.toBuffer(),
    ],
    program.programId,
  )
}
