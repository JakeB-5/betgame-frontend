import {AccountTypeDef} from "@/sdk/chart_game/accounts/BaseAccount";
import {BetData} from "@/sdk/chart_game/accounts/BetData";
import {GameData} from "@/sdk/chart_game/accounts/GameData";
import {ChartGame} from "@deployments/chart_game";
import {Amount} from "@/sdk/utils/Amount";
import {BN, Program} from "@project-serum/anchor";
import {PublicKey} from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";


export type TopPlayer = {
  account: PublicKey,
  prize: BN,
  countWin: number,
  countLose: number,
  countDraw: number,
}

export type TopPlayersArgs = {
  players: TopPlayer[]
}

export class TopPlayers implements TopPlayersArgs {
  private constructor(
    readonly players: TopPlayer[]
  ) {}


  static fromArgs(args: TopPlayersArgs): TopPlayers {
    return new TopPlayers(
      args.players
    )
  }

  static fromAccount(account: AccountTypeDef<ChartGame>) : TopPlayers {
    return TopPlayers.deserialize(account)
  }

  static async fromAccountAddress(
    program: Program<ChartGame>,
    address: PublicKey
  ): Promise<TopPlayers> {
    const account = await program.account.topPlayers.fetch(address)
    //console.log(account)
    if(account == null) {
      throw new Error(`Account ${address} not found`)
    }

    return TopPlayers.fromAccount(account)
  }

  private static deserialize(account: AccountTypeDef<ChartGame>): TopPlayers {
    return TopPlayers.fromArgs(account as TopPlayersArgs)
  }

  static async addressFromSeeds(program: Program<ChartGame>): Promise<PublicKey> {
    const [address] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode('top-players'),
      ],
      program.programId,
    )

    return address
  }


  static async fromSeeds(program: Program<ChartGame>): Promise<TopPlayers> {
    return TopPlayers.fromAccountAddress(program, await TopPlayers.addressFromSeeds(program))
  }

  public formatData() {
    //console.log(this.players)
    return this.players.filter(player => !player.account.equals(PublicKey.default)).map(player => {
      const fullAddress = player.account.toBase58()
      return {
        address: fullAddress.slice(0,5)+'...'+fullAddress.slice(-5),
        fullAddress: fullAddress,
        prize: Amount.toNumber(player.prize, 6),
        winRate: player.countWin / (player.countWin+player.countLose+player.countDraw) *100

      }
    })
  }
}
