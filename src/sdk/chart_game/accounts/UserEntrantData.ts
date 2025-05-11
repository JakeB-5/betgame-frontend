import {AccountTypeDef} from "@/sdk/chart_game/accounts/BaseAccount";
import {BetData} from "@/sdk/chart_game/accounts/BetData";
import {GameData} from "@/sdk/chart_game/accounts/GameData";
import {ChartGame} from "@deployments/chart_game";
import {Amount} from "@/sdk/utils/Amount";
import {BN, Program} from "@project-serum/anchor";
import {PublicKey} from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";

const MAX_LENGTH = 6

export type UserEntrantDataArgs = {
  front: number,
  rear: number,

  entrantsQueue: PublicKey[],
}


export class UserEntrantData implements UserEntrantDataArgs {
  public bets: BetData[]
  public games: GameData[]
  private constructor(
    readonly front: number,
    readonly rear: number,
    readonly entrantsQueue: PublicKey[],
  ) {
    this.bets = new Array<BetData>()
    this.games = new Array<GameData>()
  }

  static fromArgs(args: UserEntrantDataArgs): UserEntrantData {
    return new UserEntrantData(
      args.front,
      args.rear,
      args.entrantsQueue,
    )
  }

  static fromAccount(account: AccountTypeDef<ChartGame>) : UserEntrantData {
    return UserEntrantData.deserialize(account)
  }

  static async fromAccountAddress(
    program: Program<ChartGame>,
    address: PublicKey
  ): Promise<UserEntrantData> {
    const account = await program.account.userEntrantData.fetch(address)
    if(account == null) {
      throw new Error(`Account ${address} not found`)
    }

    return UserEntrantData.fromAccount(account)
  }

  private static deserialize(account: AccountTypeDef<ChartGame>): UserEntrantData {
    return UserEntrantData.fromArgs(account)
  }

  static async addressFromSeeds(program: Program<ChartGame>, user: PublicKey): Promise<PublicKey> {
    const [address] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode('user-entrants'),
        user.toBuffer()
      ],
      program.programId,
    )

    return address
  }


  static async fromSeeds(program: Program<ChartGame>, user: PublicKey): Promise<UserEntrantData> {
    return UserEntrantData.fromAccountAddress(program, await UserEntrantData.addressFromSeeds(program, user))
  }

  public async loadEntrants(program: Program<ChartGame>) {
    const addresses = this.getBetAddresses()

    //console.log(addresses.map(v=>v.toBase58()))
    if(!addresses.length)
      return

    this.bets = await BetData.loadFromAddresses(program, addresses)

    const gameAddresses = this.bets.map(bet => bet.game)
    this.games = await GameData.loadFromAddresses(program, gameAddresses)
  }

  public getBetAddresses(): Array<PublicKey> {
    //const isFull = (this.rear+1)%MAX_LENGTH === this.front
    const length = /*isFull? MAX_LENGTH-1 :*/ this.rear>=this.front? this.rear - this.front : MAX_LENGTH - (this.front-this.rear)

    //console.log(this.rear, this.front, length)

    if(!length)
      return []

    const startIndex = this.front+1
    const addresses = new Array<PublicKey>(length)
    for ( let i = 0; i < length; i++) {
      addresses[i] = this.entrantsQueue[(startIndex+i)%MAX_LENGTH]
    }

    return addresses
  }

  public getLength(): number {
    return this.rear>=this.front? this.rear - this.front : MAX_LENGTH - (this.front-this.rear)
  }

  public claimableAmounts(): BN {

    const claimableAmounts = this.bets.map((bet, i) => {
      const winDirection = this.games[i].winDirection()
      const betDirection = bet.direction()
      const multiple = this.games[i].betted(winDirection).multiple

      //console.log(winDirection, betDirection, multiple, bet.betAmount.toNumber())
      //console.log(Amount.toNumber(this.games[i].longBetAmount,6),
      //  Amount.toNumber(this.games[i].shortBetAmount,6))

      if(!this.games[i].finish)
        return new BN(0)

      if(winDirection === 'DRAW')
        return bet.betAmount

      if(this.games[i].drawOrCancel() === 'canceled')
        return bet.betAmount

      if(winDirection === betDirection)
        return bet.betAmount.muln(multiple*100).divn(100)

      return new BN(0)
    })

    //console.log(claimableAmounts.map(amount => Amount.toNumber(amount,6)))
    if(!claimableAmounts.length)
      return new BN(0)

    return claimableAmounts.reduce((a,b)=>a.add(b))
  }

  public getClaimAccounts(): anchor.web3.AccountMeta[] {
    const accounts: anchor.web3.AccountMeta[] = new Array<anchor.web3.AccountMeta>()

    const betAddresses = this.getBetAddresses()

    this.bets.forEach((bet, i) => {
      accounts.push({
        pubkey: betAddresses[i],
        isWritable: true,
        isSigner: false,
      })
      accounts.push({
        pubkey: bet.game,
        isWritable: true,
        isSigner: false,
      })
    })

    //console.log('accountsLength',accounts.length)
    return accounts
  }


}
