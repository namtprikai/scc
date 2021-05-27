import store from '../store/index';
import { inherits } from 'util';
import { MessageListModule } from '../store/modules/messageList';
import { UserModule } from '@/store/modules/user';
import io from 'socket.io-client';
import { Auth } from '@/utils/auth';
import { apiUrl } from '@product/utils/configration';
const sound = require('./sound/sound02.wav');
const Push = require('push.js');
export namespace MessageListService {
	let socket: any = null;
	export async function init() {
		const token = await Auth.getToken();
		console.log('token set');
		socket = io(`${apiUrl}?room=objectupdate&token=${token}`, {
			transports: ['websocket', 'polling'],
			reconnection: true,
			reconnectionDelay: 5000,
			timeout: 6000,
			autoConnect: true,
		});
		socket.on('connect', (message: any) => {
			console.log(message);
		});
		socket.on('connect_error', (message: any) => {
			console.log(message);
			setTimeout(() => {
				if (Auth.isLogin()) {
					socket.connect();
				}
			}, 1000);
		});
		socket.on('reconnect_error', (message: any) => {
			console.log(message);
			setTimeout(() => {
				if (Auth.isLogin()) {
					socket.connect();
				}
			}, 1000);
		});
		socket.on('objectupdate', (message: any) => {
			console.info(message);
			if (message.method == 'insert' && !message.body.is_admin && !(message.object == 'admin_user')) {
				if (message.object == 'message') {
					notification('新規メッセージがあります', 'AIChatSupporter');
				}
				// try{
				// 	if(message.body.type=="text"){
				// 		//message.body.text
				// 		this.notification("新規メッセージがあります","AIChatSupporter");
				// 	}else if(message.body.type=="image"){
				// 		// this.notification("新規メッセージ通知","画像");
				// 		this.notification("新規メッセージがあります","AIChatSupporter");
				// 	}else{
				// 		// this.notification("新規メッセージ通知","");
				// 		this.notification("新規メッセージがあります","AIChatSupporter");
				// 	}
				// 	Broadcaster.getInstance().trigger('objectupdateMessage',message);
				// }catch(e){
				// 	// this.notification("新規メッセージ通知","");
				// 	this.notification("新規メッセージがあります","AIChatSupporter");
				// }

				// this.doGetMessageList();
			} else if (message.object == 'message' && message.body.assignee_id !== UserModule.id) {
				// this.notification("新規メッセージ","AIChatSupporter");
				// this.doGetMessageList();
			}
			getMessageList();
		});
		socket.on('disconnect', (message: any) => {
			UserModule.GetInfo().then(() => {
				setTimeout(() => {
					if (Auth.isLogin()) {
						socket.connect();
					}
				}, 1000);
			});
		});
		getMessageList();
	}
	function getMessageList() {
		MessageListModule.getMessageList();
	}
	let notificationTimeId: any = null;
	function notification(title = '', text = '') {
		if (notificationTimeId != null) {
			clearTimeout(notificationTimeId);
		}
		notificationTimeId = setTimeout(() => {
			doNotification(title, text);
		}, 1000);
	}
	async function playSound() {
		return new Promise<void>(r => {
			const audio = new Audio(sound);
			audio.currentTime = 0;

			audio.addEventListener(
				'ended',
				() => {
					r();
				},
				false,
			);
			audio.play();
		});
	}
	function doNotification(title = '', text = '') {
		console.log('notification');
		const options = {
			body: text,
			// icon: require("../head/img/logo.png"),
			url: 'SAIChatSupporter',
			onShow: async () => {
				await playSound();
				await playSound();
				await playSound();
			},
		};
		Push.create(title, options);
	}
}
