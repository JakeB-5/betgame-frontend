import {BetDirection} from "@/sdk/chart_game/types/enums";
import {Amount} from "@/sdk/utils/Amount";
import {BN} from "@project-serum/anchor";
import {Logs, PublicKey} from "@solana/web3.js";
import moment, {Moment} from "moment";

export type ProgramLog = {
  signature: string,
  fullSignature: string,
  instruction: string,
  time: Moment,
  data?: any,
  className? : any,
}

const INSTRUCTION_LOG = 'Program log: Instruction: '
const INSTRUCTION_LOG_START = INSTRUCTION_LOG.length
export class LogParser {
  public static parse(logs: Logs, time=Date.now()) {
    //console.log(log)
    if(logs.err)
      return null
    let instruction = ''
    for(const log of logs.logs) {
      //console.log(log)
      if(log.startsWith(INSTRUCTION_LOG)) {
        instruction = log.slice(INSTRUCTION_LOG_START, log.length)
        break
      }
    }
    return {
      signature: logs.signature.slice(0,5)+'...'+logs.signature.slice(-5),
      fullSignature: logs.signature,
      instruction,
      time: moment.unix(Math.floor(time/1000))
    }
  }

  // public static test(): ProgramLog {
  //   let instruction = ''
  //   for(const log of test.logs) {
  //     //console.log(log)
  //     if(log.startsWith(INSTRUCTION_LOG)) {
  //       instruction = log.slice(INSTRUCTION_LOG_START, log.length)
  //     }
  //   }
  //   return {
  //     signature: test.signature.slice(0,5)+'...'+test.signature.slice(-5),
  //     fullSignature: test.signature,
  //     instruction,
  //     date: Date.now()
  //   }
  // }
  public static fromUserBetEvent(args: {
    user: PublicKey,
    startTime: BN,
    endTime: BN,
    betDirection: BetDirection | null,
    betAmount: BN,
  }) {

    //console.log(args)

    const address = args.user.toBase58()
    const direction = Object.keys(args.betDirection).join('')
    return {
      signature: address.slice(0,5)+'...'+address.slice(-5),
      fullSignature: address,
      instruction: `Bet ${direction.toUpperCase()}`,
      time: moment.unix(Math.floor(Date.now()/1000)),
      data: Amount.toNumber(args.betAmount, 6),
      className: {'bet':true, [`bet-${direction}`]:true}
    }
  }

  public static fromGameChangedEvent(args: {
    beforeStartTime: BN,
    beforeEndTime: BN,
    currentStartTime: BN,
    currentEndTime: BN,
    afterStartTime: BN,
    afterEndTime: BN,
  }) {
    //console.log(args)

  }
}
