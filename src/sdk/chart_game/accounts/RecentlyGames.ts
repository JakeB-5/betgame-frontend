import {AccountTypeDef} from "@/sdk/chart_game/accounts/BaseAccount";
import {GameData} from "@/sdk/chart_game/accounts/GameData";
import {GameResult} from "@/sdk/chart_game/types/enums";
import {GameStatProp} from "@/sdk/chart_game/types/statistics";
import {Amount} from "@/sdk/utils/Amount";
import {ChartGame} from "@deployments/chart_game";
import {formatNumber} from "@/sdk/utils";
import * as anchor from "@project-serum/anchor";
import {BN, Program} from "@project-serum/anchor";
import {PublicKey} from "@solana/web3.js";

const MAX_LENGTH = 16
export type GameSummary = {
  startTime: BN
  longBetAmount: BN
  longBetCount: number
  shortBetAmount: BN
  shortBetCount: number
  changed: BN

}
export type RecentlyGamesArgs = {
  front: number
  rear: number
  queue: GameSummary[]
}

export class RecentlyGames implements RecentlyGamesArgs {

  private constructor(
    readonly front: number,
    readonly rear: number,
    readonly queue: GameSummary[]
  ) {
  }

  static fromArgs(args: RecentlyGamesArgs): RecentlyGames {
    return new RecentlyGames(
      args.front,
      args.rear,
      args.queue
    )
  }
  static fromAccount(account: AccountTypeDef<ChartGame>) : RecentlyGames {
    return RecentlyGames.deserialize(account)
  }

  static async fromAccountAddress(
    program: Program<ChartGame>,
    address: PublicKey
  ): Promise<RecentlyGames> {
    const account = await program.account.recentlyGames.fetch(address)
    if (account == null) {
      throw new Error(`Account ${address} not found`)
    }

    return RecentlyGames.fromAccount(account)
  }

  private static deserialize(account: AccountTypeDef<ChartGame>): RecentlyGames {
    return RecentlyGames.fromArgs(account as RecentlyGamesArgs)
  }

  static async addressFromSeeds(program: Program<ChartGame>): Promise<PublicKey> {
    const [address] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode('recently-games')],
      program.programId
    )
    //console.log(address.toBase58())

    return address
  }

  static async fromSeeds(program: Program<ChartGame>): Promise<RecentlyGames> {
    return RecentlyGames.fromAccountAddress(program, await RecentlyGames.addressFromSeeds(program))
  }

  private getSummaries() {
    const length = this.rear>=this.front? this.rear - this.front : MAX_LENGTH - (this.front-this.rear)

    const startIndex = this.front+1
    const summaries = new Array<GameSummary>(length)
    for ( let i = 0; i < length; i++) {
      summaries[i] = this.queue[(startIndex+i)%MAX_LENGTH]
    }
    return summaries
  }

  public toGameStat() : GameStatProp[] {
    return this.getSummaries().map(summary => {
      //console.log(summary.startTime.toNumber(),summary.longBetAmount.toNumber(), summary.shortBetAmount.toNumber())
      return new GameStatProp({
        startTime: summary.startTime.toNumber(),
        volume: Amount.toNumber(summary.longBetAmount.add(summary.shortBetAmount), 6),
        changed: Amount.toNumber(summary.changed, 2),
        long: {
          amount: Amount.toNumber(summary.longBetAmount, 6),
          player: summary.longBetCount,
          multiple: (summary.longBetAmount.add(summary.shortBetAmount.muln(9).divn(10)).muln(10000).div(summary.longBetAmount.addn(0)).toNumber()/10000),
          win: !summary.changed.isNeg()
        },
        short: {
          amount: Amount.toNumber(summary.shortBetAmount, 6),
          player: summary.shortBetCount,
          multiple: (summary.shortBetAmount.add(summary.longBetAmount.muln(9).divn(10)).muln(10000).div(summary.shortBetAmount.addn(0)).toNumber()/10000),
          win: summary.changed.isNeg()
        },
      })
    })
  }
}
