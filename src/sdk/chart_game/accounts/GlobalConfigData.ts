import {AccountTypeDef} from "@/sdk/chart_game/accounts/BaseAccount";
import {GameData} from "@/sdk/chart_game/accounts/GameData";
import {GameState} from "@/sdk/chart_game/types/enums";
import {ChartGame} from "@deployments/chart_game";
import {BN, Program} from "@project-serum/anchor";
import {PublicKey} from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";


export type GlobalConfigDataArgs = {
  authority: PublicKey
  managerAccount: PublicKey
  gameCount: anchor.BN
  gameState: GameState | null
  beforeStartTime: anchor.BN
  beforeEndTime: anchor.BN
  currentStartTime: anchor.BN
  currentEndTime: anchor.BN
  afterStartTime: anchor.BN
  afterEndTime: anchor.BN
  tokenMint: PublicKey
  bump: number
  slot: anchor.BN
  blockTime: anchor.BN
  timePerSlot: anchor.BN
  timeCorrection: anchor.BN
  timeCorrectionPerSlot: anchor.BN
}

export class GlobalConfigData implements GlobalConfigDataArgs {
  private constructor(
    readonly authority: PublicKey,
    readonly managerAccount: PublicKey,
    readonly gameCount: BN,
    readonly gameState: GameState | null,
    readonly beforeStartTime: BN,
    readonly beforeEndTime: BN,
    readonly currentStartTime: BN,
    readonly currentEndTime: BN,
    readonly afterStartTime: BN,
    readonly afterEndTime: BN,
    readonly tokenMint: PublicKey,
    readonly bump: number,
    readonly slot: BN,
    readonly blockTime: BN,
    readonly timePerSlot: BN,
    readonly timeCorrection: BN,
    readonly timeCorrectionPerSlot: BN,
  ) {
  }
  static fromArgs(args: GlobalConfigDataArgs): GlobalConfigData {
    return new GlobalConfigData(
      args.authority,
      args.managerAccount,
      args.gameCount,
      args.gameState,
      args.beforeStartTime,
      args.beforeEndTime,
      args.currentStartTime,
      args.currentEndTime,
      args.afterStartTime,
      args.afterEndTime,
      args.tokenMint,
      args.bump,
      args.slot,
      args.blockTime,
      args.timePerSlot,
      args.timeCorrection,
      args.timeCorrectionPerSlot,
    )
  }

  static fromAccount(account:AccountTypeDef<ChartGame>) : GlobalConfigData {
    return GlobalConfigData.deserialize(account)
  }

  static async fromAccountAddress(
    program: Program<ChartGame>,
    address: PublicKey
  ): Promise<GlobalConfigData> {
    const account = await program.account.globalConfigData.fetch(address)
    if (account == null) {
      throw new Error(`Account ${address} not found`)
    }

    return GlobalConfigData.fromAccount(account)
  }

  static deserialize(account:AccountTypeDef<ChartGame>) : GlobalConfigData {
    return GlobalConfigData.fromArgs(account)
  }

  static async addressFromSeeds(program: Program<ChartGame>): Promise<PublicKey> {
    const [address] = await PublicKey.findProgramAddress(
      [anchor.utils.bytes.utf8.encode('global-config')],
      program.programId
    )
    return address
  }

  static async fromSeeds(program: Program<ChartGame>): Promise<GlobalConfigData> {
    return GlobalConfigData.fromAccountAddress(program, await GlobalConfigData.addressFromSeeds(program))
  }

  public currentGame(program: Program<ChartGame>): Promise<GameData> {
    return GameData.fromSeeds(program, [this.currentStartTime, this.currentEndTime])
  }

  public currentTime(): [BN, BN] {
    return [this.currentStartTime, this.currentEndTime]
  }

  public beforeTime(): [BN, BN] {
    return [this.beforeStartTime, this.beforeEndTime]
  }
  public afterTime(): [BN, BN] {
    return [this.afterStartTime, this.afterEndTime]
  }

  static async subscribeChanges(program: Program<ChartGame>) {
    const address = await GlobalConfigData.addressFromSeeds(program)
    return program.account.globalConfigData.subscribe(address)
  }

  public getTimeCorrection() {
    return this.timeCorrection.toNumber()
  }

}


export const findGlobalConfigDataAddress = (
  program: Program<ChartGame>,
): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddress(
    [anchor.utils.bytes.utf8.encode('global-config')],
    program.programId
  )
}
export const findTokenVaultAddress = (
  program: Program<ChartGame>,
  mint: PublicKey,
): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddress(
    [
      anchor.utils.bytes.utf8.encode('token-vault'),
      mint.toBuffer()
    ],
    program.programId
  )
}


export const getGlobalConfigDataAccount = async (
  program: Program<ChartGame>
) => {
  return await program.account.globalConfigData.fetch((await findGlobalConfigDataAddress(program))[0])
}

