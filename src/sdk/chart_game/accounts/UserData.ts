import {AccountTypeDef} from "@/sdk/chart_game/accounts/BaseAccount";
import {ChartGame} from "@deployments/chart_game";
import {Amount} from "@/sdk/utils/Amount";
import * as anchor from "@project-serum/anchor";
import {BN, Program} from "@project-serum/anchor";
import {PublicKey} from "@solana/web3.js";


export type UserDataArgs = {
  countWin: number
  countLose: number
  countDraw: number
  countBet: number
  countGame: number
  totalBet: BN
  totalLongBet: BN
  totalShortBet: BN
  totalClaim: BN
}

export class UserData implements UserDataArgs {
  private constructor(
    readonly countWin: number,
    readonly countLose: number,
    readonly countDraw: number,
    readonly countBet: number,
    readonly countGame: number,
    readonly totalBet: BN,
    readonly totalLongBet: BN,
    readonly totalShortBet: BN,
    readonly totalClaim: BN,
  ) {}

  static fromArgs(args: UserDataArgs): UserData {
    return new UserData(
      args.countWin,
      args.countLose,
      args.countDraw,
      args.countBet,
      args.countGame,
      args.totalBet,
      args.totalLongBet,
      args.totalShortBet,
      args.totalClaim,
    )
  }

  static fromAccount(account: AccountTypeDef<ChartGame>) : UserData {
    return UserData.deserialize(account)
  }

  static async fromAccountAddress(
    program: Program<ChartGame>,
    address: PublicKey
  ): Promise<UserData> {
    const account = await program.account.userData.fetch(address)
    if (account == null) {
      throw new Error(`Account ${address} not found`)
    }

    return UserData.fromAccount(account)
  }

  private static deserialize(account: AccountTypeDef<ChartGame>): UserData {
    return UserData.fromArgs(account)
  }

  static async fromSeeds(
    program: Program<ChartGame>,
    user: PublicKey
  ) {
    const [address] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode('user-data'),
        user.toBytes()
      ],
      program.programId
    )

    return UserData.fromAccountAddress(program, address)
  }

  public counts() {
    return {
      win: this.countWin,
      lose: this.countLose,
      draw: this.countDraw,
      bet: this.countBet,
      game: this.countGame,
    }
  }

  public amounts() {
    return {
      bet: Amount.toNumber(this.totalBet, 6),
      longBet: Amount.toNumber(this.totalLongBet, 6),
      shortBet: Amount.toNumber(this.totalShortBet, 6),
      claim: Amount.toNumber(this.totalClaim, 6),
    }
  }
}
