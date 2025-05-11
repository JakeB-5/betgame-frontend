import moment from "moment/moment";


export type AllowedDirection = 'long' | 'short'
type BetData = {
  amount: number,
  player: number,
  multiple: number,
  win: boolean
}
export type GameStat = {
  [key in AllowedDirection]: BetData;
} & {
  startTime: number;
  volume: number;
  changed: number;
};

export class GameStatProp implements GameStat {
  long: BetData;
  short: BetData;
  startTime: number;
  volume: number;
  changed: number;

  constructor(data: GameStat) {
    this.long = data.long
    this.short = data.short
    this.startTime = data.startTime
    this.volume = data.volume
    this.changed = data.changed
  }

  public normalizeVolume(maxVolume: number) {
    return {
      bar: Math.round(this.volume/maxVolume*10000)/100,
      long: Math.round(this.long.amount/this.volume*10000)/100,
      short: Math.round(this.short.amount/this.volume*10000)/100,
    }
  }

  public getSimpleStartTimeString(): string {
    const date = moment.unix(Math.floor(this.startTime/1000))

    return date.format('MM-DD HH:mm')
    // const date = new Date(this.startTime)
    // const month = date.getMonth() + 1
    // const day = date.getDate()
    // const hour = date.getHours()
    // const minute = date.getMinutes()
    //
    // return [month,day].join('-')+' '+[hour,minute].join(':')
  }

}
