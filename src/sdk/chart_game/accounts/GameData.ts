
import {AccountTypeDef} from "@/sdk/chart_game/accounts/BaseAccount";
import {GameStat, GameStatProp} from "@/sdk/chart_game/types/statistics";
import {ChartGame} from "@deployments/chart_game";
import {Amount} from "@/sdk/utils/Amount";
import {BN, Program} from "@project-serum/anchor";
import {PublicKey} from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import moment from "moment";
import {reactive, Ref, toRefs} from "vue";


export type GameDataArgs = {
  startTime: BN
  endTime: BN
  betPeriod: BN
  openPrice: BN
  closePrice: BN
  longBetAmount: BN
  longBetCount: number
  shortBetAmount: BN
  shortBetCount: number
  claimPrizeCount: BN
  maxLongBetAmount: BN
  maxShortBetAmount: BN
  finish: boolean
}

export class GameData implements GameDataArgs {
  private constructor(
    readonly startTime: BN,
    readonly endTime: BN,
    readonly betPeriod: BN,
    readonly openPrice: BN,
    readonly closePrice: BN,
    readonly longBetAmount: BN,
    readonly longBetCount: number,
    readonly shortBetAmount: BN,
    readonly shortBetCount: number,
    readonly claimPrizeCount: BN,
    readonly maxLongBetAmount: BN,
    readonly maxShortBetAmount: BN,
    readonly finish: boolean
  ){}

  static fromArgs(args: GameDataArgs): GameData {
    return new GameData(
      args.startTime,
      args.endTime,
      args.betPeriod,
      args.openPrice,
      args.closePrice,
      args.longBetAmount,
      args.longBetCount,
      args.shortBetAmount,
      args.shortBetCount,
      args.claimPrizeCount,
      args.maxLongBetAmount,
      args.maxShortBetAmount,
      args.finish
    )
  }

  static fromAccount(account: AccountTypeDef<ChartGame>) : GameData {
//    console.log(account)
    return GameData.deserialize(account)
  }


  static async fromAccountAddress(
    program: Program<ChartGame>,
    address: PublicKey
  ): Promise<GameData> {
    const account = await program.account.gameData.fetch(address)
    if (account == null) {
      throw new Error(`Account ${address} not found`)
    }

    return GameData.fromAccount(account)
  }

  private static deserialize(account: AccountTypeDef<ChartGame>): GameData {
    return GameData.fromArgs(account)
  }

