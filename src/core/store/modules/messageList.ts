import Cookies from 'js-cookie';
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';

import { MessageList } from '@/api/messageList';

export interface IMessageListState {
	currentMessage: any;
	messageList: any;
}

@Module({ dynamic: true, store, name: 'messageList' })
class MessageListStore extends VuexModule implements IMessageListState {
	public messageList: any = [];
	public currentMessage: any;
	@Mutation
	public INIT() {
		console.log('INIT');
	}

	// @Mutation
	// public SET_CURRENTMESSAGE(message: any) {
	// 	this.currentMessage = message;
	// }
	@Mutation
	private GET_MESSAGE_LIST(messageList: Array<any>) {
		console.log('GET_MESSAGE_LIST');
		console.log(messageList);
		this.messageList = messageList;
	}

	@Action({
		commit: 'GET_MESSAGE_LIST',
	})
	public async getMessageList() {
		const { data } = await MessageList.getMessageList();
		return data;
	}

	get MessageList() {
		return this.messageList;
	}

	// @Action({
	// 	commit: "SET_CURRENTMESSAGE"
	// })
	// public setCurrentMessage(message: any) {
	// 	this.SET_CURRENTMESSAGE(message);
	// }
	// @Mutation({

	// })
	// SET_MESSAGELIST(){

	// }
	// @Action({ commit: 'SET_MESSAGELIST' })
	// public setMessageList(messageList: any) {
	// 	this.messageList = messageList;
	// 	// return this.messageList;
	// }
	// public getMessageList() {
	// 	return this.messageList;
	// }
}

export const MessageListModule = getModule(MessageListStore);
