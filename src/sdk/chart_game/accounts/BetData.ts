import {AccountTypeDef} from "@/sdk/chart_game/accounts/BaseAccount";
import {GameData} from "@/sdk/chart_game/accounts/GameData";
import {BetDirection} from "@/sdk/chart_game/types/enums";
import {ChartGame} from "@deployments/chart_game";
import {Amount} from "@/sdk/utils/Amount";
import * as anchor from "@project-serum/anchor";
import {BN, Program} from "@project-serum/anchor";
import {PublicKey} from "@solana/web3.js";

export type BetDataArgs = {
  game: PublicKey,
  user: PublicKey,
  betDirection: BetDirection | null
  betAmount: BN,
}

export class BetData implements BetDataArgs {
  private constructor(
    readonly game: PublicKey,
    readonly user: PublicKey,
    readonly betDirection: BetDirection | null,
    readonly betAmount: BN
  ) { }

  static fromArgs(args: BetDataArgs): BetData {
    return new BetData(
      args.game,
      args.user,
      args.betDirection,
      args.betAmount,
    )
  }

  static fromAccount(account: AccountTypeDef<ChartGame>) : BetData {
    return BetData.deserialize(account)
  }

  static async fromAccountAddress(
    program: Program<ChartGame>,
    address: PublicKey
  ): Promise<BetData> {
    const account = await program.account.betData.fetch(address)
    if (account == null) {
      throw new Error(`Account ${address} not found`)
    }

    return BetData.fromAccount(account)
  }

  private static deserialize(account: AccountTypeDef<ChartGame>): BetData {
    return BetData.fromArgs(account)
  }

  static async fromSeeds(
    program: Program<ChartGame>,
    gameData: PublicKey,
    user: PublicKey
  ) {

    return BetData.fromAccountAddress(program, await BetData.addressFromSeeds(program, gameData, user))
  }

  static async addressFromSeeds(
    program: Program<ChartGame>,
    gameData: PublicKey,
    user: PublicKey ) {
    const [address] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode('bet-data'),
        gameData.toBuffer(),
        user.toBytes()
      ],
      program.programId
    )

    return address
  }

  static async loadFromAddresses(program: Program<ChartGame>, addresses: PublicKey[]): Promise<BetData[]> {
    const accounts = (await program.account.betData.fetchMultiple(addresses)) as AccountTypeDef<ChartGame>[]
    const bets = new Array<BetData>()
    accounts.forEach(account => {
      bets.push(BetData.deserialize(account))
    })

    return bets
  }

  public direction(): 'LONG' | 'SHORT' {
    //console.log(this.betDirection, Object.keys(this.betDirection).join())
    if(Object.keys(this.betDirection).join().includes('long'))
      return 'LONG'
    return 'SHORT'
  }

  public amount(): number {
    return Amount.toNumber(this.betAmount, 6)
  }

  public estimateYieldRate(gameData: GameData): number {
    return gameData.betted(this.direction()).multiple * 100
  }

  public estimateYield(gameData: GameData) : number {
    return gameData.betted(this.direction()).multiple * this.amount()
  }


}
