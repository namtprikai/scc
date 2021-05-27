import Vue from 'vue';
import Vuex from 'vuex';
import { IAppState } from './modules/app';
import { IUserState } from './modules/user';
import { IScenarioState } from './modules/scenario';
import { ITalkScriptState } from './modules/talkScript';
Vue.use(Vuex);

export interface IRootState {
	// app: IAppState;
	// user: IUserState;
	// scenario: IScenarioState;
	// talkscript: ITalkScriptState;
	// botConfig: IBotConfigState;
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({});
