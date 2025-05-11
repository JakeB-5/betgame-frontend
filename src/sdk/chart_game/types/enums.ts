

export type GameStateNames = 'Pending' | 'OnGoing' | 'Pausing'
export type GameState = {
  [key in GameStateNames]?: any
}

export type BetDirectionNames = 'Long' | 'Short'
export type BetDirection = {
  [key in BetDirectionNames]?: any
}
/*export enum GameState {
  Pending,
  OnGoing,
  Pausing,
}*/

export type GameResultNames = 'Long' | 'Short' | 'Draw' | 'Cancel'
export type GameResult = {
  [key in GameResultNames]?: any
}