  static async addressFromSeeds(program: Program<ChartGame>, timeRange:[BN,BN]): Promise<PublicKey> {
    const [address] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode('game-data'),
        timeRange[0].toArrayLike(Buffer,'be', 8),
        timeRange[1].toArrayLike(Buffer,'be', 8),],
      program.programId
    )

    return address
  }

  static async fromSeeds(program: Program<ChartGame>, timeRange:[BN,BN]): Promise<GameData> {
    return GameData.fromAccountAddress(program, await GameData.addressFromSeeds(program, timeRange))
  }

  static async loadFromAddresses(program: Program<ChartGame>, addresses: PublicKey[]): Promise<GameData[]> {
    const accounts = (await program.account.gameData.fetchMultiple(addresses)) as AccountTypeDef<ChartGame>[]
    const games = new Array<GameData>()
    accounts.forEach(account => {
      games.push(GameData.deserialize(account))
    })

    return games
  }

  public priceChange(): number {

    return Amount.toNumber(this.closePrice.sub(this.openPrice), 2)
  }

  public priceChangeString(): string {
    let d = '+'
    if(this.winDirection() == 'DRAW')
      d = ' '
    if(this.winDirection() == 'SHORT')
      d = ''

    return `${d}${this.priceChange().toFixed(2)}`
  }

  public priceChangeRate(): string {
    let d = '+'
    if(this.winDirection() == 'DRAW')
      d = ' '
    if(this.winDirection() == 'SHORT')
      d = ''

    return `${d}` + (this.closePrice.sub(this.openPrice).toNumber()/this.closePrice.toNumber()*100).toFixed(2) + '%'
  }

  public numberClosePrice(): number {
    return Amount.toNumber(this.closePrice, 2)
  }
  public numberOpenPrice(): number {
    return Amount.toNumber(this.openPrice, 2)
  }
  public winDirection(): 'LONG'|'SHORT'|'DRAW' {
    const delta = this.closePrice.sub(this.openPrice)

    if(delta.isZero()) {
      return 'DRAW'
    } else if (delta.isNeg()) {
      return 'SHORT'
    } else {
      return 'LONG'
    }
  }

  public betted(direction: 'LONG'|'SHORT'|'DRAW') {
    if(direction == 'LONG') {
      return {
        amount: Amount.toNumber(this.longBetAmount, 6),
        count: this.longBetCount,
        maxAmount: Amount.toNumber(this.maxLongBetAmount, 6),
        multiple: (this.longBetAmount.add(this.shortBetAmount.muln(9).divn(10)).muln(10000).div(this.longBetAmount.addn(0)).toNumber()/10000),
        rate: (this.longBetAmount.toNumber() / (this.longBetAmount.toNumber()+this.shortBetAmount.toNumber()) * 100)
      }
    } else if (direction == 'SHORT') {
      return {
        amount: Amount.toNumber(this.shortBetAmount, 6),
        count: this.shortBetCount,
        maxAmount: Amount.toNumber(this.maxShortBetAmount, 6),
        multiple: (this.shortBetAmount.add(this.longBetAmount.muln(9).divn(10)).muln(10000).div(this.shortBetAmount.addn(0)).toNumber()/10000),
        rate: (this.shortBetAmount.toNumber() / (this.longBetAmount.toNumber()+this.shortBetAmount.toNumber()) * 100)
      }
    } else {
      return {
        amount: 0,
        count: 0,
        maxAmount: 0,
        multiple: 1,
        rate: 0,
      }
    }
  }

  public normalizeRate(direction: 'LONG'|'SHORT') {
    //const longRate = (this.longBetAmount.toNumber() / (this.longBetAmount.toNumber()+this.shortBetAmount.toNumber()) * 100)
    //const shortRate = (this.shortBetAmount.toNumber() / (this.longBetAmount.toNumber()+this.shortBetAmount.toNumber()) * 100)

    const s = Math.max(this.longBetAmount.toNumber(), this.shortBetAmount.toNumber())
    const t = direction == 'LONG' ? this.longBetAmount.toNumber() : this.shortBetAmount.toNumber()

    if(this.longBetAmount.toNumber() + this.shortBetAmount.toNumber() == 2_000_000) {
      return 0
    }

    return t/s*100
    //const f = Math.max(longRate, shortRate)
      //if(direction == 'LONG')
      //return longRate/
  }

  public timeProgressInfo(correction = 0) {
    const seconds = this.endTime.sub(this.startTime).toNumber() - (this.endTime.toNumber() - Date.now())
    return {
      seconds,
      progress: seconds / this.endTime.sub(this.startTime).toNumber() * 100
    }
  }

  public getData() {
    const openPrice = Amount.toNumber(this.openPrice,2)
    const closePrice = Amount.toNumber(this.closePrice,2)
    const changed = closePrice - openPrice
    const changeRate = openPrice ? (changed / openPrice * 100) : 0
    return {
      startTime: this.getStartTime(),
      endTime: this.getEndTime(),
      openPrice,
      closePrice,
      changed,
      changeRate,
      longBetAmount: Amount.toNumber(this.longBetAmount, 6),
      longBetCount: this.longBetCount,
      shortBetAmount: Amount.toNumber(this.shortBetAmount, 6),
      shortBetCount: this.shortBetCount,
      maxLongBetAmount: Amount.toNumber(this.maxLongBetAmount,6),
      maxShortBetAmount: Amount.toNumber(this.maxShortBetAmount,6),
      finish: this.finish,

    }
  }
  public getWinnersData() {
    const betted = this.betted(this.winDirection())
    if(this.finish) {
      return {
        rate : betted.multiple * 100,
        avg : betted.count ? (betted.amount / betted.count) : 0,
        max : betted.maxAmount * betted.multiple
      }
    } else {
      return {
        rate : 0,
        avg : 0,
        max: 0,

      }
    }
  }

  public gameResult() {
    if(!this.finish)
      return 'Not finished'
    if(!this.longBetCount || !this.shortBetCount)
      return 'Canceled (No players)'
    return 'Finished'
    //
  }

  public getStartTime(): number {
    return this.startTime.toNumber()
  }

  public getStartTimeString() {
    //const date = new Date(this.getStartTime())
    // const leftPad = (value: number) => {
    //   return value>=10 ? value : `0${value}`
    // }
    //
    // const year = date.getFullYear()
    // const month = leftPad(date.getMonth()+1)
    // const day = leftPad(date.getDate())
    //
    // const hour = leftPad(date.getHours())
    // const minute = leftPad(date.getMinutes())
    // const seconds = leftPad(date.getSeconds())
    //
    // return [year, month, day].join('-') + ' ' + [hour, minute, seconds].join(':')
    const date = moment(this.getStartTime())
    return date.format('Y-MM-DD HH:mm')
  }

  public getEndTime(): number {
    return this.endTime.toNumber()
  }

  public getEndTimeString() {
    const date = moment(this.getEndTime())
    return date.format('Y-MM-DD HH:mm')
  }

  public getYieldRate() {
    return this.betted(this.winDirection()).multiple * 100
  }

  public toGameStat(): GameStatProp {
    //console.log(this.longBetAmount.toString(), this.shortBetAmount.toString())
    return new GameStatProp({
      startTime: this.startTime.toNumber(),
      volume: Amount.toNumber(this.longBetAmount.add(this.shortBetAmount), 6),
      changed: Amount.toNumber(this.closePrice.sub(this.openPrice), 2),
      long: {
        amount: Amount.toNumber(this.longBetAmount, 6),
        player: this.longBetCount,
        multiple: (this.longBetAmount.add(this.shortBetAmount.muln(9).divn(10)).muln(10000).div(this.longBetAmount.addn(0)).toNumber()/10000),
        win: this.closePrice.gt(this.openPrice)
      },
      short: {
        amount: Amount.toNumber(this.shortBetAmount, 6),
        player: this.shortBetCount,
        multiple: (this.shortBetAmount.add(this.longBetAmount.muln(9).divn(10)).muln(10000).div(this.shortBetAmount.addn(0)).toNumber()/10000),
        win: this.openPrice.gt(this.closePrice)
      },
    })
  }

  public drawOrCancel(): string {
    if ( this.longBetCount === 0 || this.shortBetCount === 0)
      return 'canceled'
    if ( this.openPrice.eq(this.closePrice) )
      return 'draw'

    return ''
  }

  public isEqualsTime(startTime: BN, endTime: BN): boolean {
    return this.startTime.eq(startTime) && this.endTime.eq(endTime)
  }

}


export const findGameDataAddress = (
  program: Program<ChartGame>,
  startTime: BN,
  endTime: BN,
): Promise<[PublicKey, number]> => {
  return PublicKey.findProgramAddress(
    [anchor.utils.bytes.utf8.encode('game-data'),
      startTime.toArrayLike(Buffer,'be', 8),
      endTime.toArrayLike(Buffer,'be', 8),
    ],
    program.programId
  )
}

export const getGameDataAccount = async (
  program: Program<ChartGame>,
  startTime: BN,
  endTime: BN,
) => {
  return await program.account.gameData.fetch((await findGameDataAddress(program, startTime, endTime))[0])
}

export const getGameDataAccounts = async (
  program: Program<ChartGame>,
  addresses: PublicKey[]
) => {
  return await program.account.gameData.fetchMultiple(addresses)
}
