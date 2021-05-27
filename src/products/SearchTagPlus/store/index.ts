import Vue from 'vue';
import Vuex from 'vuex';
import { IRootState, default as Parent } from '@/store';
// import { IMessageListState } from './modules/messageList';

Vue.use(Vuex);
export type IRootState2 = IRootState;
// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState2>({});
