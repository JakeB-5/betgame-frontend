import {BN} from "@project-serum/anchor";

export class Amount {

  public static toNumber(lamports: BN, decimals: number): number {

    const str = lamports.toString(10, decimals)

    return parseFloat(str.slice(0, -decimals) + "." + str.slice(-decimals))
  }

  public static fromNumber(amount: number | string, decimals: number): BN {
    let _amount
    if(typeof amount === 'string') {
      _amount = parseFloat(amount)
    } else {
      _amount = amount
    }
    return new BN(_amount*10**decimals)
  }
}
