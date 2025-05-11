import {RootState} from "@/store";
import moduleProfile from "@/store/game/profile";
import moduleProgram, {ProgramState} from "@/store/game/program";
import moduleToken, {TokenState} from "@/store/game/token";
import {Module} from "vuex";


export interface IGameState {
  //
  program: ProgramState
  token: TokenState
}

export class GameState implements IGameState {
  program = new ProgramState()
  token = new TokenState()
}

const moduleGame: Module<GameState, RootState> = {
  namespaced: true,
  modules: {
    program: moduleProgram,
    token: moduleToken,
    profile: moduleProfile,
  }
}

export default moduleGame
